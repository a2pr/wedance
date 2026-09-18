import { clampTicketQuantity } from '@/constants/lotteryTickets'
import { findSellerByName } from '@/constants/lotterySellers'

export const LOTTERY_SELLER_QUERY_PARAM = 'seller'
export const LOTTERY_TICKET_QUERY_PARAM = 'ticket'

const INTEGER_PATTERN = /^\d+$/

export interface LotteryPrefill {
  sellerId: string
  paidTickets: number
  hasSellerPrefill: boolean
  hasTicketPrefill: boolean
}

export function readQueryValue(value: unknown): string {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === 'string' ? raw : ''
}

export function parseSellerParam(value: unknown): string {
  return findSellerByName(readQueryValue(value))?.id ?? ''
}

export function parseTicketParam(value: unknown): number {
  const raw = readQueryValue(value).trim()
  if (!INTEGER_PATTERN.test(raw)) return 0
  return clampTicketQuantity(Number(raw))
}

export function parseLotteryPrefill(query: Record<string, unknown>): LotteryPrefill {
  const sellerId = parseSellerParam(query[LOTTERY_SELLER_QUERY_PARAM])
  const paidTickets = parseTicketParam(query[LOTTERY_TICKET_QUERY_PARAM])

  return {
    sellerId,
    paidTickets,
    hasSellerPrefill: sellerId !== '',
    hasTicketPrefill: paidTickets > 0,
  }
}
