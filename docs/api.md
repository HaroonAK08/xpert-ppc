# CRM API

Base URL: `http://localhost:5000`

Auth: `Authorization: Bearer <jwt>` from `POST /api/auth/login`.

## Response shape

Success:

```json
{ "data": {}, "meta": { "page": 1, "pageSize": 30, "total": 100, "totalPages": 4 } }
```

Many legacy website endpoints still return `{ ok, … }`. CRM `/api/v1` uses `data`/`meta`.

## Auth (existing)

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | Current admin |
| POST | `/api/auth/logout` | Clears cookie |

## Leads

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/leads` | Query: `page`, `page_size`, `search`, `status`, `replied`, `follow_up`, `source`, `sort`, `created_from`, `created_to` |
| GET | `/api/v1/leads/:id` | Lead + notes + activity |
| POST | `/api/v1/leads` | Create |
| PATCH | `/api/v1/leads/:id` | Update |
| DELETE | `/api/v1/leads/:id` | Delete |
| POST | `/api/v1/leads/:id/contact` | Mark contacted |
| POST | `/api/v1/leads/:id/reply` | Mark replied |
| POST | `/api/v1/leads/:id/notes` | Add note `{ text }` |
| GET | `/api/v1/leads/:id/notes` | List notes |
| POST | `/api/v1/leads/:id/follow-up` | `{ followUpAt, note? }` |
| POST | `/api/v1/leads/:id/follow-up/complete` | Clear follow-up |
| GET | `/api/v1/leads/:id/activity` | Activity history |
| POST | `/api/v1/leads/:id/sync` | Queue outbound sheet push |

### Sort values

`newest` | `oldest` | `updated` | `follow_up`

### Statuses

`new`, `contacted`, `replied`, `interested`, `follow_up`, `converted`, `not_interested`, `closed`

## Dashboard

`GET /api/v1/dashboard` → stats, recent leads, follow-ups today, recent activity.

## Google Sheets

See [google-sheets.md](./google-sheets.md).

## OpenAPI

Interactive docs can be added later via `swagger-ui-express`. Endpoint contracts above are the source of truth for v1.
