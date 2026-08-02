export interface Instructor {
  name: string
  instagramUrl?: string
}

export interface ScheduleItem {
  time: string
  activity: string
  instructor?: Instructor
}

export interface SchedulePeriod {
  period: string
  items: ScheduleItem[]
}

export const SCHEDULE_PERIODS: SchedulePeriod[] = [
  {
    period: 'Manhã',
    items: [
      {
        time: '09:30',
        activity: 'Técnicas Corporais',
        instructor: { name: 'Erica Aoto', instagramUrl: 'https://www.instagram.com/ericaaoto/' },
      },
      {
        time: '10:30',
        activity: 'Forró e suas possibilidades',
        instructor: {
          name: 'Pamela Ribeiro',
          instagramUrl: 'https://www.instagram.com/pamrvribeiro/',
        },
      },
      {
        time: '11:30',
        activity: 'Sertanejo Intermediário',
        instructor: {
          name: 'Gregorio Negoseki',
          instagramUrl: 'https://www.instagram.com/gregorio.negoseki/',
        },
      },
      { time: '12:30', activity: 'Intervalo' },
    ],
  },
  {
    period: 'Tarde',
    items: [
      {
        time: '13:30',
        activity: 'Tango para todos',
        instructor: { name: 'Samara', instagramUrl: 'https://www.instagram.com/samarasfair/' },
      },
      {
        time: '14:30',
        activity: 'Samba (Entendendo melhor os deslocamentos)',
        instructor: { name: 'Daniel' },
      },
      {
        time: '15:30',
        activity: 'Forró (O universo do amassa cacau)',
        instructor: {
          name: 'Witheney',
          instagramUrl: 'https://www.instagram.com/witheneyalexander/',
        },
      },
      {
        time: '16:30',
        activity: 'Salsa (Introdução à Roda de Casino)',
        instructor: { name: 'Jhon', instagramUrl: 'https://www.instagram.com/michell_jmpy/' },
      },
    ],
  },
  {
    period: 'Noite',
    items: [
      {
        time: '17:30 às 20:30',
        activity: 'Baile Latino',
        instructor: {
          name: 'DJ Dropguima',
          instagramUrl: 'https://www.instagram.com/dropguima/',
        },
      },
    ],
  },
]
