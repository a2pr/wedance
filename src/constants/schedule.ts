export interface ScheduleEntry {
  time: string
  activity: string
}

export const SCHEDULE_ENTRIES: ScheduleEntry[] = [
  { time: '09:00', activity: 'Recepção e credenciamento' },
  { time: '10:00', activity: 'Aula de abertura' },
  { time: '12:00', activity: 'Almoço' },
  { time: '14:00', activity: 'Workshops' },
  { time: '19:00', activity: 'Baile social' },
]
