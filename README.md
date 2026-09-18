# Xpert PPC — Website + Lead CRM

A custom MERN rebuild of [xpertppc.com](https://xpertppc.com), plus an internal
**XpertPPC Lead Management** mobile app (Expo) that works against the same
Express + MongoDB backend.

The design, copy, and page structure are a 1:1 match with the production site.
The difference is underneath: every page now ships fully-rendered HTML with
canonical URLs, structured data, and a real sitemap — the things the original
SPA could not give a crawler.

---

## Structure

```
website-xpertppc/
├── frontend/          Next.js 15 — public site + admin UI
├── backend/           Express + Mongoose — website API + CRM /api/v1
├── apps/mobile/       Expo Router — internal Lead CRM
├── shared/            Content + CRM constants/types
├── docs/              Architecture, API, Google Sheets, development
└── docker-compose.yml MongoDB (+ optional backend container)
```

**Why `shared/`:** the frontend renders page copy at build time, the backend
seeds the same copy into MongoDB, and the CRM mobile app shares lead status
enums / normalization helpers.

---

## Lead CRM (mobile)

Internal tool for the XpertPPC team:

- Login with existing admin accounts (JWT in SecureStore)
- Dashboard stats, follow-ups, recent leads
- Search / filter / paginated lead list
- Call · WhatsApp · Email (explicit Mark contacted / Mark replied)
- Notes, statuses, follow-ups, activity history
- Google Sheets connect + two-way sync (credentials stay on backend)

Docs:

- [docs/implementation-plan.md](docs/implementation-plan.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/api.md](docs/api.md)
- [docs/google-sheets.md](docs/google-sheets.md)
- [docs/development.md](docs/development.md)

Quick start:

```bash
npm install
cp backend/.env.example backend/.env   # MONGODB_URI, JWT_SECRET, SEED_ADMIN_*
cp apps/mobile/.env.example apps/mobile/.env
npm run seed
npm run dev:backend                    # :5000
npm run dev:mobile                     # Expo
```

Sign in with the seeded admin. On a physical device set
`EXPO_PUBLIC_API_URL` to your machine LAN IP.

---

## Requirements

- Node.js 20+
- MongoDB 6+ (local, or a MongoDB Atlas connection string)
- Expo Go (optional, for on-device mobile testing)

---

## Setup

```bash
# 1. Install every workspace
npm install

# 2. Backend config
cp backend/.env.example backend/.env
#    Then edit backend/.env:
#      MONGODB_URI  — your database
#      JWT_SECRET   — openssl rand -base64 48
#      SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD — your first admin login
#      GOOGLE_SERVICE_ACCOUNT_JSON — optional, for Sheets sync

# 3. Frontend config
cp frontend/.env.example frontend/.env.local

# 4. Mobile config
cp apps/mobile/.env.example apps/mobile/.env

# 5. Load content + create the admin user + CRM demo leads
npm run seed

# 6. Run website stack
npm run dev

# 7. Run mobile CRM (separate terminal)
npm run dev:mobile
```

| App      | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:3000   |
| Backend  | http://localhost:5000   |
| Admin    | http://localhost:3000/admin |
| Mobile   | Expo Dev Tools          |

---

## Scripts

Run from the repo root:

| Command             | Does                                              |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Runs backend + frontend together                  |
| `npm run dev:mobile`| Starts Expo CRM app                               |
| `npm run build`     | Compiles backend, then builds the frontend        |
| `npm start`         | Runs both in production mode                      |
| `npm run seed`      | Loads `shared/content` + CRM demo leads           |
| `npm run test:backend` | Backend unit + API tests                       |
| `npm run typecheck` | Typechecks backend, frontend, and mobile          |

Each workspace also runs on its own — `cd backend && npm run dev`.

---

## API

Base URL: `http://localhost:5000`

### Public

| Method | Endpoint                       | Purpose                             |
| ------ | ------------------------------ | ----------------------------------- |
| `GET`  | `/api/health`                  | Liveness + DB connection state      |
| `POST` | `/api/leads`                   | Submit a form (rate limited 5/10min)|
| `GET`  | `/api/content/services`        | All published services              |
| `GET`  | `/api/content/services/:slug`  | One service                         |
| `GET`  | `/api/content/faqs`            | FAQs, `?category=` / `?featured=`   |
| `GET`  | `/api/content/courses`         | Academy courses                     |
| `GET`  | `/api/content/industries`      | Industry pages                      |
| `GET`  | `/api/content/case-studies`    | Case studies                        |
| `GET`  | `/api/content/team`            | Team members                        |
| `GET`  | `/api/content/testimonials`    | Testimonials                        |

### Auth

| Method | Endpoint           | Purpose                                  |
| ------ | ------------------ | ---------------------------------------- |
| `POST` | `/api/auth/login`  | Sets httpOnly session cookie (10/15min)  |
| `POST` | `/api/auth/logout` | Clears the cookie                        |
| `GET`  | `/api/auth/me`     | Current admin, or 401                    |

### Admin (requires session cookie or `Authorization: Bearer`)

| Method   | Endpoint          | Purpose                                       |
| -------- | ----------------- | --------------------------------------------- |
| `GET`    | `/api/leads`      | Paginated leads + status counts                |
| `PATCH`  | `/api/leads/:id`  | Update `status` / `notes`                      |
| `DELETE` | `/api/leads/:id`  | Delete a lead                                  |

### CRM mobile (`/api/v1`, Bearer JWT)

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `GET` | `/api/v1/dashboard` | Stats + follow-ups + recent |
| `GET/POST/PATCH/DELETE` | `/api/v1/leads…` | Full CRM lead workflows |
| `*` | `/api/v1/integrations/google-sheets…` | Connect / sync / disconnect |

Full CRM contract: [docs/api.md](docs/api.md).

---

## Data model

| Collection     | Holds                                              |
| -------------- | -------------------------------------------------- |
| `leads`        | Website + CRM leads (status, replied, follow-ups, sheet sync) |
| `leadnotes`    | Structured CRM notes                               |
| `leadactivities` | Lightweight audit trail                          |
| `googlesheetconnections` | Sheet connection + mapping + sync report   |
| `adminusers`   | Admin logins (scrypt password hashes)              |
| `services`     | Six ad-platform service pages                      |
| `faqs`         | 20 Q&As across 7 categories                        |
| `courses`      | Three Digital Academy courses                      |
| `industries`   | Industry landing pages + pricing packages          |
| `casestudies`  | Client case studies                                |
| `teammembers`  | Team profiles                                      |
| `testimonials` | Client quotes                                      |

---

## SEO

The original site rendered nothing until JavaScript ran. This rebuild fixes
that and adds the rest of the technical baseline:

- **Server-rendered HTML** — all 22 routes are statically prerendered, so
  crawlers get complete markup on first response.
- **Per-page metadata** — unique title, description, and canonical URL on every
  route, via the Next.js Metadata API.
- **Structured data** — `Organization`, `WebSite`, `ProfessionalService`,
  `Service`, `Course`, `Person`, `Article`, `FAQPage`, and `BreadcrumbList`
  JSON-LD, emitted server-side.
- **`sitemap.xml` and `robots.txt`** — generated from the content files, so new
  services or courses appear automatically. Admin and API paths are disallowed.
- **Open Graph + Twitter cards** on every page, with a branded 1200×630 image.
- **Visible breadcrumbs** backed by matching `BreadcrumbList` markup.
- **Semantic HTML** — one `h1` per page, real `<table>`/`<dl>`/`<nav>` elements,
  labelled form fields, a skip-to-content link.
- **Real `/privacy-policy` and `/terms-of-service` pages.** Both were linked in
  the production footer but had no route, so each served the homepage — a
  duplicate-content problem for crawlers.

Set `NEXT_PUBLIC_SITE_URL` to the production origin before building. Canonical
URLs, the sitemap, and OG tags are all derived from it.

---

## Security

- Passwords hashed with `scrypt` and compared in constant time
- Sessions in signed, httpOnly JWT cookies (`SameSite=None; Secure` in production)
- Mobile JWT stored in Expo SecureStore (not plain AsyncStorage)
- Google service-account credentials never leave the backend
- CORS restricted to an explicit origin allowlist, credentials enabled
- `helmet` security headers on the API, plus CSP-adjacent headers from Next
- Rate limits on lead submission and login
- Zod validation on every request body
- Honeypot field on public forms
- Login failures return one message so accounts can't be enumerated

---

## Deployment

**Frontend** — Vercel, Netlify, or any Node host.
Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL`, then `npm run build`.

**Backend** — Render, Railway, Fly.io, or a VPS behind Nginx.
Set every variable in `backend/.env.example`. Build with
`npm run build:backend`, start with `npm run start:backend`.

**Mobile** — Expo EAS Build for internal APK/IPA distribution.

Two things to get right in production:

1. `CORS_ORIGINS` must contain the exact frontend origin, or admin login fails.
2. If the API and site sit on different subdomains, set `COOKIE_DOMAIN` to the
   shared parent (`.xpertppc.com`) so the session cookie reaches both.
