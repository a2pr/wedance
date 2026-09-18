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

---

## Refinement pass: tiara image + prefill links

Follow-up on top of commit `42d2255`.

### Tiara image

`src/assets/images/prize-tiara.jpeg` (958×958) added and wired to the `tiara` entry in
`lotteryPrizes.ts`. The card switches from the 🎁 fallback automatically — the existing
`aspect-ratio: 3 / 4` + `object-fit: cover` + `object-position: top center` keeps the headband
in frame on a square source. Verified at 375 and 1280.

Two further photos arrived in the same drop (`WhatsApp Image 2026-09-18 at 10.57.32.jpeg` and
`… (1).jpeg`, both bags) and are deliberately left unused pending confirmation of which prize
they belong to.

### Query-parameter prefill

Sellers share this link by hand over WhatsApp. `?seller=` and `?ticket=` let them share a link
that opens with their name selected and a quantity already counted, landing the buyer on the
PIX screen.

`src/constants/lotteryQueryParams.ts` owns the URL contract and all parsing;
`LotteryView.vue` only initializes its existing refs from it.

**`seller` — case-insensitive.** `findSellerByName()` in `lotterySellers.ts` lowercases both
the incoming value and each candidate (plus trim and accent-stripping) before comparing, against
both `id` and `name`. `Samara`, `samara`, `SAMARA`, `SaMaRa` and `  samara  ` all resolve to
`{ id: 'samara' }`. What is stored is always the canonical lowercase slug, never the raw query
string, so the dropdown binds correctly and `seller_id` reports consistently.

An unmatched name is ignored and nothing is selected. That is deliberate: the seller name flows
into the WhatsApp message, which is the only record of who made the sale, so an allowlist stops
a crafted link writing arbitrary text into it. `outro` is rejected for the same reason — it is
the free-text branch.

**`ticket`** — digits only (`/^\d+$/`) on the trimmed value, then the existing
`clampTicketQuantity()`. `5` → 5, `250` → 100; `5.9`, `-3`, `abc` and empty → no prefill. Strict
digit matching matters because `Number('5.9')` would otherwise silently truncate.

### Prefill does not fire `select_seller`

Prefills are applied as *initial* ref values, so the existing watchers do not fire. That is
correct — a prefill is not a user selection, and counting it as one would corrupt the funnel.

This left one real gap, now fixed: `view_payment_instructions` fires from
`watch(paymentContext, …)` with no `immediate: true`, so on a fully-prefilled link (where
`paymentContext` is non-null at setup) it would never have fired, and the funnel would show
conversions with no payment-screen step. `LotteryView.vue` now fires it once on mount when the
context is already populated.

### New event

| Step | Event | Params |
|---|---|---|
| Link opened with a prefill | `lottery_prefill_applied` | `flow`, `seller_id`, `paid_tickets`, `has_seller_prefill`, `has_ticket_prefill` |

Fires once on mount, only when at least one prefill applied; never on a bare `/blo`.
`seller_id` is the same slug used by `select_seller` and `payment_confirmed`, so all three group
on one dimension.

`payment_confirmed` already gave per-seller **sales**; this gives the other half of the ratio —
how many people **opened** each seller's link, including those who never bought — turning a
sales count into a per-seller conversion rate. Register `seller_id` as a custom dimension in the
GA4 property to group by it in standard reports.

### Verified

| URL | Result |
|---|---|
| `?seller=Samara&ticket=5` | qty 5, "6 bilhetes", R$ 50,00, Samara selected, payment visible |
| `?seller=SAMARA` / `SaMaRa` / `%20samara%20` | all resolve to Samara |
| `?seller=Samara` alone | seller held in state; applied once a quantity is picked |
| `?seller=Mariana` / `xyz` / `outro` | nothing selected; ticket prefill still honoured |
| `?ticket=250` | clamped to 100 (R$ 1.000,00) |
| `?ticket=5.9` / `-3` / `abc` / empty | no prefill |
| `/blo` | unchanged |

Prefilled dropdown stays editable and `select_seller` fires on the user's change only. The idle
prompt is suppressed on prefilled links and still fires on cold ones. Type-check and lint clean.

### Two bugs found while verifying prefilled renders

**Seller silently lost on a counter round-trip.** `watch(paidTickets, …)` cleared
`selectedSellerId` whenever the quantity hit 0. Dropping the counter to 0 and raising it again
therefore wiped a prefilled seller with no visible sign: the buyer was never blocked, but the
seller lost credit for the sale and the WhatsApp message lost its `vendedor:` value.

