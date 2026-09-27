# Embeddable lead form

Lets any page — a landing page on another domain, a Facebook ad destination page,
a partner site — collect leads straight into the CRM, without exposing the API
to that page's own origin.

## How it works

1. The embedding page adds one script tag:

   ```html
   <script src="https://xpertppc.com/embed.js" async></script>
   ```

2. That script injects an `<iframe src="https://xpertppc.com/embed/lead-form">`
   right after itself.
3. The form inside the iframe is the site's own `LeadForm` component
   (`frontend/src/components/forms/lead-form.tsx`, same one used on the
   Contact page), submitting to `POST /api/leads` with `source: "embed"`.
4. The iframe resizes itself automatically: the embed page posts its content
   height to the parent window, and `embed.js` applies it — no fixed height
   or scrollbar to configure.

## Why an iframe, not a script-rendered widget

The form's own JS runs inside the iframe, which is served from
`xpertppc.com` — the same origin the CRM API already allows in
`CORS_ORIGINS`. A script that rendered form fields directly into the
embedding page would run in *that* page's origin instead, which the API
does not (and should not) trust by default.

## Where leads land

Same place as every other lead: `Lead` documents with `source: "embed"`,
visible in the admin dashboard, Google Sheets sync, and the mobile app
like any other lead. Nothing about the embed is a separate system.

## Frameable-page exception

`next.config.mjs` sets `X-Frame-Options: SAMEORIGIN` for every page **except**
`/embed/*`, so only the embed pages can be framed by other domains. Don't
remove that exception without adding it back for any new embeddable page.
