import aulaAvulsaImage from '@/assets/images/option-aula-avulsa.svg'
import periodoManhaImage from '@/assets/images/option-periodo-manha.svg'
import periodoTardeImage from '@/assets/images/option-periodo-tarde.svg'
import baileLatinoImage from '@/assets/images/option-baile-latino.svg'
import todasAulasImage from '@/assets/images/option-todas-aulas.svg'
import fullpassImage from '@/assets/images/option-fullpass.svg'

export interface FormOption {
  id: string
  label: string
  price: string
  image: string
  whatsappSuffix: string
}

export const FORM_OPTIONS: FormOption[] = [
  {
    id: 'aula-avulsa',
    label: 'Aula Avulsa',
    price: 'R$ 25,00',
    image: aulaAvulsaImage,
    whatsappSuffix: 'da aula avulsa',
  },
  {
    id: 'periodo-manha',
    label: 'Período - Manhã',
    price: 'R$ 50,00',
    image: periodoManhaImage,
    whatsappSuffix: 'do período da manhã',
  },
  {
    id: 'periodo-tarde',
    label: 'Período - Tarde',
    price: 'R$ 50,00',
    image: periodoTardeImage,
    whatsappSuffix: 'do período da tarde',
  },
  {
    id: 'baile-latino',
    label: 'Baile Latino',
    price: 'R$ 30,00',
    image: baileLatinoImage,
    whatsappSuffix: 'do baile latino',
  },
  {
    id: 'todas-aulas',
    label: 'Todas as Aulas (Sem baile)',
    price: 'R$ 80,00',
    image: todasAulasImage,
    whatsappSuffix: 'de todas as aulas (sem baile)',
  },
  {
    id: 'fullpass',
    label: 'Fullpass (Todas as aulas + Baile)',
    price: 'R$ 95,00',
    image: fullpassImage,
    whatsappSuffix: 'do pacote full pass',
  },
]
