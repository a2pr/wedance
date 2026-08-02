import { PICKABLE_SCHEDULE_PERIODS } from '@/constants/schedule'
import { FORM_OPTIONS } from '@/constants/formOptions'

export type AulaAvulsaUpgradeOptionId = 'periodo-manha' | 'periodo-tarde' | 'fullpass'

export interface AulaAvulsaSelectionResult {
  upgradeOptionId: AulaAvulsaUpgradeOptionId | null
  totalPriceValue: number
}

function findOption(optionId: string) {
  const option = FORM_OPTIONS.find((candidate) => candidate.id === optionId)
  if (!option) throw new Error(`Unknown form option id: ${optionId}`)
  return option
}

const AULA_AVULSA_UNIT_PRICE = findOption('aula-avulsa').priceValue

function idsMatch(selectedIds: string[], targetIds: string[]): boolean {
  return selectedIds.length === targetIds.length && targetIds.every((id) => selectedIds.includes(id))
}

function classIdsForPeriod(periodName: string): string[] {
  return PICKABLE_SCHEDULE_PERIODS.find((period) => period.period === periodName)?.items.map(
    (item) => item.id,
  ) ?? []
}

export function evaluateAulaAvulsaSelection(selectedClassIds: string[]): AulaAvulsaSelectionResult {
  const manhaIds = classIdsForPeriod('Manhã')
  const tardeIds = classIdsForPeriod('Tarde')
  const allIds = PICKABLE_SCHEDULE_PERIODS.flatMap((period) => period.items.map((item) => item.id))

  if (idsMatch(selectedClassIds, allIds)) {
    return { upgradeOptionId: 'fullpass', totalPriceValue: findOption('fullpass').priceValue }
  }
  if (idsMatch(selectedClassIds, manhaIds)) {
    return { upgradeOptionId: 'periodo-manha', totalPriceValue: findOption('periodo-manha').priceValue }
  }
  if (idsMatch(selectedClassIds, tardeIds)) {
    return { upgradeOptionId: 'periodo-tarde', totalPriceValue: findOption('periodo-tarde').priceValue }
  }
  return { upgradeOptionId: null, totalPriceValue: AULA_AVULSA_UNIT_PRICE * selectedClassIds.length }
}

export function buildAulaAvulsaSelectionLabel(count: number): string {
  return `Aula Avulsa (${count} ${count === 1 ? 'aula' : 'aulas'})`
}

const PICKABLE_CLASSES_BY_ID = new Map(
  PICKABLE_SCHEDULE_PERIODS.flatMap((period) => period.items).map((item) => [item.id, item.activity]),
)

export function getClassNamesByIds(classIds: string[]): string[] {
  return classIds
    .map((id) => PICKABLE_CLASSES_BY_ID.get(id))
    .filter((name): name is string => Boolean(name))
}

export function buildAulaAvulsaWhatsappSuffix(classNames: string[]): string {
  const count = classNames.length
  return `de ${count} ${count === 1 ? 'aula avulsa' : 'aulas avulsas'} (${classNames.join(', ')})`
}

function buildUpgradeMessage(prefix: string, optionId: AulaAvulsaUpgradeOptionId): string {
  const option = findOption(optionId)
  return `${prefix} — sua inscrição será convertida para ${option.label} (${option.price}).`
}

export const AULA_AVULSA_UPGRADE_MESSAGES: Record<AulaAvulsaUpgradeOptionId, string> = {
  'periodo-manha': buildUpgradeMessage('Você selecionou todas as aulas da manhã', 'periodo-manha'),
  'periodo-tarde': buildUpgradeMessage('Você selecionou todas as aulas da tarde', 'periodo-tarde'),
  fullpass: buildUpgradeMessage('Você selecionou todas as aulas', 'fullpass'),
}
