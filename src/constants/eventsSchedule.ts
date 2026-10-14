export interface UpcomingEvent {
  id: string
  dateLabel: string
  name: string
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 'mostra-danca-curitiba', dateLabel: '10 de Outubro', name: 'Mostra de Dança Curitiba' },
  { id: 'memorial', dateLabel: '18 de Outubro', name: 'Memorial' },
  { id: 'mostra-colombo', dateLabel: '24 de Outubro', name: 'Mostra Colombo' },
  { id: 'mostra-competitiva-sjp', dateLabel: '25 de Outubro', name: 'Mostra Competitiva SJP' },
  { id: 'brasil-latin-open', dateLabel: '05 a 08 de Novembro', name: 'Brasil Latin Open' },
  { id: 'festival-danca-curitiba', dateLabel: '15 de Novembro', name: 'Festival Dança Curitiba' },
]

export const EVENTS_SCHEDULE_PAGE_TITLE = 'Programação — Wedance'
export const EVENTS_SCHEDULE_HEADING = 'Programação'
export const EVENTS_SCHEDULE_INTRO = 'Confira os próximos eventos do Wedance e não perca nenhuma edição.'
export const EVENTS_SCHEDULE_BACK_LABEL = 'Voltar para a página inicial'
