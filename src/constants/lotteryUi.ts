export const LOTTERY_SECTION_IDS = {
  HERO: 'lottery_hero',
  PRIZES: 'lottery_prizes',
  PROMOTION: 'lottery_promotion',
  TICKETS: 'lottery_tickets',
  SELLER: 'lottery_seller',
  PAYMENT: 'lottery_payment',
} as const

/* Agrupa as seções observadas nos pontos de navegação; a compra é um passo só. */
export const LOTTERY_NAV_GROUPS = [
  { id: 'inicio', label: 'Início', sectionIds: [LOTTERY_SECTION_IDS.HERO] },
  { id: 'premios', label: 'Prêmios', sectionIds: [LOTTERY_SECTION_IDS.PRIZES] },
  { id: 'como-funciona', label: 'Como funciona', sectionIds: [LOTTERY_SECTION_IDS.PROMOTION] },
  {
    id: 'compra',
    label: 'Bilhetes e pagamento',
    sectionIds: [
      LOTTERY_SECTION_IDS.TICKETS,
      LOTTERY_SECTION_IDS.SELLER,
      LOTTERY_SECTION_IDS.PAYMENT,
    ],
  },
] as const

export const LOTTERY_SECTION_NAV_LABEL = 'Seções da página'

/* Prêmios visíveis por vez no carrossel, por breakpoint. */
export const LOTTERY_PRIZES_PER_VIEW_DESKTOP = 4
export const LOTTERY_PRIZES_PREV_LABEL = 'Ver prêmios anteriores'
export const LOTTERY_PRIZES_NEXT_LABEL = 'Ver próximos prêmios'
export const LOTTERY_PRIZES_PAGE_NAV_LABEL = 'Páginas de prêmios'
export const LOTTERY_PRIZES_PAGE_LABEL = 'Página'

export const LOTTERY_PAGE_TITLE = 'Rifa Wedance'
export const LOTTERY_FLYER_ALT = 'Rumo ao BLO 26 — Ação entre Amigos: lista de prêmios da rifa'
export const LOTTERY_FLYER_ZOOM_HINT = 'Toque para ampliar'
export const LOTTERY_FLYER_CLOSE_LABEL = 'Fechar imagem ampliada'
export const LOTTERY_PRIZES_HEADING = 'Prêmios'
export const LOTTERY_PROMOTION_HEADING = 'Como funciona'
export const LOTTERY_TICKETS_HEADING = 'Quantos bilhetes você quer?'
export const LOTTERY_SELLER_HEADING = 'Quem te vendeu o bilhete?'
export const LOTTERY_PAYMENT_HEADING = 'Pagamento'

export const LOTTERY_IDLE_PROMPT_DELAY_MS = 120_000
export const LOTTERY_IDLE_PROMPT_TITLE = 'Bora participar?'
export const LOTTERY_IDLE_PROMPT_MESSAGE =
  'Escolha quantos bilhetes você quer e concorra a todos os prêmios da nossa rifa!'
export const LOTTERY_IDLE_PROMPT_CONFIRM = 'Escolher meus bilhetes'
export const LOTTERY_IDLE_PROMPT_CANCEL = 'Agora não'

export const LOTTERY_FLOW_NAME = 'lottery'
