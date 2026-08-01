# Wedance `/day` single-page site

## Summary

Built the first Wedance-specific page on top of the Vue 3 + Vite + TypeScript scaffold. The app is a single-page application with exactly one active route, `/day`, made of three stacked section components. All user-facing text is in Portuguese.

## Route structure

`src/router/index.ts` was reduced to a single route:

```ts
{ path: '/day', name: 'day', component: () => import('../views/DayView.vue') }
```

The scaffold's `/` and `/about` routes (and their views `HomeView.vue`/`AboutView.vue`) were removed, along with the unused scaffold components (`HelloWorld`, `TheWelcome`, `WelcomeItem`, `icons/*`). No catch-all/redirect route was added — per the request, everything besides `/day` stays inactive for now.

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

## Placeholder content

No real images or final schedule/registration-option content were provided yet. Placeholder SVGs were added under `src/assets/images/` (a hero image and three option images) and placeholder schedule/option text was used. These are intended to be swapped for real content in a follow-up once it's available — the constants files are the single place to update.
