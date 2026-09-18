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

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Mobile cannot reach API | Fix `EXPO_PUBLIC_API_URL`; ensure phone/emulator can reach host |
| Google sync 503 | Set `GOOGLE_SERVICE_ACCOUNT_JSON` on backend |
| Sheet read fails | Share sheet with service account email as Editor |
| Login fails | Seed an admin or create AdminUser; check JWT_SECRET ≥ 32 chars |
| Duplicate leads after sync | Check phone/email/external_id mapping |
