# Deploying the Wedance SPA to Firebase Hosting

## Overview

Wedance is a static single-page app (Vue 3 + Vite, no backend, no SSR). Shipping it means: build once into a `dist/` folder of minified, hashed HTML/CSS/JS, then push that folder to Firebase Hosting with the Firebase CLI. The one non-obvious requirement is the **SPA fallback**: the app uses HTML5 history-mode routing with a catch-all redirect to `/day` (`src/router/index.ts`), so Firebase Hosting must rewrite unknown paths to `/index.html` — otherwise a direct hit or refresh on `/day` 404s before Vue Router ever gets a chance to run. Firebase Hosting solves this with a `rewrites` rule in `firebase.json` (see step 2) instead of an nginx/Apache config.

## Prerequisites

- Node.js `^22.18.0` or `>=24.12.0` (per `package.json` `engines`) on whatever machine runs the build — this can be your laptop or a CI runner.
- A Firebase project created in the [Firebase console](https://console.firebase.google.com/) with Hosting enabled.
- The Firebase CLI: `npm install -g firebase-tools` (or run it ad hoc via `npx firebase-tools`), then authenticate with `firebase login`.

## 1. Build the production bundle

Set the real values for both build-time env vars before building. `.env.sample` documents them:

```
VITE_PIX_COPY_PASTE_CODE=12345
VITE_WHATSAPP_PHONE_NUMBER=5592984240045
```

Make sure your local `.env.prod` (not `.env` — that's for local dev) has the real PIX "copia e cola" code and the real WhatsApp contact number (not placeholders), then build:

```bash
npm ci
npm run build:prod
```

`npm run build:prod` runs a type-check (`vue-tsc`) alongside `vite build --mode prod`, which loads `.env.prod` instead of the local-dev `.env`. Vite's production build already minifies JS/CSS/HTML and content-hashes filenames — no extra minification step is needed. Output lands in `dist/`.

## 2. Firebase project files

Firebase Hosting is configured by two files at the repo root, which don't exist yet — they're a follow-up code change once this doc is approved, not something this doc adds on its own:

Run `firebase init hosting` from the repo root (choose "use an existing project", public directory `dist`, configure as a single-page app: **yes**) to generate them, or hand-author:

`firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

The `rewrites` block is the SPA fallback — every path not matching a real file in `dist/` gets served `index.html`, letting Vue Router take over client-side.

`.firebaserc`:

```json
{
  "projects": {
    "default": "<firebase-project-id>"
  }
}
```

Replace `<firebase-project-id>` with the actual project ID from the Firebase console once the project is created.

## 3. Deploy

```bash
firebase deploy --only hosting
```

Re-run steps 1 and 3 (build, then deploy) for every future release — the config in step 2 doesn't need to change again once it's committed.

## 4. Verify

From anywhere:

```bash
curl -I https://<project-id>.web.app/
curl -I https://<project-id>.web.app/day
```

Both should return `200`. The second call is the important one — it confirms the SPA fallback rewrite is working (hitting `/day` directly, not just navigating there client-side from `/`). Then open the site in a browser, select a registration option, and confirm both the PIX code and the "Já paguei!" WhatsApp link use the real values, not the `.env.sample` placeholders.

## Optional follow-ups (not required for first deploy)

- **HTTPS** — no setup needed. Firebase Hosting provisions HTTPS automatically for both the default `<project-id>.web.app` / `<project-id>.firebaseapp.com` domains and any custom domain you connect.
- **Custom domain** — connect one via the Firebase console (Hosting → Add custom domain) or `firebase hosting:sites`, if Wedance gets its own domain.
- **Automation** — if manual deploys become frequent, add a GitHub Actions workflow that builds and runs `firebase deploy` on push to `main` (e.g. via the `FirebaseExtended/action-hosting-deploy` action). Out of scope for this pass.
