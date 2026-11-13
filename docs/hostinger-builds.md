# Hostinger upload ZIPs

**Rule: build these with `scripts/build-hostinger.sh` (or the `npm run zip:*`
shortcuts). Do not hand-roll a ZIP, and do not use `.next/standalone`.**

Every ZIP is **source-only: no `node_modules`, no `.next`, no real `.env`**.
Hostinger runs `npm install` and `npm run build` itself. The script checks this
and fails the build if a ZIP contains any of those.

| Ask for | Command | Packages | Contents |
|---|---|---|---|
| website | `npm run zip:website` | `frontend/` | `src`, `shared`, `public`, `package.json`, `next.config.mjs`, `next-env.d.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `.env.example` |
| backend | `npm run zip:backend` | `backend/` | **compiled** `dist/` (`dist/backend/src/server.js`, `dist/shared/`), `package.json`, `.env.example`, `hostinger.env.example` |
| courses | `npm run zip:courses` | `courses-frontend/` | `src`, `public`, `package.json`, **`package-lock.json`**, `next.config.mjs`, `next-env.d.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `.env.example` |
| all three | `npm run zip:all` | | |

Run from `website-xpertppc/`. Output goes to `../hostinger-builds/` as
`xpertppc-<kind>-...-<YYYY-MM-DD-HHMMSS>.zip`. Set `HOSTINGER_OUT_DIR` to change it.

## Per-ZIP details

- **website** uses `frontend/shared/`, not the root `shared/`. They are
  hand-kept mirrors with no sync step, so the script refuses to build if they
  differ. After editing `shared/content/*`, copy the change into
  `frontend/shared/content/*`.
- **backend** is the only ZIP that ships compiled output. `tsc` is run into a
  temp directory, so your local `backend/dist` is left alone. `tsconfig`
  `rootDir` is the repo root, hence `dist/backend/src/...` and `dist/shared/...`.
  `package.json` `start` runs `node dist/backend/src/server.js`.
- **courses** includes `package-lock.json` (it has its own lockfile and pinned
  versions, unlike the website). It does not include `.env.local` or `tests/`.

## What not to ship

- `node_modules/` and `.next/` (a past ZIP with these was rejected).
- `.next/standalone` builds (the "standalone" ZIPs in `deploy-zips/` are the
  old format and bundle `node_modules`).
- `.env`, `.env.local`, or any secret. Only `.env.example` files.

## Verified

The script was checked against the reference ZIPs
(`xpertppc-main-website-hostinger-source-fixed-2026-11-13-*`,
`xpertppc-backend-hostinger-latest-2026-11-13-*`,
`xpertppc-courses-academy-exam-review-hostinger-2026-11-13-*`): file lists are
identical. Names differ only by timestamp and the courses name.
