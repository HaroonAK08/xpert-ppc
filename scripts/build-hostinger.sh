#!/usr/bin/env bash
# Builds the Hostinger upload ZIPs. This is the ONLY approved way to make them.
#
#   scripts/build-hostinger.sh website|backend|courses|all
#
# Every ZIP is source-only: NO node_modules, NO .next, NO .env files.
# Hostinger runs `npm install` + `npm run build` itself. The backend is the one
# exception to "source": it ships compiled JS in dist/ (still no node_modules).
#
# Output: <repo parent>/hostinger-builds/  (override with HOSTINGER_OUT_DIR)
# See docs/hostinger-builds.md for what each ZIP contains and why.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${HOSTINGER_OUT_DIR:-$ROOT/../hostinger-builds}"
STAMP="$(date +%Y-%m-%d-%H%M%S)"
mkdir -p "$OUT_DIR"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"

die() { echo "ERROR: $*" >&2; exit 1; }

# Fail if the ZIP is corrupt or contains anything Hostinger must not receive.
verify() {
  local zip="$1"; shift
  unzip -tq "$zip" >/dev/null || die "$zip failed integrity check"
  # Read the listing once: piping unzip into `grep -q` trips pipefail (SIGPIPE).
  local listing; listing="$(unzip -Z1 "$zip")"
  # .env.example is expected; any other .env*, node_modules or .next is not.
  if grep -E '(^|/)node_modules/|(^|/)\.next/|(^|/)\.env' <<<"$listing" | grep -qv '\.env\.example$'; then
    die "$zip contains node_modules, .next or a real .env file"
  fi
  local f
  for f in "$@"; do
    grep -qxF "$f" <<<"$listing" || die "$zip is missing expected entry: $f"
  done
  echo "  OK  $(basename "$zip")  ($(du -h "$zip" | cut -f1))"
}

build_website() {
  echo "==> website (frontend, source-only)"
  # frontend/shared and shared/ are hand-kept mirrors. The ZIP uses frontend/shared.
  if ! diff -rq "$ROOT/shared" "$ROOT/frontend/shared" >/dev/null; then
    echo "WARN: shared/ and frontend/shared/ differ. Copy shared/ changes into frontend/shared/ first." >&2
    diff -rq "$ROOT/shared" "$ROOT/frontend/shared" >&2 || true
    die "refusing to package a stale frontend/shared"
  fi
  local zip="$OUT_DIR/xpertppc-main-website-hostinger-source-fixed-$STAMP.zip"
  (cd "$ROOT/frontend" && zip -qr "$zip" \
    src shared public package.json next.config.mjs next-env.d.ts \
    postcss.config.mjs tailwind.config.ts tsconfig.json .env.example)
  verify "$zip" package.json next.config.mjs .env.example
}

build_backend() {
  echo "==> backend (compiled dist/, no node_modules)"
  local tmp; tmp="$(mktemp -d)"
  # Compile into a temp dir so the local backend/dist is left untouched.
  # tsconfig rootDir is the repo root, so output is dist/backend/src + dist/shared.
  (cd "$ROOT/backend" && npx tsc -p tsconfig.json --outDir "$tmp/dist")
  cp "$ROOT/backend/package.json" "$ROOT/backend/.env.example" \
     "$ROOT/backend/hostinger.env.example" "$tmp/"
  local zip="$OUT_DIR/xpertppc-backend-hostinger-latest-$STAMP.zip"
  (cd "$tmp" && zip -qr "$zip" dist package.json .env.example hostinger.env.example)
  rm -rf "$tmp"
  verify "$zip" package.json hostinger.env.example dist/backend/src/server.js
}

build_courses() {
  echo "==> courses / academy (courses-frontend, source-only)"
  local zip="$OUT_DIR/xpertppc-courses-academy-hostinger-source-$STAMP.zip"
  (cd "$ROOT/courses-frontend" && zip -qr "$zip" \
    src public package.json package-lock.json next.config.mjs next-env.d.ts \
    postcss.config.mjs tailwind.config.ts tsconfig.json .env.example)
  verify "$zip" package.json package-lock.json next.config.mjs .env.example
}

case "${1:-}" in
  website) build_website ;;
  backend) build_backend ;;
  courses) build_courses ;;
  all)     build_website; build_backend; build_courses ;;
  *) echo "usage: $0 website|backend|courses|all" >&2; exit 2 ;;
esac
echo "Output dir: $OUT_DIR"
