# Architecture — XpertPPC Lead Management

## Overview

Internal CRM for the XpertPPC team. Leads may arrive from the public website forms
or from Google Sheets. The mobile app is the day-to-day workspace for calling,
WhatsApp, email follow-ups, notes, statuses, and sync.

## Stack (this repository)

| Layer | Choice | Notes |
| --- | --- | --- |
| Mobile | Expo + Expo Router + TypeScript | `apps/mobile` |
| API | Express + Zod + JWT | existing `backend/` |
| DB | MongoDB via Mongoose | existing database |
| Sheets | Google Sheets API (service account) | backend only |
| Server state (mobile) | TanStack Query | |
| Client state | Zustand + SecureStore | auth + offline queue |

The original product brief mentioned Django + PostgreSQL. This repo already had a
production Express/Mongo stack, so CRM APIs were added there instead of introducing
a second backend.

## Data flow

```
Expo app  --JWT-->  /api/v1/*  -->  MongoDB
                                      |
                                      v
                              Google Sheets API
```

Website forms continue to POST `/api/leads` (public). Those leads appear in the CRM.

## Key modules

- `backend/src/routes/crmV1.ts` — CRM router mount
- `backend/src/routes/crmLeads.ts` — lead CRUD + contact/reply/notes/follow-up
- `backend/src/routes/crmDashboard.ts` — aggregate stats
- `backend/src/routes/crmGoogleSheets.ts` — connect / sync / disconnect
- `backend/src/services/googleSheets/sheetsService.ts` — two-way sync
- `shared/crm/` — statuses, types, phone/email normalization
- `apps/mobile/` — Expo CRM client

## Conflict strategy

1. Each lead stores `updatedAt`, `localDirtyAt`, `lastSyncedAt`, `sheetChecksum`.
2. Sheet → CRM: if the lead is locally dirty **and** the sheet checksum changed, record
   a `sync_conflict` activity and **keep local CRM fields** for that pass.
3. CRM → Sheet: dirty leads with a `sheetRowNumber` are pushed on sync.
4. Sync report surfaces created / updated / pushed / conflicts / failed counts.

## Auth

Reuses `AdminUser` + existing `/api/auth/login`. Mobile stores JWT in
`expo-secure-store` and sends `Authorization: Bearer`.
