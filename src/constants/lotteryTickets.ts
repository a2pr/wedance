/* Bilhete unitário, promoção 5+1 e limite por pessoa. */
export const LOTTERY_TICKET_PRICE = 10
export const LOTTERY_BONUS_THRESHOLD = 5
export const LOTTERY_BONUS_REWARD = 1
export const LOTTERY_MIN_TICKETS = 0
export const LOTTERY_MAX_TICKETS = 100

export interface LotteryTicketEvaluation {
  paidTickets: number
  bonusTickets: number
  totalTickets: number
  totalPriceValue: number
  ticketsToNextBonus: number
  isOneAwayFromBonus: boolean
  hasReachedMax: boolean
}

export function clampTicketQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return LOTTERY_MIN_TICKETS
  const whole = Math.trunc(quantity)
  if (whole < LOTTERY_MIN_TICKETS) return LOTTERY_MIN_TICKETS
  if (whole > LOTTERY_MAX_TICKETS) return LOTTERY_MAX_TICKETS
  return whole
}

export function evaluateLotteryTickets(paidTickets: number): LotteryTicketEvaluation {
  const paid = clampTicketQuantity(paidTickets)
  const bonusTickets = Math.floor(paid / LOTTERY_BONUS_THRESHOLD) * LOTTERY_BONUS_REWARD
  const remainder = paid % LOTTERY_BONUS_THRESHOLD
  const ticketsToNextBonus = LOTTERY_BONUS_THRESHOLD - remainder

  return {
    paidTickets: paid,
    bonusTickets,
    totalTickets: paid + bonusTickets,
    totalPriceValue: paid * LOTTERY_TICKET_PRICE,
    ticketsToNextBonus,
    isOneAwayFromBonus: paid > 0 && ticketsToNextBonus === 1 && paid < LOTTERY_MAX_TICKETS,
    hasReachedMax: paid >= LOTTERY_MAX_TICKETS,
  }
}

export function pluralizeTickets(count: number): string {
  return count === 1 ? 'bilhete' : 'bilhetes'
}

export function buildLotteryTicketsLabel(evaluation: LotteryTicketEvaluation): string {
  return `${evaluation.totalTickets} ${pluralizeTickets(evaluation.totalTickets)}`
}

export function buildBonusCelebrationMessage(evaluation: LotteryTicketEvaluation): string {
  const { bonusTickets } = evaluation
  return bonusTickets === 1
    ? 'Você ganhou 1 bilhete grátis!'
    : `Você ganhou ${bonusTickets} bilhetes grátis!`
}

export function buildBonusNudgeMessage(): string {
  return 'Falta só 1 bilhete para você ganhar mais 1 grátis!'
}

export function buildLotteryWhatsappSuffix(
  evaluation: LotteryTicketEvaluation,
  sellerName: string,
  priceDisplay: string,
): string {
  const { paidTickets, bonusTickets, totalTickets } = evaluation
  const bonusPart =
    bonusTickets > 0
      ? ` + ${bonusTickets} de bônus = ${totalTickets} ${pluralizeTickets(totalTickets)}`
      : ''
  return `${paidTickets} ${pluralizeTickets(paidTickets)}${bonusPart}, total ${priceDisplay}, vendedor: ${sellerName}`
}
