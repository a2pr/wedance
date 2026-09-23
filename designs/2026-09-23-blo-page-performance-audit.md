# /blo lottery page performance audit

## Source

Lighthouse report `wedance.live-20260923T120933.json` (mobile, simulated throttling) for `https://wedance.live/blo`, fetched 2026-09-23. Performance score: **59/100**.

## Findings

| Metric | Score | Value | Cause |
|---|---|---|---|
| CLS | 0.15 (poor) | 0.512 | Hero `<img>` had no width/height — page jumped when it loaded |
| LCP | 0.37 (poor) | 4.5s | Hero image is the LCP element: 1280×1600 source served for a 356×445 display slot, no `fetchpriority`, plain JPEG |
| Cache | — | 2.1MB wasted on repeat views | `firebase.json` had no `headers` block; all static assets fell back to a 1-hour default cache lifetime |
| Total byte weight | 0.5 | 2.9MB | Dominated by a 1.9MB autoplaying video and unoptimized JPEGs |

Network breakdown (top offenders):
- `bailarina.mp4` — 1.9MB, `autoplay muted loop`, no visibility gating — downloaded and played even off-screen in the prize carousel.
- `hero-banner.jpeg` — 502KB, oversized (1280×1600 rendered at 356×445 → 463KB wasted) + JPEG instead of WebP (another 160KB wasted).
- 18 prize-carousel JPEGs, several 100-300KB, displayed at small carousel-card sizes.

## Fixes applied

1. **Build-time image pipeline** — added `vite-imagetools`, converting the hero image and all 18 raster prize images to right-sized WebP at build time via import query directives (e.g. `?w=460&format=webp`). Result (from `npm run build-only`):
   - Hero image (visible thumbnail, LCP element): 502KB → **119.6KB** (76% smaller), served at 800px wide instead of the full 1280px source.
   - Lightbox zoom view kept at 1200px wide (184.5KB) — only loaded on demand when the user taps to zoom, so it doesn't affect LCP.
   - Prize images: 87-325KB JPEGs → 15-77KB WebP each.

2. **Hero image CLS + LCP fix** (`src/components/LotteryHeroSection.vue`) — added explicit `width`/`height` attributes (reserves layout space, fixes the 0.512 CLS shift) and `fetchpriority="high"` / `loading="eager"` (it's the LCP element — must load first, never lazily).

3. **Video — gated + re-encoded** — re-encoded `bailarina.mp4` with ffmpeg: stripped the audio track (element is `muted`, so audio was dead weight) and re-compressed at a bitrate appropriate for its ~460px on-screen size. Result: 1.9MB → **370.5KB** (81% smaller). Added a poster frame (WebP, extracted via ffmpeg + optimized through the same imagetools pipeline) so the card isn't blank before playback starts. In `LotteryPrizesSection.vue`, removed `autoplay`, set `preload="none"`, and added an `IntersectionObserver` (matching the pattern already used in `LotteryView.vue`) that plays the video only while its carousel slide is in the viewport and pauses it otherwise.

4. **Long-lived caching** (`firebase.json`) — added a `headers` block: `Cache-Control: public, max-age=31536000, immutable` for `/assets/**` (Vite content-hashes these filenames, so this is safe) and `Cache-Control: no-cache` for `/index.html` (so the SPA shell is never served stale once assets are cached for a year).

## Not changed (out of scope / low impact)

- Unused JS flagged by Lighthouse (~250KB) is almost entirely Chrome extensions and Google Tag Manager, not app code — no action taken.
- The app's own JS bundle (~90KB / ~35KB gzip) and CSS were not flagged as bloated.

## Expected impact

- CLS should drop from 0.512 to near 0 (space is now reserved before the image loads).
- LCP should improve significantly — the LCP element now weighs 120KB instead of 502KB and loads with high fetch priority.
- Total page weight for a first-time visitor drops from ~2.9MB to roughly ~1MB (video no longer downloads until scrolled to, hero image ~76% smaller).
- Repeat visitors save ~2.1MB thanks to year-long immutable caching on hashed assets.

## Verification

- `npm run type-check`, lint (`oxlint`/`eslint`), and `npm run build-only` all pass.
- Manual verification via dev server + `playwright-cli`: confirm no visible layout shift on load, confirm the carousel video does not fetch/play until scrolled into view, confirm asset sizes in the network panel.
