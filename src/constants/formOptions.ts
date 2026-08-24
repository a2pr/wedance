export interface FormOption {
  id: string
  label: string
  price: string
  priceValue: number
  whatsappSuffix: string
}

export const FORM_OPTIONS: FormOption[] = [
  {
    id: 'aula-avulsa',
    label: '[Pacote 1]',
    price: 'R$ 25,00',
    priceValue: 25,
    whatsappSuffix: 'do [Pacote 1]',
  },
  {
    id: 'periodo-manha',
    label: '[Pacote 2]',
    price: 'R$ 50,00',
    priceValue: 50,
    whatsappSuffix: 'do [Pacote 2]',
  },
  {
    id: 'periodo-tarde',
    label: '[Pacote 3]',
    price: 'R$ 50,00',
    priceValue: 50,
    whatsappSuffix: 'do [Pacote 3]',
  },
  {
    id: 'baile-latino',
    label: '[Pacote 4]',
    price: 'R$ 30,00',
    priceValue: 30,
    whatsappSuffix: 'do [Pacote 4]',
  },
  {
    id: 'todas-aulas',
    label: '[Pacote 5]',
    price: 'R$ 80,00',
    priceValue: 80,
    whatsappSuffix: 'do [Pacote 5]',
  },
  {
    id: 'fullpass',
    label: '[Pacote 6]',
    price: 'R$ 95,00',
    priceValue: 95,
    whatsappSuffix: 'do [Pacote 6]',
  },
]

export function formatPriceBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}
