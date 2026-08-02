export interface FormOption {
  id: string
  label: string
  price: string
  whatsappSuffix: string
}

export const FORM_OPTIONS: FormOption[] = [
  {
    id: 'aula-avulsa',
    label: 'Aula Avulsa',
    price: 'R$ 25,00',
    whatsappSuffix: 'da aula avulsa',
  },
  {
    id: 'periodo-manha',
    label: 'Período - Manhã',
    price: 'R$ 50,00',
    whatsappSuffix: 'do período da manhã',
  },
  {
    id: 'periodo-tarde',
    label: 'Período - Tarde',
    price: 'R$ 50,00',
    whatsappSuffix: 'do período da tarde',
  },
  {
    id: 'baile-latino',
    label: 'Baile Latino',
    price: 'R$ 30,00',
    whatsappSuffix: 'do baile latino',
  },
  {
    id: 'todas-aulas',
    label: 'Todas as Aulas (Sem baile)',
    price: 'R$ 80,00',
    whatsappSuffix: 'de todas as aulas (sem baile)',
  },
  {
    id: 'fullpass',
    label: 'Fullpass (Todas as aulas + Baile)',
    price: 'R$ 95,00',
    whatsappSuffix: 'do pacote full pass',
  },
]