The reset is removed. The seller section still hides at 0 because it is gated on `hasTickets`,
and `paymentContext` requires tickets too, so holding the value while hidden leaks nothing.
`watch(selectedSellerId, …)` still clears `customSellerName` when the seller changes away from
`outro`. Verified 5 → 0 → 3 keeps Samara and still reaches the message, and that the
`outro` + custom-name path survives the same round-trip.

**`view_section` never fired for `lottery_prizes`** (pre-existing, from the original build).
The observer used `threshold: 0.5`, but the prizes section is ~2037px tall against a 900px
viewport — 50% of it can never be on screen at once, so the threshold was unreachable and the
top of the funnel was missing from GA4 entirely.

Replaced with `rootMargin: '-25% 0px -25% 0px'` and `threshold: 0`, which fires when a section
enters the middle band of the viewport regardless of its height. All five sections now report,
`lottery_prizes` fires on load, and the `Set` dedup still holds (scrolling up and down
repeatedly yields one event per section).

`DayView.vue` uses the same 0.5-threshold pattern and may under-report; left alone, since `/day`
is currently unrouted.

### Landing position — deliberately unchanged

A prefilled link lands at the top of the page; the payment section sits ~3,150px below on
desktop. Auto-scrolling was considered and rejected: the prize gallery is what motivates the
purchase, so a seller-shared link should still show it before asking for money.

---

## Refinement pass: event flyer hero + four prize images

### New hero section

`blo.jpeg` (the "Rumo ao BLO 26" event flyer) becomes the **first** section, above the prize
gallery, in a new `LotteryHeroSection.vue`. Capped at `min(100%, 560px)` and centred; verified
at 375px with no horizontal overflow.

Adding a section shifted every index in `LotteryView.vue`. `TICKETS_SECTION_INDEX = 2` was a
hardcoded constant that would now point at the promotion section, silently breaking the idle
prompt's scroll target. It is replaced with a lookup by id:

```ts
scrollToSection(sections.value.findIndex((s) => s.id === LOTTERY_SECTION_IDS.TICKETS))
```

so the target survives any future reordering. `LOTTERY_SECTION_IDS.HERO` added, and
`view_section` now reports `lottery_hero` on load.

Note on the idle scroll: with the quantity at 0 the counter is the last section on the page, so
`scrollIntoView({ block: 'start' })` cannot bring it to the very top — the document ends first.
Verified `scrollY === maxScroll` and the stepper fully in view. Working as intended, not a bug.

### Prize images

| Prize | Image |
|---|---|
| Aula particular prof. Chrys | `chrys.jpeg` |
| Par de ingressos Encontro Sertanejo | `ingressos.jpeg` (generic ticket) |
| Par de ingressos milonga Sentimental | `milonga.jpeg` (event flyer) |
| Par de ingressos Sabores do Nordeste | `ingressos.jpeg` (generic ticket) |

7 of 13 prizes now carry artwork. Filenames were kept as delivered rather than renamed to the
`prize-*` convention, since they are already lowercase and space-free.

### Cross-check against the flyer

The flyer is the source of truth for the offer, and reading it surfaced discrepancies with
`LOTTERY_PRIZES` that need a human decision:

- **Chapinha and Babyliss are two separate prizes on the flyer** (`1- Chapinha`, `1- Babyliss`);
  the site lists a single combined "Chapinha Babyliss". The site therefore advertises one fewer
  prize than the flyer.
- **Camisetas Personalizadas is quantity 2** on the flyer; the site card shows no quantity.
- **PIX key on the flyer is `alexanderwitheney@gmail.com`.** The site pays via
  `VITE_PIX_COPY_PASTE_CODE` and the static `pix-qr.png`. These must resolve to the same account
  — a mismatch sends money to the wrong place. Env files are not touched by this project, so
  this needs a human check.
- **Phone on the flyer is `41 99504-1791`**, which must match `VITE_WHATSAPP_PHONE_NUMBER` or
  confirmations land in a different inbox than the flyer advertises.
- The prize card reads "Aula particular com **a** prof. Chrys"; the flyer uses no article.
  Worth confirming which is correct before it ships next to a real person's name.

Confirmed matching: draw date 10/10, ticket price 10 reais, and "A cada 5 números +1 de brinde"
(the 5+1 promotion).

### Open item

`ingressos.jpeg` is branded **"Estação Natureza"** — a specific venue name, visible on the card.
It reads oddly as the image for Encontro Sertanejo and Sabores do Nordeste tickets. Either a
truly unbranded ticket graphic or painting out that text would make it generic as intended.

---

## Language and grammar review

A full pass over every user-visible string on `/blo`. Five corrections applied:

