# BLO lottery page: SEO cleanup, Chrys Instagram, Bailarina video, prod prep (2026-09-18)

## Problem

The `/blo` raffle page was functionally complete but not ready to ship:
- `robots.txt`/`sitemap.xml` still referenced the old `/day` page, which isn't wired into `src/router/index.ts` (only `/` and `/blo` are live routes).
- The site has no per-page SEO. `index.html` is a static file shared by every route in this client-only SPA (no SSR/prerendering). Since WhatsApp/Facebook link-preview bots don't execute JavaScript, any per-route title/description/OG tags set dynamically in Vue (e.g. `LotteryView.vue`'s existing `document.title = LOTTERY_PAGE_TITLE`) are invisible to them — only the static tags in `index.html` matter for how a shared `/blo` link unfurls.
- The raffle prize card for professor Chrys (`aula-particular-chrys` in `lotteryPrizes.ts`) was the only "aula particular" prize missing an Instagram link. Her handle isn't referenced anywhere else in the codebase or in `designs/2026-09-18-blo-lottery-page.md`.
- The new Bailarina clip (`src/assets/clip/WhatsApp Video 2026-09-18 at 10.57.07.mp4`) hadn't been wired in; the `bailarina` prize was rendering the generic 🎁 emoji fallback.

## Decisions

- **Static `index.html` tags rewritten to raffle content**, rather than setting tags dynamically via JS. This is the only way WhatsApp/Facebook previews of shared `/blo` links show the raffle instead of the generic "Wedance — próximos eventos em breve" placeholder. The home page (`/`) shares the same static tags since it has no distinct content of its own right now.
- `og:image`/`twitter:image` needed a stable, unhashed URL, so the event flyer was copied from `src/assets/images/blo.jpeg` (Vite-processed, hashed at build) to `public/blo-og-image.jpg` (served as-is at a fixed path) rather than trying to reference the hashed build asset.
- `canonical`/`og:url` point at `https://wedance.live/blo` (the actual link sellers share) rather than the site root, since the raffle is the primary content being promoted right now.
- Sitemap now lists `/` and `/blo` only — `/day` was dropped since it isn't a live route.
- Chrys's Instagram handle (`chrysantos_`) was provided directly by the user; it wasn't recoverable from the codebase or existing design docs.
- Bailarina video autoplays muted and loops, no controls — matches "preview" framing and the existing prize-image treatment (a moving image, not an interactive player). `muted` + `playsinline` are required for autoplay to work on mobile browsers.
- `robots.txt` needed no changes — already permissive (`Allow: /`) with a correct `Sitemap:` pointer, and there are no admin/query-param routes worth disallowing.
- During mobile verification, found the prize carousel is horizontally scrollable below the `xl` breakpoint (arrows are hidden there, per the earlier arrow/dot collision fix) but had no visual affordance suggesting more items — it just looked like a static row. Added a page-dot indicator under the carousel (distinct from the fixed `SectionScrollIndicator` nav dots elsewhere on the page) so users see there's more to scroll at any breakpoint, not just mobile.

## Changes

- `public/sitemap.xml` — `/` and `/blo`, `lastmod` 2026-09-18.
- `index.html` — new title (`Rifa Wedance — BLO 26`), description, canonical, `og:*`, `twitter:*` tags; new `public/blo-og-image.jpg`.
- `src/constants/lotteryPrizes.ts` — added `instagramUrl`/`instagramName` to the Chrys prize entry; added `video?: string` to the `LotteryPrize` interface; added `bailarinaVideo` import and wired it to the `bailarina` prize.
- `src/assets/clip/WhatsApp Video 2026-09-18 at 10.57.07.mp4` renamed to `src/assets/clip/bailarina.mp4` (removes spaces, matches existing asset naming like `milonga.jpeg`, `chrys.jpeg`).
- `src/components/LotteryPrizesSection.vue` — added a `v-else-if="prize.video"` branch between the image and empty-state branches, rendering an autoplay/muted/loop/`playsinline` `<video>` reusing the existing `.lottery-prizes__image` sizing class.
- `src/components/LotteryPrizesSection.vue` / `src/constants/lotteryUi.ts` — added a page-dot indicator below the carousel: `pageCount`/`activePage` are derived from the track's `scrollWidth`/`clientWidth`/`scrollLeft` (same geometry `scrollByPage` already used), dots call `scrollToPage(index)` (`el.scrollTo`), and two new labels (`LOTTERY_PRIZES_PAGE_NAV_LABEL`, `LOTTERY_PRIZES_PAGE_LABEL`) were added alongside the existing prev/next labels.

## Verification

- `npm run type-check`, `npm run lint`, `npm run build` — see session log for results.
- Responsive check on `/blo` at desktop (1280×800) and mobile (375×667) via playwright-cli, confirming the Chrys Instagram icon and the looping Bailarina video render correctly with no layout regressions.
- Confirmed via view-source (not devtools) that `index.html`'s static OG/Twitter tags are present as written — this is what a link-preview bot actually sees.
- No `git commit`/`push` or `firebase deploy` was run — per project rules those remain human-only actions.
