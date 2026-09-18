# `/blo` — Lottery (Rifa) Page

## Problem

Wedance is running a prize lottery. Tickets cost R$ 10,00, are sold by a roster of 15 named
sellers, paid by PIX and confirmed over WhatsApp. No page exists for it — the router serves
only `HomeView.vue` at `/` plus a catch-all redirect, and nothing in `src/` mentions a rifa.

The `/day` registration flow already solves the hard parts (PIX copia-e-cola, static QR,
`wa.me` hand-off, GA4 funnel, progressive section reveal). It is intact on disk but unrouted
since commit `d15a6f8`. This feature reuses its constants and patterns rather than duplicating
them.

## Goal

A mobile-first, responsive `/blo` page where a participant browses the prizes, understands the
5+1 bonus promotion, picks a quantity, picks a seller, pays by PIX and hands off to WhatsApp
with the comprovante — the whole funnel visible in GA4.

## Decisions

| Question | Decision |
|---|---|
| PIX amount | Reuse the static `VITE_PIX_COPY_PASTE_CODE` + `pix-qr.png`. The amount is **not** encoded, so the total is displayed prominently in the calculator and again in the payment section. |
| Persistence | None. The WhatsApp message plus the attached comprovante is the only record. No backend, no new dependency. |
| Comprovante | Mandatory — a purchase is not valid until the receipt is sent. |
| Draw date | 10/10/2026. More info on Instagram `@wedance.company`. |
| Ticket numbers | Assigned off-platform; delivered in the WhatsApp reply. The site never generates one. |
| Max per person | 100 tickets. |
| Prize images | Image-optional cards; prizes without art render a name-only card. |

## Page structure

Five sections; the last two are progressively revealed.

| # | Section | Visible when | Component |
|---|---|---|---|
| 1 | Prizes gallery | always | `LotteryPrizesSection.vue` |
| 2 | Promotion + draw info | always | `LotteryPromotionSection.vue` |
| 3 | Ticket counter + calculator | always | `LotteryTicketPicker.vue` |
| 4 | Seller picker | `paidTickets > 0` | `LotterySellerPicker.vue` |
| 5 | PIX + WhatsApp | a seller is resolved | `LotteryPaymentSection.vue` |

Reveal mirrors `RegistrationForm.vue`'s `pixContext` — a computed that returns `null` until its
precondition holds, gating the block with `v-if`.

`DayView.vue`'s `scroll-snap-type: y mandatory` is deliberately **not** reused: it suits three
fixed full-viewport panels, but here sections grow and shrink as they reveal and the prize grid
is taller than the viewport. `/blo` is a normal scrolling page.

## Promotion rules

`evaluateLotteryTickets(paidTickets)` in `src/constants/lotteryTickets.ts` owns all the math,
the way `aulaAvulsaSelection.ts` does for `/day`:

- `bonusTickets = floor(paid / 5)` — every 5 paid tickets earns 1 free.
- `totalTickets = paid + bonus`.
- `totalPriceValue = paid * 10` — **the bonus ticket is never charged**. 5 paid → 6 tickets, R$ 50,00.
- `isOneAwayFromBonus` when `paid % 5 === 4`, driving the "add one more" nudge.
- Input is clamped to 0…100 inside the evaluator, not only in the UI, so a typed or pasted
  value cannot exceed the cap.

## Comprovante

`wa.me` links cannot attach a file, so sending the receipt is a manual act inside WhatsApp
after the hand-off. The requirement is reinforced in three places: an `alert alert-warning`
callout above the buttons, the button label itself ("Já paguei — enviar comprovante"), and a
final line in the WhatsApp message separated by a real line break (`%0A`).

## Event map

Extends the funnel in `2026-08-04-ga4-registration-funnel-tracking.md`. ♻ marks a reused event.

| # | Step | Event | Params |
|---|---|---|---|
| 1 | Page loaded | `page_view` (automatic) | — |
| 2-6 | Section seen | ♻ `view_section` | `section_id` |
| 7 | Quantity changed (debounced 500ms) | `select_ticket_quantity` | `paid_tickets`, `bonus_tickets`, `total_tickets`, `price` |
| 8 | One-away nudge shown | `view_bonus_nudge` | `paid_tickets` |
| 9 | Nudge accepted | `accept_bonus_nudge` | `paid_tickets` |
| 10 | Bonus earned (first crossing) | `earn_bonus_ticket` | `bonus_tickets`, `total_tickets` |
| 11 | Seller chosen | `select_seller` | `seller_id`, `is_custom_seller` |
| 12 | Idle prompt shown | `view_idle_prompt` | `idle_seconds` |
| 13 | Idle prompt accepted / dismissed | `confirm_idle_prompt` / `dismiss_idle_prompt` | — |
| 14 | PIX screen shown | ♻ `view_payment_instructions` | `flow`, `total_tickets`, `price` |
| 15 | PIX code copied | ♻ `copy_pix_code` | `flow`, `price` |
| 16 | **Conversion** | ♻ `payment_confirmed` | `flow`, `paid_tickets`, `bonus_tickets`, `price`, `seller_id` |

