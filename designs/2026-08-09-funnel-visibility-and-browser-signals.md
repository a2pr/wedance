# Reading option popularity, WhatsApp conversions, and browser visitor signals in GA4

## Goal

Three questions were raised about the `/day` registration flow:

1. Which registration option are people picking more?
2. How many visitors reach the final step and get redirected to WhatsApp?
3. Can we (non-invasively) learn who's reaching out — e.g. a name — from the browser?

All the tracking needed for (1) and (2) already exists in the codebase (see `designs/2026-08-04-ga4-registration-funnel-tracking.md` for the implementation). This doc is about **reading it correctly in GA4**, and explains why (3) isn't achievable in a non-invasive way, plus what GA4 gives you instead.

## 1. Which option is picked more

Every time a user selects a plan on the registration form, `RegistrationForm.vue` fires a `select_option` event with `option_id` and `option_label` (`src/components/RegistrationForm.vue:66`).

To see the breakdown:

- Quick check: **Reports → Engagement → Events → `select_option`** shows total count, but not broken down by which option.
- Proper breakdown: **Explore → Free form**
  - Dimension: `option_id` (or `option_label`)
  - Metric: Event count, filtered to `Event name = select_option`
  - Rows: `option_id` — gives a ranked list of picks per plan.
- **Important**: `option_id`/`option_label` are custom event parameters. If they don't appear as selectable dimensions in Explore, register them first at **Admin → Custom definitions → Create custom dimension** (scope: Event, event parameter: `option_id` / `option_label`). Until that's done, the parameter data is being collected but isn't queryable as a dimension.

## 2. How many reach the WhatsApp handoff

Clicking "Já paguei!" fires `payment_confirmed` (`RegistrationForm.vue:126`) immediately before the app opens the WhatsApp link. This is the conversion event.

### Real data check (from a report already pulled)

A report was already run in GA4 and shows tracking is live, but it used the wrong report technique for this question:

- It was a **Path exploration** ("PASO -1/+1", starting/end point framing) — this shows whatever event happened next/previous per user in raw chronological order, not a curated funnel.
- Forward from `view_section` (61 occurrences), the "next step" fanned out to `scroll`, `page_view`, `first_visit`, `session_start` — these are GA4's automatically-collected events firing in the same session, not meaningful next actions in the registration flow. `select_option` didn't even surface because the automatic-event noise drowned it out.
- Working backward from `payment_confirmed`: 2 users arrived via `view_payment_instructions`, 1 via `copy_pix_code` → **3 total conversions** so far, out of 61 `view_section` events. Small sample, but directionally the pipe works end-to-end.

### The right report: Funnel Exploration

Path exploration isn't built for "how many made it through a specific sequence of steps." Use **Explore → Funnel exploration** instead, with steps matching the documented flow:

| Step | Event |
|---|---|
| 1 | `view_section` (`section_id = registration`) |
| 2 | `select_option` |
| 3 | `view_payment_instructions` (or `confirm_class_selection` for the Aula Avulsa branch) |
| 4 | `payment_confirmed` |

This gives a clean drop-off percentage at each step, without automatic events mixed in.

Also mark `payment_confirmed` as a **key event**: **Admin → Events → toggle "Mark as key event"** next to `payment_confirmed`. This makes it show up as a conversion in standard reports (Reports → Engagement → Conversions) without needing to open Explore each time.

Expect the numbers to be small and noisy until traffic grows — 3 conversions is not yet a statistically meaningful drop-off rate.

## 3. Getting visitor info from the browser (e.g. a name)

Browsers do not expose a visitor's real identity — name, email, etc. — to JavaScript. There's no API for it; it's a deliberate privacy boundary, not a missing feature. GA4 also explicitly prohibits sending PII into its collection, so even if a name were obtainable, it shouldn't be sent as an event parameter.

The two realistic paths were:
- Add a "Name" field to the registration form and let the user type it in themselves (a code change — not pursued for now).
- Rely on the non-PII signals GA4 already collects automatically, with zero code changes.

**Decision: use GA4's automatic signals, no form changes.**

What's already available per visitor/session, with no extra instrumentation:

- **Device & tech**: browser, OS, device category (mobile/desktop/tablet) — **Reports → Tech → Tech details**.
- **Approximate location**: country, region, city — derived from IP, not GPS, so it's coarse and non-invasive — **Reports → User → Demographics details**.
- **Language**: browser/OS language setting — same Demographics report.
- **Acquisition**: referrer, campaign, session source/medium (e.g. Instagram, Google, direct) — **Reports → Acquisition → Traffic acquisition**.

None of this identifies a specific person by name, but combined with the `select_option` breakdown it's enough to profile the typical visitor (e.g. "mostly mobile, Sao Paulo area, arriving from Instagram") without collecting anything invasive.

## Relationship to other docs

This doc complements `designs/2026-08-04-ga4-registration-funnel-tracking.md`: that one is the *implementation* record (what events exist and where they're fired from in code); this one is the *how to read the results correctly in the GA4 UI*, plus the answer on why browser-based name capture isn't possible.
