import option1Image from '@/assets/images/option-1.svg'
import option2Image from '@/assets/images/option-2.svg'
import option3Image from '@/assets/images/option-3.svg'

export interface FormOption {
  id: string
  label: string
  image: string
}

export const FORM_OPTIONS: FormOption[] = [
  { id: 'opcao-1', label: 'Opção 1', image: option1Image },
  { id: 'opcao-2', label: 'Opção 2', image: option2Image },
  { id: 'opcao-3', label: 'Opção 3', image: option3Image },
]
