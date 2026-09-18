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
