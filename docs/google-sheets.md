# Google Sheets setup

## Goals

- Keep Google credentials on the **backend only**
- Map arbitrary spreadsheet headers to CRM fields
- Two-way sync without treating Sheets as the live database for every mobile request

## Service account

1. Create a Google Cloud project.
2. Enable **Google Sheets API**.
3. Create a **service account** and download the JSON key.
4. Put the JSON into `backend/.env` as either:
   - raw one-line JSON: `GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}`
   - or base64 of that JSON
5. **Never** commit the key. **Never** put it in `apps/mobile/.env`.

## Share the spreadsheet

1. Open the Google Sheet.
2. Click Share.
3. Invite the service account email (`…@….iam.gserviceaccount.com`) as **Editor**.
4. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`

## Connect from the app

Settings → Google Sheets:

1. Paste Spreadsheet ID
2. Enter worksheet/tab name (default `Sheet1`)
3. Connect
4. Sync now

On connect, the backend reads header row 1 and suggests column mappings from common aliases
(`Client Name` → name, `Mobile` → phone, etc.).

## Column mapping

CRM fields:

`name`, `phone`, `email`, `business_name`, `source`, `message`, `status`, `replied`,
`notes`, `contacted_at`, `replied_at`, `follow_up_at`, `created_at`, `updated_at`, `external_id`

Update mapping via `PATCH /api/v1/integrations/google-sheets/mapping`.

## Duplicate detection

Match order when importing a row:

1. `external_id` (if mapped)
2. `sheetRowNumber` + source `google-sheets`
3. normalized phone
4. normalized email (ignores `@unknown.local` placeholders)

## Sync endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/integrations/google-sheets/` | Connection + configured flag |
| GET | `/api/v1/integrations/google-sheets/status/` | Sync status summary |
| POST | `/api/v1/integrations/google-sheets/connect/` | Connect sheet |
| PATCH | `/api/v1/integrations/google-sheets/mapping/` | Update mapping |
| POST | `/api/v1/integrations/google-sheets/sync/` | Two-way sync |
| DELETE | `/api/v1/integrations/google-sheets/disconnect/` | Disconnect |

## Important CRM rule

Opening dialer / WhatsApp / email from the mobile app does **not** mark replied.
Users must explicitly tap **Mark contacted** or **Mark replied**.
