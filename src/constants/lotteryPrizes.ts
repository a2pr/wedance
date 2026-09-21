import prizeAulaWitheneyImage from '@/assets/images/prize-aula-witheney.jpeg'
import prizeAulaSamaraImage from '@/assets/images/prize-aula-samara.jpeg'
import prizeErica from '@/assets/images/prizeErica.jpeg'
import prizeTiaraImage from '@/assets/images/prize-tiara.jpeg'
import prizeAulaChrysImage from '@/assets/images/chrys.jpeg'
import prizeMilongaImage from '@/assets/images/milonga.jpeg'
import prizeTicketEncontroSertanejoImage from '@/assets/images/ticket-encontro-sertanejo.svg'
import prizeTicketSaboresDoNordesteImage from '@/assets/images/ticket-sabores-do-nordeste.svg'
import prizeTicketBoraDancarImage from '@/assets/images/ticket-bora-dancar.svg'
import prizeTicketDiaDeLosMuertosImage from '@/assets/images/ticket-dia-de-los-muertos.svg'
import prizeTicketBaileMovvaImage from '@/assets/images/ticket-baile-movva.svg'
import prizeTicketFullPassConecEmotionImage from '@/assets/images/ticket-full-pass-conecemotion.svg'
import prizeTicketFullPassCapivaraImage
  from '@/assets/images/ticket-full-pass-capivara-festival.svg'
import prizeAulaEnkaiImage from '@/assets/images/enkai.jpeg'
import bailarinaVideo from '@/assets/clip/bailarina.mp4'
import diaria from '@/assets/images/1diaria.jpeg'
import elBotina from '@/assets/images/elbotina.jpeg'

export interface LotteryPrize {
  id: string
  name: string
  description?: string
  image?: string
  video?: string
  instagramUrl?: string
  instagramName?: string
  imageFit?: 'cover' | 'contain'
  newPrize?: boolean
}

export const LOTTERY_PRIZES: LotteryPrize[] = [
  {
    id: 'aula-particular-chrys',
    name: 'Aula particular com a prof. Chrys',
    description: 'Uma aula particular exclusiva no ritmo que quiser',
    image: prizeAulaChrysImage,
    instagramUrl: 'https://www.instagram.com/chrysantos_/',
    instagramName: 'Chrys',
  },
  {
    id: 'aula-particular-witheney',
    name: 'Aula particular com o prof. Witheney',
    description: 'Uma aula particular exclusiva no ritmo que quiser',
    image: prizeAulaWitheneyImage,
    instagramUrl: 'https://www.instagram.com/witheneyalexander/',
    instagramName: 'Witheney',
  },
  {
    id: 'aula-particular-samara',
    name: 'Aula particular com a prof. Samara',
    description: 'Uma aula particular de tango exclusiva',
    image: prizeAulaSamaraImage,
    instagramUrl: 'https://www.instagram.com/samarasfair/',
    instagramName: 'Samara',
  },
  {
    id: 'aula-particular-erica-aoto',
    name: 'Aula particular com a prof. Erica Aoto',
    description: 'Uma aula particular exclusiva no ritmo que quiser',
    image: prizeErica,
    instagramUrl: 'https://www.instagram.com/ericaaoto/',
    instagramName: 'Erica Aoto',
    newPrize: true,
  },
  {
    id: 'bailarina',
    name: 'bailarina',
    description: 'Uma bailarina',
    video: bailarinaVideo,
  },
  {
    id: 'camisetas-personalizadas',
    name: 'Camisetas personalizadas',
  },
  {
    id: 'ingressos-encontro-sertanejo',
    name: 'Par de ingressos para o Encontro Sertanejo',
    image: prizeTicketEncontroSertanejoImage,
  },
  {
    id: 'tiara',
    name: 'Tiara',
    image: prizeTiaraImage,
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
    image: elBotina,
    imageFit: 'contain',
  },
  {
    id: 'kit-surpresa',
    name: 'Kit surpresa',
  },
  {
    id: 'ingressos-milonga-sentimental',
    name: 'Par de ingressos para a Milonga Sentimental',
    image: prizeMilongaImage,
  },
  {
    id: 'ingressos-sabores-do-nordeste',
    name: 'Par de ingressos para o evento Sabores do Nordeste',
    image: prizeTicketSaboresDoNordesteImage,
  },
  {
    id: 'one-mes-casal-sertanejo',
    name: '1 mês casal na turma de sertanejo',
    description: '1 mês na turma de sertanejo no Dance com Ricardinho',
    newPrize: true,
  },
  {
    id: '170-blindagem-unhas',
    name: 'Voucher de R$ 170,00',
    description: 'Blindagem de unhas naturais - Andreia Meira',
    newPrize: true,
  },
  {
    id: 'relogio',
    name: '1 Relógio feminino',
    newPrize: true,
  },
  {
    id: 'caioba',
    name: '1 diária de apto em Caiobá',
    image: diaria,
    imageFit: 'contain',
    newPrize: true,
  },
  {
    id: 'boneco-de-pano',
    name: '1 boneca de pano',
    newPrize: true,
  },
  {
    id: 'aula-de-dança-Cigana-Claudia',
    name: 'Aula de dança cigana artística com a prof. Claudia Cabral',
    newPrize: true,
  },
  {
    id: 'ingressos-bora-dancar',
    name: 'Par de ingressos para a Festa Bora Dançar',
    image: prizeTicketBoraDancarImage,
    newPrize: true,
  },
  {
    id: 'ingressos-dia-de-los-muertos',
    name: 'Par de ingressos para a Festa El Día de los Muertos',
    image: prizeTicketDiaDeLosMuertosImage,
    newPrize: true,
  },
  {
    id: 'camisetas-do-viva-latino',
    name: '2 camisetas do Viva Latino',
    newPrize: true,
  },
  {
    id: 'aula-passinhos-fafa',
    name: 'Aula de passinhos com Fafá do Flashback',
    newPrize: true,
  },
  {
    id: 'ingressos-Movva',
    name: 'Par de ingressos para o Baile do Movva',
    image: prizeTicketBaileMovvaImage,
    newPrize: true,
  },
  {
    id: 'full-pass-capivara-festival',
    name: 'Full pass Capivara Festival',
    image: prizeTicketFullPassCapivaraImage,
    newPrize: true,
  },
  {
    id: 'cachaças-artesanais',
    name: '2 cachaças artesanais',
    newPrize: true,
  },
  {
    id: 'full-pass-conecemotion-2027',
    name: '2 full pass para o ConecEmotion 2027',
    image: prizeTicketFullPassConecEmotionImage,
    newPrize: true,
  },
  {
    id: 'aula-particular-guille',
    name: 'Aula particular com o prof. Guille',
    description: 'Uma aula particular de salsa exclusiva',
    instagramUrl: 'https://www.instagram.com/iguillecast',
    instagramName: 'Guille',
    newPrize: true,
  },
  {
    id: 'aula-enkai',
    name: '1 aula na Enkai',
    image: prizeAulaEnkaiImage,
    newPrize: true,
  },
  {
    id: 'necessaire-lu-quadros',
    name: '2 nécessaire da Lu Quadros',
    newPrize: true,
  },
  {
    id: 'tenis-taygra',
    name: '1 tênis Taygra',
    newPrize: true,
  },
  {
    id: 'copo-termico-stanley',
    name: '1 copo térmico Stanley Ademicon verde-água',
    newPrize: true,
  },
]

export const LOTTERY_PRIZES_MORE_COMING = 'E mais prêmios estão chegando!'
