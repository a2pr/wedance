export interface Instructor {
  name: string
  instagramUrl?: string
}

export interface ScheduleItem {
  id: string
  time: string
  activity: string
  instructor?: Instructor
  // absent means selectable; only Intervalo and Baile Latino opt out
  selectable?: boolean
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
        id: 'tecnicas-corporais',
        time: '09:30',
        activity: 'Técnicas Corporais',
        instructor: { name: 'Erica Aoto', instagramUrl: 'https://www.instagram.com/ericaaoto/' },
      },
      {
        id: 'forro-manha',
        time: '10:30',
        activity: 'Forró e suas possibilidades',
        instructor: {
          name: 'Pamela Ribeiro',
          instagramUrl: 'https://www.instagram.com/pamrvribeiro/',
        },
      },
      {
        id: 'sertanejo-intermediario',
        time: '11:30',
        activity: 'Sertanejo Intermediário',
        instructor: {
          name: 'Gregorio Negoseki',
          instagramUrl: 'https://www.instagram.com/gregorio.negoseki/',
        },
      },
      { id: 'intervalo', time: '12:30', activity: 'Intervalo', selectable: false },
    ],
  },
  {
    period: 'Tarde',
    items: [
      {
        id: 'tango',
        time: '13:30',
        activity: 'Tango para todos',
        instructor: { name: 'Samara', instagramUrl: 'https://www.instagram.com/samarasfair/' },
      },
      {
        id: 'samba',
        time: '14:30',
        activity: 'Samba (Entendendo melhor os deslocamentos)',
        instructor: { name: 'Daniel' },
      },
      {
        id: 'forro-tarde',
        time: '15:30',
        activity: 'Forró (O universo do amassa cacau)',
        instructor: {
          name: 'Witheney',
          instagramUrl: 'https://www.instagram.com/witheneyalexander/',
        },
      },
      {
        id: 'salsa',
        time: '16:30',
        activity: 'Salsa (Dile que no)',
        instructor: { name: 'Jhon', instagramUrl: 'https://www.instagram.com/michell_jmpy/' },
      },
    ],
  },
  {
    period: 'Noite',
    items: [
      {
        id: 'baile-latino',
        time: '17:30 às 20:30',
        activity: 'Baile Latino',
        instructor: {
          name: 'DJ Dropguima',
          instagramUrl: 'https://www.instagram.com/dropguima/',
        },
        selectable: false,
      },
    ],
  },
]

export const PICKABLE_SCHEDULE_PERIODS: SchedulePeriod[] = SCHEDULE_PERIODS.map((period) => ({
  period: period.period,
  items: period.items.filter((item) => item.selectable !== false),
})).filter((period) => period.items.length > 0)
