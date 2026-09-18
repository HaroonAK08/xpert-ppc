# XpertPPC Lead Management App — Implementation Plan

## Repository reality check

This repo is **not empty**. It already contains:

| Layer | Stack |
| --- | --- |
| Website frontend | Next.js 15 (`frontend/`) |
| Backend API | Express 4 + Mongoose (`backend/`) |
| Database | MongoDB (not PostgreSQL) |
| Auth | JWT + AdminUser model |
| Existing leads | Website form Lead model + `/api/leads` |

**Product decision (confirmed by product owner):** reuse the existing Express + MongoDB backend and database. Do **not** introduce Django/PostgreSQL. Extend models and add `/api/v1/*` CRM endpoints for the mobile app.

## Target architecture

```
React Native (Expo)  →  Express CRM API (/api/v1)  →  MongoDB
                                              ↓
                                    Google Sheets API
```

- Mobile never holds Google credentials.
- PostgreSQL/Django from the original brief are replaced by the existing stack.
- Website public lead form continues to work; CRM fields are additive.

## Monorepo additions

```
apps/mobile/          Expo Router + TypeScript CRM app
docs/                 architecture, API, Google Sheets, development
shared/crm/           shared LeadStatus enums + API types
backend/src/…         CRM routes, Google Sheets service, notes/activity
docker-compose.yml    MongoDB (+ optional Redis) for local CRM work
```

## Phases

1. **Setup** — docs, env examples, docker-compose, workspace wiring  
2. **Auth** — reuse AdminUser + JWT Bearer for mobile  
3. **Lead CRM model** — extend Lead; notes; activity; indexes  
4. **CRM API** — list/search/filter/CRUD, reply/contact, dashboard  
5. **Mobile UI** — tabs, login, dashboard, leads, details, settings  
6. **Actions** — tel / WhatsApp / mailto + explicit mark contacted/replied  
7. **Google Sheets** — connect, column map, two-way sync, conflicts  
8. **Offline** — TanStack Query cache + queued mutations  
9. **Tests + polish** — unit/integration, seed data, README

## Status enum (centralized)

`NEW | CONTACTED | REPLIED | INTERESTED | FOLLOW_UP | CONVERTED | NOT_INTERESTED | CLOSED`

Legacy website statuses (`qualified`, `won`, `lost`, `spam`) remain readable and map into the CRM set for the admin UI/API.

## Sync conflict strategy

- Local `updatedAt` vs `lastSyncedAt` vs sheet-side checksum/`sheetUpdatedAt`.
- Outbound push only when local change is newer than last successful sync for that row.
- Inbound import skips overwriting fields that changed locally after `lastSyncedAt` (field-level merge with conflict logged on `LeadActivity` + sync report).

## Delivery order

Plan → backend models/API → Google Sheets service → Expo app → connect → test → docs.