`flow: 'lottery'` on the reused events keeps this funnel separable from the `/day` registration
funnel, where `payment_confirmed` is already the key event.

`view_section` is deduped per visit by a `Set`, as in `DayView.vue`. `view_bonus_nudge` and
`earn_bonus_ticket` fire once per threshold crossing, not on every re-render.

**Caveat:** `payment_confirmed` fires on the WhatsApp hand-off, not when a purchase becomes
valid. Validity depends on a comprovante attached by hand, which is invisible to GA4 — expect
step 16 to overcount real sales and reconcile against the WhatsApp inbox, not the funnel.

## Idle call-to-action

A 2-minute timer in `LotteryView.vue`, reset whenever the quantity or seller changes. If it
fires while `paidTickets === 0` it shows `ConfirmModal` (reused as-is — its confirm/cancel
emits map exactly onto the CTA), scrolling to the counter on confirm. Fires once per visit and
is cleared on unmount.

## Implementation

New constants — `src/constants/`:
- `lotteryTickets.ts` — pricing/promo engine and the WhatsApp suffix builder.
- `lotteryPrizes.ts` — the prize list, image imports, Instagram links.
- `lotterySellers.ts` — the 15 sellers, `OTHER_SELLER_ID`, `resolveSellerName()`.
- `lotteryDraw.ts` — draw date, Instagram URL, ticket-number copy.
- `lotteryComprovante.ts` — the receipt-requirement copy.
- `lotteryUi.ts` — shared section ids, labels and headings.

Extended:
- `analyticsEvents.ts` — new event names appended to `ANALYTICS_EVENTS`.
- `whatsapp.ts` — `WHATSAPP_LOTTERY_MESSAGE_PREFIX` + `buildLotteryPaymentMessage()`; the
  existing `/day` prefix is left untouched.
- `pix.ts` — `buildLotteryPixInstructions()`; `copyPixCodeToClipboard()` and the code reused.
- `router/index.ts` — `/blo` added before the catch-all.

New components — `src/components/` plus `src/views/LotteryView.vue`.

New assets — `prize-aula-witheney.jpeg` and `prize-aula-samara.jpeg`, derived from the
instructor cutouts in `designs/references/`.

## Shared change: `formatPriceBRL()` thousands separator

The 100-ticket cap pushed totals to four digits, which exposed a latent bug in
`formatPriceBRL()` — it did `value.toFixed(2).replace('.', ',')` and so produced `R$ 1000,00`
instead of the Brazilian `R$ 1.000,00`. `/day` never hit it because its highest price is R$ 95.

The function now groups thousands with a dot. Output is byte-identical for every existing
`FORM_OPTIONS` price (25/30/50/80/95), so `/day` is unaffected; only 4-digit totals change.

## Language and styling

All user-visible text is pt-BR with correct accents, including `alt` text, `aria-label`s,
`<select>` options and input placeholders. English is confined to code identifiers. Currency
always renders through the existing `formatPriceBRL()`.

Colours come only from the tokens in `base.css`; `btn-success` is the brand green because
`--color-brand-green` is remapped onto `--bs-success`. No hardcoded hex, no Bootstrap JS, no
new dependency. Scoped CSS uses BEM, matching the rest of the repo.

The prize cutouts sit on white, so their cards use a light surface on the forced-dark theme —
built from existing tokens.

## Verification

1. `npm run type-check`, `npm run lint`, `npm run format`.
2. Drive `/blo` with playwright-cli at 375×667 and 1280×800: section reveal and re-hide, the
   promo maths at 4/5/10/12/100, the 250→100 clamp, the "Outro" seller path, the copy-button
   label flip, the comprovante warning position, and the decoded `wa.me` text.
3. Shorten the idle delay temporarily to confirm it fires once and scrolls, then restore 120s.
4. Confirm each GA4 event in DebugView, in funnel order.
5. Confirm `/` still renders `HomeView` and an unknown path still redirects to `/`.

## Open items

- A lottery hero flier/banner for the top of the page is still missing.
- 11 of 13 prizes have no image, and more prizes are coming.
- Photo `(5).jpeg` shows a man in a "DJ FORRÓ NELESS" t-shirt while `schedule.ts` lists a
  separate `dropguima` handle for the event DJ — the photo→person pairing should be confirmed
  before it ships next to a professor's name.
- No *regulamento* copy (how the draw is conducted, how a winner is contacted).
- Per-route SEO: `index.html` meta is global and reads "próximos eventos em breve", so a shared
  `/blo` link previews with that text. Needs a router `afterEach` if wanted.
