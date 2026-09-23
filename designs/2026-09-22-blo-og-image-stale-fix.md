# Stale link-preview image on /blo

## Issue
Sharing the `/blo` URL (WhatsApp, iMessage, Facebook, Twitter/X, etc.) shows an outdated preview image — not the current hero banner.

## Root cause
`index.html` hard-codes `og:image` / `twitter:image` as a static file, `public/blo-og-image.jpg`:

```html
<meta property="og:image" content="https://wedance.live/blo-og-image.jpg">
<meta name="twitter:image" content="https://wedance.live/blo-og-image.jpg">
```

This is a plain SPA with no `vue-meta`/`useHead`/`unhead` — the tags in `index.html`'s raw `<head>` are the sole source of truth and pass through unchanged into the build, so this is not a "crawler doesn't run JS" problem.

Commit `99a5221` ("new img for banner") swapped the on-page hero image in `src/components/LotteryHeroSection.vue` from `src/assets/images/blo.jpeg` to `src/assets/images/hero-banner.jpeg`, but `public/blo-og-image.jpg` was never regenerated. Its MD5 was byte-identical to the old `blo.jpeg` — the hero art on the page changed, the link-preview image did not, because the two files are maintained by hand with no pipeline connecting them.

## Fix
Replaced `public/blo-og-image.jpg` with a copy of the current `src/assets/images/hero-banner.jpeg`, following the same convention the previous asset used (the old `blo-og-image.jpg` was itself just a direct copy of `blo.jpeg`, not a purpose-cropped OG asset). Kept the full portrait artwork rather than cropping to the standard 1200×630 OG ratio, since a tight landscape crop of this flyer would cut off the "+ DE 30 PRÊMIOS!" prize copy, which is the most important part of the image.

Also bumped `lastmod` for `/blo` in `public/sitemap.xml` from `2026-09-18` to `2026-09-22` to reflect the change.

## Follow-ups / things to watch
- **This is a manual, easy-to-forget step.** Any future hero image swap needs a matching manual update to `public/blo-og-image.jpg`, since nothing enforces the two staying in sync. Worth a one-line reminder in the PR checklist, or eventually generating `blo-og-image.jpg` from the hero asset at build time instead of hand-maintaining a duplicate file.
- **Cached previews won't auto-refresh.** Facebook, Twitter/X, WhatsApp, and iMessage cache the preview per-URL. After this ships, previously-shared links may still show the old image until the platform's cache is forced to re-scrape (Facebook Sharing Debugger "Scrape Again", Twitter Card Validator, etc.).
- Considered cropping to the standard 1200×630 OG size, but the source flyer is portrait (1280×1600) and text-heavy throughout, so a landscape crop would lose the headline prize count. Kept it as a straight copy to match prior behavior; can revisit with a purpose-designed landscape OG asset if the team wants a tighter crop later.
