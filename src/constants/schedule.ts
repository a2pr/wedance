export interface ScheduleItem {
  time: string
  description: string
}

export interface SchedulePeriod {
  period: string
  items: ScheduleItem[]
}

export const SCHEDULE_PERIODS: SchedulePeriod[] = [
  {
    period: 'Manhã',
    items: [
      { time: '09:30', description: 'Erica Aoto: Técnicas Corporais' },
      { time: '10:30', description: 'Pamela Ribeiro: Forró e suas possibilidades' },
      { time: '11:30', description: 'Gregorio Negoseki: Sertanejo Intermediário' },
      { time: '12:30', description: 'Intervalo' },
    ],
  },
  {
    period: 'Tarde',
    items: [
      { time: '13:30', description: 'Samara: Tango para todos' },
      { time: '14:30', description: 'Daniel: Samba (Entendendo melhor os deslocamentos)' },
      { time: '15:30', description: 'Witheney: Forró (O universo do amassa cacau)' },
      { time: '16:30', description: 'Jhon: Salsa (Introdução à Roda de Casino)' },
    ],
  },
  {
    period: 'Noite',
    items: [{ time: '17:30 às 20:30', description: 'Baile Latino com DJ Dropguima' }],
  },
]
