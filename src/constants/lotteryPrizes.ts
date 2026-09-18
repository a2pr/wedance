import prizeAulaWitheneyImage from '@/assets/images/prize-aula-witheney.jpeg'
import prizeAulaSamaraImage from '@/assets/images/prize-aula-samara.jpeg'

export interface LotteryPrize {
  id: string
  name: string
  description?: string
  image?: string
  instagramUrl?: string
  instagramName?: string
}

export const LOTTERY_PRIZES: LotteryPrize[] = [
  {
    id: 'aula-particular-chrys',
    name: 'Aula particular com a prof. Chrys',
    description: 'Uma aula particular exclusiva',
  },
  {
    id: 'aula-particular-witheney',
    name: 'Aula particular com o prof. Witheney',
    description: 'Uma aula particular exclusiva',
    image: prizeAulaWitheneyImage,
    instagramUrl: 'https://www.instagram.com/witheneyalexander/',
    instagramName: 'Witheney',
  },
  {
    id: 'aula-particular-samara',
    name: 'Aula particular com a prof. Samara',
    description: 'Uma aula particular exclusiva',
    image: prizeAulaSamaraImage,
    instagramUrl: 'https://www.instagram.com/samarasfair/',
    instagramName: 'Samara',
  },
  {
    id: 'sapatilha-bailarina',
    name: 'Sapatilha bailarina',
    description: 'Um par de sapatilhas',
  },
  {
    id: 'camisetas-personalizadas',
    name: 'Camisetas personalizadas',
  },
  {
    id: 'ingressos-encontro-sertanejo',
    name: 'Par de ingressos para o Encontro Sertanejo',
  },
  {
    id: 'tiara',
    name: 'Tiara',
  },
  {
    id: 'bolsa-de-perolas',
    name: 'Bolsa de pérolas',
  },
  {
    id: 'chapinha-babyliss',
    name: 'Chapinha Babyliss',
  },
  {
    id: 'voucher-el-botina',
    name: 'Voucher de R$ 100,00',
    description: 'No Ateliê e Sapataria El Botina',
  },
  {
    id: 'kit-surpresa',
    name: 'Kit surpresa',
  },
  {
    id: 'ingressos-milonga-sentimental',
    name: 'Par de ingressos para a milonga Sentimental',
  },
  {
    id: 'ingressos-sabores-do-nordeste',
    name: 'Par de ingressos para o Sabores do Nordeste',
  },
]

export const LOTTERY_PRIZES_MORE_COMING = 'E mais prêmios estão chegando!'
