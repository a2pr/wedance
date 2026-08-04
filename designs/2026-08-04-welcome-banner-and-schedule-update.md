# Welcome banner swap + second Instagram icon (2026-08-04)

## Welcome banner

- New image: `designs/references/newBanner.jpeg` — 1550×1600 px, ≈0.97:1 (near-square). Source is a JPEG.
- Old mobile banner: `welcome-flyer-mobile.png` — 1092×1238 px, ≈0.88:1. Old desktop banner: `welcome-flyer.png` — 1092×1265 px, ≈0.86:1.
- Confirmed the new image should replace **both** desktop and mobile. Desktop uses the full-size image as `src/assets/images/welcome-flyer.jpeg` (1550×1600, ~318 KB, unmodified).
- For mobile, a dedicated optimized asset was generated from the source: resized to 1100×1135 (matches the `max-width: min(90vw, 720px)` display cap at typical phone widths/DPRs) and re-compressed (JPEG quality 82) — `src/assets/images/welcome-flyer-mobile.jpeg`, ~134 KB (58% smaller than the full-size file). `WelcomeSection.vue`'s `<picture>`/`<source media="(max-width: 767.98px)">` split was reinstated to serve this smaller file to mobile. Old `welcome-flyer.png` and `welcome-flyer-mobile.png` removed.
- `WelcomeSection.vue` has no `object-fit`/cropping — sizing is via `max-width`/`max-height` only, so the browser preserves the image's natural aspect ratio. Confirmed: no crop, the banner renders more square than before on both breakpoints.

## Second Instagram icon (schedule)

- `src/constants/schedule.ts` already had `instagramUrlTwo` added to `Instructor` and populated for `forro-manha` (Pamela Ribeiro e Witheney Alexander). `ScheduleListItem.vue` only rendered the first icon.
- Added a second `<a>` beside the first inside the existing `d-inline-flex align-items-center gap-1` wrapper, reusing `InstagramIcon` and `.schedule-list-item__instagram-link`. Only renders when `instagramUrlTwo` is present — no placeholder/fallback icon for the second slot.

## Schedule data review

Compared the current `schedule.ts` against `designs/references/schedule.text` (older reference):
- Surnames filled in: Samara → Samara Sfair, Daniel → Daniel Berton, Jhon → Jhon Michell.
- `forro-manha` now credits two instructors (Pamela Ribeiro e Witheney Alexander) with separate Instagram links each.
- `salsa` activity reworded to "Roda de casino (Dile que no)".
- **Flag:** the `forro-tarde` item (15:30) now has activity "Salsa en linea" taught by Giovanna Leoni — no longer a Forró class — but its `id` is still `forro-tarde`. The `id` isn't rendered anywhere in the UI, so this is purely an internal-naming mismatch, not a visible bug. Worth renaming the id for maintainability whenever that section is touched again, but left as-is for this change.
