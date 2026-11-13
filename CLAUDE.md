# Xpert PPC (website-xpertppc)

## Hostinger ZIPs: always use the build script

When asked for a Hostinger build/ZIP of the **website**, **backend** or **courses**
(academy), run the script. Do not improvise a ZIP and do not use
`.next/standalone` or include `node_modules`.

```bash
cd website-xpertppc
npm run zip:website   # frontend/          -> source-only ZIP
npm run zip:backend   # backend/           -> compiled dist/ ZIP
npm run zip:courses   # courses-frontend/  -> source-only ZIP (with package-lock.json)
npm run zip:all
```

Output lands in `../hostinger-builds/`. Full details: `docs/hostinger-builds.md`.

- Never ship `node_modules`, `.next` or a real `.env` (the script fails if present).
- `frontend/shared/` and `shared/` are hand-kept mirrors. Edit both; the website
  build refuses to run if they differ.
- Commit/push only when asked; ZIP building does not imply either.
