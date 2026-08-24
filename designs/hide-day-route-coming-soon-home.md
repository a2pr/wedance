# Hide `/day`, add a "coming soon" home page at `/`

## Request

- `/day` should no longer be a reachable route. Any path (including `/day`) should redirect to `/`.
- `/` becomes a new minimal page:
  - Uses only the Wedance logo (no full event flyer).
  - Below the logo: a "next events coming up" message, in Portuguese, matching the site's existing tone.
  - A footer glued to the bottom of the viewport with the site-credit label.
- New page must be responsive, and reuse existing project styling/assets/language conventions rather than introducing new ones.

## Current state (read-only findings)

- `src/router/index.ts` has exactly two routes: `/day` → `DayView.vue`, and a catch-all `{ path: '/:pathMatch(.*)*', redirect: '/day' }`. There is no `/` route today — everything funnels into `/day`.
- `DayView.vue` composes `WelcomeSection` (flyer image), `ScheduleSection`, and `RegistrationForm` — all specific to the Dance Day event, not reusable for a generic "coming soon" page.
- Brand styling is centralized and reusable:
  - `src/assets/base.css` defines the brand palette (`--color-brand-black`, `--color-brand-green`, etc.) and remaps Bootstrap's dark-theme CSS variables to it.
  - `src/assets/main.css` imports `base.css` and sets global body/link styles.
  - `main.ts` imports Bootstrap CSS + `main.css` globally, and `index.html` sets `data-bs-theme="dark"` — so any new view automatically inherits the dark/green brand theme and Bootstrap utility classes (grid, `img-fluid`, flex utilities) for free.
- **Logo asset**: `public/favicon.png` (512×512 PNG, transparent background outside a black circular badge, white line-art "We Dance" mark) is the only clean, standalone logo already in the project — it's the real asset used for the site's favicon/app icon today (not a placeholder). `public/apple-touch-icon.png` is the same mark at 180×180. Everything else under `designs/references/` and `src/assets/images/` is either a full event flyer/poster (with extra event copy) or unrelated content (schedule photos, PIX QR), so `favicon.png` is the right pick for "logo only".
- **Footer credit**: already exists verbatim in `RegistrationForm.vue` (end of the Dance Day page):
  ```html
  <p class="text-center text-muted small mt-5 mb-0">
    Site desenvolvido por
    <a href="https://andrespayema.com/" target="_blank" rel="noopener noreferrer" class="text-muted">
      Andres Payema
    </a>
  </p>
  ```
  This is the "site create" label to reuse — same markup/classes, just repositioned so it sticks to the bottom of the viewport (sticky-footer flex pattern: `min-vh-100 d-flex flex-column`, content `flex-grow-1` centered, footer as the last flex child with `mt-auto`) instead of trailing after scrollable content.
- Portuguese tone reference: the only other "not yet" message in the project is on the (not embedded) promo poster — "Audições em breve". Proposed copy for this page, matching that register: **"Próximos eventos em breve"** ("next events coming up").
- `index.html` `<title>`, meta description, `og:*`, `twitter:*`, and `canonical` all currently say "Wedance — Inscrição do dia" / describe the Dance Day event / point at `https://wedance.live/day`. Since `/` is becoming the real landing page and `/day` is being hidden, these should be updated to describe a generic Wedance landing page and point at `/` — otherwise search/social previews keep advertising a hidden, event-specific page.

## Proposed changes

1. **`src/router/index.ts`**
   - Keep `DayView.vue` and its route registration removed from the router (file stays on disk, untouched, just unreachable) — replace with:
     - `{ path: '/', name: 'home', component: () => import('../views/HomeView.vue') }`
     - `{ path: '/:pathMatch(.*)*', redirect: '/' }`
   - Net effect: `/day` and any other unknown path redirect to `/`.

2. **New `src/views/HomeView.vue`**
   - `min-vh-100 d-flex flex-column` root.
   - Centered content block (`flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center`): the logo (`img-fluid`, capped max-width via `clamp()`/Bootstrap sizing so it scales down on small screens) + "Próximos eventos em breve" heading below it.
   - Footer at the bottom (`mt-auto`), reusing the exact "Site desenvolvido por Andres Payema" markup from `RegistrationForm.vue`.
   - No new CSS variables/colors — inherits the dark/green theme automatically from the existing global stylesheets.

3. **`index.html`**
   - Update `<title>`, meta description, `og:title/description/url`, `twitter:title/description`, and `canonical` to describe the new `/` landing page instead of the hidden `/day` Dance Day event.

## Out of scope / not changing

- `DayView.vue`, `WelcomeSection.vue`, `ScheduleSection.vue`, `RegistrationForm.vue` and their constants — left as-is on disk, just unrouted, so the Dance Day flow can be restored later by re-adding the route.
- No new images/assets added — only `favicon.png` (already in `public/`) is reused.
- No changes to `.env`, Firebase config, or any deploy step.

## Open item

Exact Portuguese wording for the "coming soon" line is a judgment call — going with **"Próximos eventos em breve"** unless you'd prefer different phrasing (e.g. "Em breve, novos eventos", "Fique de olho nos próximos eventos").

## Follow-up fix: logo pixelation / black mismatch

`public/favicon.png` turned out to be a noisy asset (likely re-exported from a JPEG at some point): pixels inside its "black" circular badge weren't a flat fill — luminance sampling showed values scattered anywhere from 0 to ~35+ instead of a uniform near-black, plus a low but nonzero speckle noise floor spread across the whole 0–255 luminance range instead of only at the stroke edges (confirmed via a histogram of in-circle pixel luminance). Two visible symptoms on the page: (1) fine speckly "pixelation" inside the badge, and (2) the badge's near-black fill (a mix mostly under `#232323`, inconsistent pixel to pixel) didn't match the page background (`--color-brand-black: #0a0a0a`), so a faint circular seam was visible.

Fix: generated `src/assets/images/wedance-logo.png`, a cleaned, transparent-background derivative of the same source mark — for every pixel, luminance below ~110 is dropped to fully transparent and luminance above ~210 becomes solid white, with a smooth ramp between (removes the noise floor and softens jaggies), then cropped to the mark's bounding box (no more circular badge/fill at all). `HomeView.vue` now imports this file instead of referencing `/favicon.png` directly. `public/favicon.png` itself is untouched — it's still used as-is for the actual browser favicon/apple-touch-icon in `index.html`, which is a different, much smaller use case where the noise isn't visible.
