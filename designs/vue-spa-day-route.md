# Wedance `/day` single-page site

## Summary

Built the first Wedance-specific page on top of the Vue 3 + Vite + TypeScript scaffold. The app is a single-page application with exactly one active route, `/day`, made of three stacked section components. All user-facing text is in Portuguese.

## Route structure

`src/router/index.ts` was reduced to a single route:

```ts
{ path: '/day', name: 'day', component: () => import('../views/DayView.vue') }
```

The scaffold's `/` and `/about` routes (and their views `HomeView.vue`/`AboutView.vue`) were removed, along with the unused scaffold components (`HelloWorld`, `TheWelcome`, `WelcomeItem`, `icons/*`). Initially no catch-all/redirect route was added; a catch-all redirect to `/day` was added in a later pass — see [Refinement pass](#refinement-pass-branding-real-content-bootstrap-full-redirect) below.

## Page composition

`src/views/DayView.vue` composes three components in order:

1. `WelcomeSection.vue` — greeting + hero image.
2. `ScheduleSection.vue` — the day's schedule, rendered from `src/constants/schedule.ts`.
3. `RegistrationForm.vue` — radio options (`src/constants/formOptions.ts`); selecting one shows the matching image and reveals a "Já paguei!" button.

## WhatsApp integration: `wa.me` vs `wwebjs.dev`

The user asked to send a WhatsApp message via either `wwebjs.dev` or the browser. `whatsapp-web.js` (wwebjs.dev) is a Node.js library for driving an already-logged-in WhatsApp Web session server-side (QR login, persistent process) — it's meant for building bots/automations on an account you control, not for a "contact us" button on a public site, and using it here would require standing up and maintaining a backend with a live WhatsApp session for no real benefit.

Instead, the "Já paguei!" button uses the standard WhatsApp **click-to-chat** deep link (`https://wa.me/<phone>?text=<message>`), built by `buildWhatsAppLink()` in `src/constants/whatsapp.ts`. Clicking it opens WhatsApp (app or web) with the recipient `+5592984240045` and the message "Ja paguei minha inscripçao!" pre-filled, ready to send. This needs no backend, no login, and works in any browser.

## Constants

Per project convention (>3 related hardcoded values get their own file), three constants files were added under `src/constants/`:

- `whatsapp.ts` — phone number, message text, and the link-builder helper.
- `schedule.ts` — typed schedule entries (`{ time, activity }`).
- `formOptions.ts` — typed registration options (`{ id, label, image }`).

## Placeholder content (superseded)

No real images or final schedule/registration-option content were provided yet. Placeholder SVGs were added under `src/assets/images/` (a hero image and three option images) and placeholder schedule/option text was used. See the refinement pass below for the real content that replaced this.

## Refinement pass: branding, real content, Bootstrap, full redirect

A follow-up pass replaced placeholder content and layout with real brand/content assets dropped into `designs/references/`:

- **Palette** — `designs/references/8805130a-199f-4b54-93a6-66993cfa872d.jpeg` (the We Dance Company logo/poster) supplied a black + lime-green palette, approximated as `--color-brand-black: #0a0a0a` / `--color-brand-green: #8fc93e` (plus soft/dark variants) in `src/assets/base.css`. Only the palette was reused — the poster itself is a separate "Audições em breve" promo graphic with unrelated wording, not embedded on the page.
- **Responsiveness** — switched from hand-rolled CSS breakpoints to [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/) (CSS only, no JS bundle needed). `index.html` sets `data-bs-theme="dark"`; `src/assets/base.css` overrides Bootstrap's CSS custom properties (`--bs-primary`, `--bs-body-bg`, `--bs-border-color`, etc.) with the brand palette so every Bootstrap primitive (`.card`, `.btn`, `.form-check`, the grid) stays on-brand without per-component overrides.
- **Full-viewport sections** — each section root uses Bootstrap's `vh-100`/`min-vh-100` + flex utility classes to fill the screen; `DayView.vue` adds `scroll-snap-type: y mandatory` (not a Bootstrap feature) for a full-screen-per-section scroll feel.
- **Real schedule** — `src/constants/schedule.ts` restructured into `SCHEDULE_PERIODS` (Manhã/Tarde/Noite groups) from `designs/references/schedule.text`, rendered as one Bootstrap card per period in `ScheduleSection.vue`.
- **Real registration options** — `src/constants/formOptions.ts` restructured into 6 options from `designs/references/options.text` (the "Período (Manhã ou Tarde)" line split into two separate options per the user's instruction), each with its own price, a distinct placeholder SVG, and a `whatsappSuffix`.
- **Per-option WhatsApp message** — `src/constants/whatsapp.ts` changed from one fixed message to `WHATSAPP_MESSAGE_PREFIX` + `buildPaymentMessage(suffix)`, so each option's "Já paguei!" click sends a tailored message, e.g. Fullpass → "Ja paguei minha inscripçao do pacote full pass!".
- **Routing** — `src/router/index.ts` gained a catch-all (`{ path: '/:pathMatch(.*)*', redirect: '/day' }`), so every path (including `/`) now redirects to `/day` instead of rendering blank.

## Refinement pass: schedule layout + PIX-based registration flow

A further pass changed the schedule layout and swapped the registration flow's per-option images for a shared PIX QR code:

- **Schedule** — `ScheduleSection.vue` now renders Manhã/Tarde as two side-by-side cards and Noite alone on a full-width row below (`mainPeriods`/`lastPeriod` computed from `SCHEDULE_PERIODS`, not hardcoded to the period name).
- **PIX flow** — `formOptions.ts` no longer carries a per-option `image`; all 6 options now share one placeholder QR image (`src/assets/images/pix-qr.svg`). Selecting an option reveals (all gated behind selection, nothing shows beforehand): explanatory PIX instructions naming that option's price (`buildPixInstructions()` in `src/constants/pix.ts`), the shared QR image, the price again below it, a **"Pix copia Cola!"** button that copies a PIX code to the clipboard (`copyPixCodeToClipboard()`, Clipboard API with an `execCommand('copy')` fallback for mobile/older browsers), and the existing **"Já paguei!"** WhatsApp button (unchanged).
- **PIX code as env var** — the copied value comes from `VITE_PIX_COPY_PASTE_CODE` (`.env`, currently the placeholder `12345`), typed via `env.d.ts`, not hardcoded in the component — swap `.env` when the real PIX copia-e-cola code is available.
