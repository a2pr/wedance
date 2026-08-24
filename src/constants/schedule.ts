export interface Instructor {
  name: string
  instagramUrl?: string
  instagramUrlTwo?: string
}

export interface ScheduleItem {
  id: string
  time: string
  activity: string
  instructor?: Instructor
  // absent means selectable; only the break and closing event opt out
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
        id: 'aula-1',
        time: '[HH:MM]',
        activity: '[Nome da Aula 1]',
        instructor: {name: 'Instrutor 1', instagramUrl: 'https://www.instagram.com/seu_instagram/'},
      },
      {
        id: 'aula-2',
        time: '[HH:MM]',
        activity: '[Nome da Aula 2]',
        instructor: {
          name: 'Instrutor 2 e Instrutor 3',
          instagramUrl: 'https://www.instagram.com/seu_instagram/',
          instagramUrlTwo: 'https://www.instagram.com/seu_instagram/'
        },
      },
      {
        id: 'aula-3',
        time: '[HH:MM]',
        activity: '[Nome da Aula 3]',
        instructor: {
          name: 'Instrutor 4',
          instagramUrl: 'https://www.instagram.com/seu_instagram/',
        },
      },
      {id: 'intervalo', time: '[HH:MM]', activity: 'Intervalo', selectable: false},
    ],
  },
  {
    period: 'Tarde',
    items: [
      {
        id: 'aula-4',
        time: '[HH:MM]',
        activity: '[Nome da Aula 4]',
        instructor: {name: 'Instrutor 5', instagramUrl: 'https://www.instagram.com/seu_instagram/'},
      },
      {
        id: 'aula-5',
        time: '[HH:MM]',
        activity: '[Nome da Aula 5]',
        instructor: {
          name: 'Instrutor 6',
          instagramUrl: 'https://www.instagram.com/seu_instagram/'
        },
      },
      {
        id: 'aula-6',
        time: '[HH:MM]',
        activity: '[Nome da Aula 6]',
        instructor: {
          name: 'Instrutor 7',
          instagramUrl: 'https://www.instagram.com/seu_instagram/',
        },
      },
      {
        id: 'aula-7',
        time: '[HH:MM]',
        activity: '[Nome da Aula 7]',
        instructor: {name: 'Instrutor 8', instagramUrl: 'https://www.instagram.com/seu_instagram/'},
      },
    ],
  },
  {
    period: 'Noite',
    items: [
      {
        id: 'evento-final',
        time: '[HH:MM] às [HH:MM]',
        activity: '[Nome do Evento Final]',
        instructor: {
          name: 'DJ Exemplo',
          instagramUrl: 'https://www.instagram.com/seu_instagram/',
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
