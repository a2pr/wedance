# GA4 Funnel Tracking for the Registration Flow

## Problem

The `/day` page (`DayView.vue`) is a single-route flow: Welcome → Schedule → Registration, ending with a **"Já paguei!"** button that hands the user off to WhatsApp. GA4 (`G-TKR5GXTNC9`, added in `index.html` by commit `5369764`) only fires the automatic `page_view`. There is no way to see, in GA4, how many visitors progress through each step of the registration flow or where they drop off, since the page never changes route.

## Goal

Instrument the flow with custom GA4 events so a Funnel Exploration report can be built from page load through to the `Já paguei!` conversion, including the option-selection sub-steps.

## Event map

| # | Step | Event name | Fired from | Params |
|---|---|---|---|---|
| 1 | Page loaded | `page_view` (automatic) | — | — |
| 2 | Welcome section seen | `view_section` | `DayView.vue` IntersectionObserver | `section_id: 'welcome'` |
| 3 | Schedule section seen | `view_section` | same observer | `section_id: 'schedule'` |
| 4 | Registration section seen | `view_section` | same observer | `section_id: 'registration'` |
| 5 | Plan/option chosen | `select_option` | watcher on `selectedOptionId` | `option_id`, `option_label` |
| 6 | Aula Avulsa classes confirmed | `confirm_class_selection` | `onConfirmAulaAvulsaSelection()` | `class_count`, `price` |
| 7 | Upgrade suggestion shown | `view_upgrade_prompt` | inside `onConfirmAulaAvulsaSelection()` | `suggested_option_id` |
| 8 | Upgrade accepted / declined | `confirm_upgrade` / `cancel_upgrade` | `onConfirmUpgrade()` / `onCancelUpgrade()` | `option_id` (accept only) |
| 9 | Pix payment screen shown | `view_payment_instructions` | `watch(pixContext, …)` | `option_id`, `price` |
| 10 | Pix code copied | `copy_pix_code` | `onCopyPixCode()` | `option_id`, `price` |
| 11 | **Conversion** — Já paguei clicked | `payment_confirmed` | `sendPaymentConfirmation()` | `option_id`, `price` |

`view_section` fires once per section per visit (deduped) so scrolling back and forth doesn't inflate counts. `view_payment_instructions` fires each time `pixContext` newly becomes non-null, including if the user changes plan after already reaching the Pix screen.

## Implementation

- `src/constants/analyticsEvents.ts` — event name constants (`ANALYTICS_EVENTS`).
- `src/utils/analytics.ts` — `trackEvent(name, params)` wrapper around `window.gtag`.
- `env.d.ts` — ambient `Window.gtag` type declaration.
- `src/views/DayView.vue` — fire `view_section` from the existing IntersectionObserver callback.
- `src/components/RegistrationForm.vue` — fire the remaining events at each interaction point listed above.

## GA4 console setup (outside the codebase)

Mark `payment_confirmed` as a key event/conversion in the GA4 property, then build an Explore → Funnel Exploration report using the event sequence above.

## Verification

Run the app locally, walk the full flow, and confirm each step produces a `collect` network request (or shows in GA4 DebugView) with the expected event name and params, in order.