| Before | After | Why |
|---|---|---|
| `Par de ingressos para o Sabores do Nordeste` | `…para o evento Sabores do Nordeste` | Singular article against a plural noun. Adding "evento" makes the article agree and keeps the event name intact. |
| `Par de ingressos para a milonga Sentimental` | `…para a Milonga Sentimental` | "Milonga Sentimental" is the event's proper name, as the flyer shows it. |
| `Sem o comprovante sua participação…` | `Sem o comprovante, sua participação…` | Comma after the fronted adverbial phrase. |
| `Segue o comprovante do PIX em anexo.` | `Vou enviar o comprovante do Pix agora.` | The old line claimed the receipt was attached, but it is written *before* the buyer attaches anything — `wa.me` cannot carry a file. The new line is accurate and still prompts the action. |
| `PIX` in display copy | `Pix` | Banco Central styles the brand "Pix". The page mixed `PIX` in prose with `Pix` on the copy button. Now consistent; `PIX_` code identifiers are untouched. |

Verified correct and left alone: accents throughout, singular/plural agreement driven by
`pluralizeTickets()` (1 bilhete / 2 bilhetes, and the bonus celebration in both forms), the
nudge copy, currency via `formatPriceBRL`, all `alt` text, `aria-label`s, `<select>` options and
the input placeholder. No stray English in any display string.

`/day`'s `buildPixInstructions()` still mixes `PIX` and `pix` and `WHATSAPP_MESSAGE_PREFIX`
still reads `Ja paguei minha inscripçao` (missing accent, Spanish-influenced spelling). Both
left as-is — out of scope for this page, and noted here rather than fixed as a drive-by.

### Still open for a human

- "Aula particular com **a** prof. Chrys" — the article was never confirmed.
- "Chapinha Babyliss" is one prize on the site but two on the flyer.
- "Camisetas personalizadas" does not show the flyer's quantity of 2.

---

## Refinement pass: prize carousel + section navigation dots

### Prize carousel

`LotteryPrizesSection.vue` changes from a wrapping grid to a horizontal carousel showing
**4 prizes at a time** on desktop. Bootstrap's JS is deliberately not loaded in this project, so
the carousel is hand-rolled from CSS scroll-snap — no new dependency:

- track is `display: flex; overflow-x: auto; scroll-snap-type: x mandatory`, scrollbar hidden
- each slide is `flex: 0 0 calc((100% - (n - 1) * gap) / n)` with `n` set per breakpoint
- `n` = 4 at ≥992px, 3 at ≥768px, 2 below — 4 at once is unreadable at 375px
- prev/next buttons scroll by exactly one page (`el.clientWidth`) and disable at each end,
  driven by a `scroll` handler with a 4px tolerance

**Arrows are hidden below 1200px.** They sit at the container's edge and the navigation dots are
fixed 20px from the viewport's right edge; measured at 375/768/992 the two overlap, and only at
xl does the container margin create clearance. Below xl the carousel is swiped or scrolled,
which is the native gesture on those devices anyway.

### Section navigation dots

The `/day` scroll indicator is extracted into `SectionScrollIndicator.vue` — same markup,
same 12px bordered dots, same fixed right-centre placement. `DayView.vue` is left untouched.

Per the brief the dots show **four** navigational steps, not the six observed sections — the
purchase flow is one step:

| Dot | Covers |
|---|---|
| Início | `lottery_hero` |
| Prêmios | `lottery_prizes` |
| Como funciona | `lottery_promotion` |
| Bilhetes e pagamento | `lottery_tickets`, `lottery_seller`, `lottery_payment` |

`LOTTERY_NAV_GROUPS` in `lotteryUi.ts` owns that mapping. The dot count stays at 4 whether or
not the seller and payment sections have been revealed, and clicking the fourth dot scrolls to
the counter.

**The active dot follows the viewport centre**, not the IntersectionObserver. Two earlier
attempts were wrong and are worth recording:

1. Setting the active index per observer entry meant the last entry processed won, so at the top
   of the page "Prêmios" lit up instead of "Início".
2. Taking the topmost intersecting section fixed that but broke "Como funciona": at 456px it is
   shorter than the observer's 450px band, so a neighbour always co-intersects and the section
   above always won. That dot could never activate.

The dot now tracks whichever section contains the vertical centre of the viewport, recomputed on
`scroll`/`resize` behind `requestAnimationFrame` and cleaned up on unmount. The observer keeps
its single job — deduped `view_section` analytics. Verified each of the four dots activates at
the right scroll offsets and that every dot navigates to its section.
