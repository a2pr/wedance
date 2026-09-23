export interface LotterySeller {
  id: string
  name: string
}

export const OTHER_SELLER_ID = 'outro'

export const LOTTERY_SELLERS: LotterySeller[] = [
  { id: 'samara', name: 'Samara' },
  { id: 'andres', name: 'Andres' },
  { id: 'aline', name: 'Aline' },
  { id: 'bianca', name: 'Bianca' },
  { id: 'lara', name: 'Lara' },
  { id: 'talita', name: 'Talita' },
  { id: 'giovana', name: 'Giovana' },
  { id: 'isabely', name: 'Isabely' },
  { id: 'luciana', name: 'Luciana' },
  { id: 'gabriel', name: 'Gabriel' },
  { id: 'leonardo', name: 'Leonardo' },
  { id: 'esteban', name: 'Esteban' },
  { id: 'jhon', name: 'Jhon' },
  { id: 'witheney', name: 'Witheney' },
  { id: 'rodrigo', name: 'Rodrigo' },
  { id: 'renata', name: 'Renata' },
]

export function resolveSellerName(sellerId: string, customName: string): string {
  if (sellerId === OTHER_SELLER_ID) return customName.trim()
  return LOTTERY_SELLERS.find((seller) => seller.id === sellerId)?.name ?? ''
}

function normalizeSellerName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function findSellerByName(value: string): LotterySeller | undefined {
  const normalized = normalizeSellerName(value)
  if (!normalized) return undefined
  return LOTTERY_SELLERS.find(
    (seller) =>
      normalizeSellerName(seller.id) === normalized ||
      normalizeSellerName(seller.name) === normalized,
  )
}
