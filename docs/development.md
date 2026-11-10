# Development guide

## Prerequisites

- Node.js 20+
- MongoDB 6+ (local or Atlas)
- Expo Go app (for device testing) or Android emulator / iOS simulator

## Install

```bash
npm install
cp backend/.env.example backend/.env
cp apps/mobile/.env.example apps/mobile/.env
# edit backend/.env — MONGODB_URI, JWT_SECRET, optional GOOGLE_SERVICE_ACCOUNT_JSON
```

## Run

```bash
# API
npm run dev:backend

# Mobile (new terminal)
npm run dev:mobile

# Optional: website frontend
npm run dev:frontend
```

### Mobile API URL

| Where app runs | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| iOS simulator | `http://localhost:5000` |
| Android emulator | `http://10.0.2.2:5000` |
| Physical device | `http://<your-lan-ip>:5000` |

## Seed

```bash
npm run seed
```

Creates content, optional admin from `SEED_ADMIN_*`, and ~30 demo CRM leads
(`*@demo-xpertppc.local`).

## Docker

```bash
docker compose up -d mongo
# or full stack once backend/.env is filled:
docker compose up --build
```

## Tests

```bash
npm run test:backend
```

Unit tests cover normalization + sheet mapping. API tests need MongoDB running.

## Typecheck

```bash
npm run typecheck
```

## Build Android APK (EAS / local)

```bash
cd apps/mobile
npx expo prebuild
# or use EAS: npx eas build -p android --profile preview
```

## Academy image uploads

Signup receipts and profile photos use the backend's `/api/student/images` endpoint through the academy's `/api/upload-image` proxy. No Search Atlas account or upload token is needed. Set the academy's `NEXT_PUBLIC_API_URL` to the backend URL and the backend's `API_PUBLIC_URL` to its publicly reachable origin.

Local disk storage has no additional service fee, but consumes your hosting disk space. In production, set backend `UPLOAD_DIR` to a persistent absolute directory outside deployment/release folders, ensure the Node process can write to it, and back it up. Before changing this path, copy existing uploads there so older URLs still work. If the host cannot retain writable files across deployments, use the existing S3-compatible configuration instead; free-tier limits depend on the provider.

Deploy the updated backend and academy together (backend first). Images remain available at their returned URLs under `/uploads`; existing Search Atlas images are not migrated or deleted. Treat receipt URLs as sensitive: they have random, unguessable names but are not login-protected. The pre-login endpoint accepts one JPEG, PNG, or WebP up to 10 MB, checks its signature, and limits upload attempts to 60 per 15 minutes per source IP. Server-proxied academy traffic shares the proxy's source IP limit; do not trust arbitrary forwarded IP headers to bypass it.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Mobile cannot reach API | Fix `EXPO_PUBLIC_API_URL`; ensure phone/emulator can reach host |
| Google sync 503 | Set `GOOGLE_SERVICE_ACCOUNT_JSON` on backend |
| Sheet read fails | Share sheet with service account email as Editor |
| Login fails | Seed an admin or create AdminUser; check JWT_SECRET ≥ 32 chars |
| Duplicate leads after sync | Check phone/email/external_id mapping |
