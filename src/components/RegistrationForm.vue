<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import pixQrImage from '@/assets/images/pix-qr.png'
import { FORM_OPTIONS, formatPriceBRL } from '@/constants/formOptions'
import { WHATSAPP_PHONE_NUMBER, buildPaymentMessage, buildWhatsAppLink } from '@/constants/whatsapp'
import { buildPixInstructions, copyPixCodeToClipboard } from '@/constants/pix'
import {
  AULA_AVULSA_UPGRADE_MESSAGES,
  buildAulaAvulsaSelectionLabel,
  buildAulaAvulsaWhatsappSuffix,
  evaluateAulaAvulsaSelection,
  getClassNamesByIds,
  type AulaAvulsaUpgradeOptionId,
} from '@/constants/aulaAvulsaSelection'
import AulaAvulsaClassPicker from '@/components/AulaAvulsaClassPicker.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { ANALYTICS_EVENTS } from '@/constants/analyticsEvents'
import { trackEvent } from '@/utils/analytics'

const COPY_BUTTON_DEFAULT_LABEL = 'Pix copia Cola!'
const COPY_BUTTON_COPIED_LABEL = 'Copiado!'
const COPY_BUTTON_RESET_DELAY_MS = 1500
const AULA_AVULSA_OPTION_ID = 'aula-avulsa'

const selectedOptionId = ref<string>('')
const copyButtonLabel = ref(COPY_BUTTON_DEFAULT_LABEL)

const selectedClassIds = ref<string[]>([])
const isAulaAvulsaSubmitted = ref(false)
const showUpgradeModal = ref(false)
const pendingUpgradeOptionId = ref<AulaAvulsaUpgradeOptionId | null>(null)

const selectedOption = computed(() =>
  FORM_OPTIONS.find((option) => option.id === selectedOptionId.value),
)

const isAulaAvulsaMode = computed(() => selectedOptionId.value === AULA_AVULSA_OPTION_ID)
const aulaAvulsaEvaluation = computed(() => evaluateAulaAvulsaSelection(selectedClassIds.value))
const aulaAvulsaPriceDisplay = computed(() => formatPriceBRL(aulaAvulsaEvaluation.value.totalPriceValue))
const aulaAvulsaLabel = computed(() => buildAulaAvulsaSelectionLabel(selectedClassIds.value.length))
const upgradeModalMessage = computed(() =>
  pendingUpgradeOptionId.value ? AULA_AVULSA_UPGRADE_MESSAGES[pendingUpgradeOptionId.value] : '',
)

const pixContext = computed(() => {
  if (isAulaAvulsaMode.value) {
    if (!isAulaAvulsaSubmitted.value) return null
    return {
      priceDisplay: aulaAvulsaPriceDisplay.value,
      whatsappSuffix: buildAulaAvulsaWhatsappSuffix(getClassNamesByIds(selectedClassIds.value)),
    }
  }
  if (!selectedOption.value) return null
  return { priceDisplay: selectedOption.value.price, whatsappSuffix: selectedOption.value.whatsappSuffix }
})

watch(selectedOptionId, (newId, oldId) => {
  if (oldId === AULA_AVULSA_OPTION_ID && newId !== AULA_AVULSA_OPTION_ID) {
    selectedClassIds.value = []
    isAulaAvulsaSubmitted.value = false
    showUpgradeModal.value = false
    pendingUpgradeOptionId.value = null
  }
  if (newId) {
    const option = FORM_OPTIONS.find((candidate) => candidate.id === newId)
    trackEvent(ANALYTICS_EVENTS.SELECT_OPTION, { option_id: newId, option_label: option?.label })
  }
})

watch(pixContext, (newContext, oldContext) => {
  const hasChanged =
    !oldContext ||
    newContext?.priceDisplay !== oldContext.priceDisplay ||
    newContext?.whatsappSuffix !== oldContext.whatsappSuffix
  if (newContext && hasChanged) {
    trackEvent(ANALYTICS_EVENTS.VIEW_PAYMENT_INSTRUCTIONS, {
      option_id: selectedOptionId.value,
      price: newContext.priceDisplay,
    })
  }
})

function onConfirmAulaAvulsaSelection(): void {
  const { upgradeOptionId } = aulaAvulsaEvaluation.value
  trackEvent(ANALYTICS_EVENTS.CONFIRM_CLASS_SELECTION, {
    class_count: selectedClassIds.value.length,
    price: aulaAvulsaPriceDisplay.value,
  })
  if (upgradeOptionId) {
    pendingUpgradeOptionId.value = upgradeOptionId
    showUpgradeModal.value = true
    trackEvent(ANALYTICS_EVENTS.VIEW_UPGRADE_PROMPT, { suggested_option_id: upgradeOptionId })
    return
  }
  isAulaAvulsaSubmitted.value = true
}

function onConfirmUpgrade(): void {
  if (!pendingUpgradeOptionId.value) return
  trackEvent(ANALYTICS_EVENTS.CONFIRM_UPGRADE, { option_id: pendingUpgradeOptionId.value })
  selectedOptionId.value = pendingUpgradeOptionId.value
  showUpgradeModal.value = false
  pendingUpgradeOptionId.value = null
}

function onCancelUpgrade(): void {
  trackEvent(ANALYTICS_EVENTS.CANCEL_UPGRADE)
  showUpgradeModal.value = false
  pendingUpgradeOptionId.value = null
}

async function onCopyPixCode(): Promise<void> {
  await copyPixCodeToClipboard()
  trackEvent(ANALYTICS_EVENTS.COPY_PIX_CODE, {
    option_id: selectedOptionId.value,
    price: pixContext.value?.priceDisplay,
  })
  copyButtonLabel.value = COPY_BUTTON_COPIED_LABEL
  setTimeout(() => {
    copyButtonLabel.value = COPY_BUTTON_DEFAULT_LABEL
  }, COPY_BUTTON_RESET_DELAY_MS)
}

function sendPaymentConfirmation(): void {
  if (!pixContext.value) return
  trackEvent(ANALYTICS_EVENTS.PAYMENT_CONFIRMED, {
    option_id: selectedOptionId.value,
    price: pixContext.value.priceDisplay,
  })
  const message = buildPaymentMessage(pixContext.value.whatsappSuffix)
  const link = buildWhatsAppLink(WHATSAPP_PHONE_NUMBER, message)
  window.open(link, '_blank', 'noopener')
}
</script>

<template>
  <section class="min-vh-100 d-flex flex-column justify-content-center py-5 px-3">
    <div class="container">
      <h2 class="text-center mb-4">Inscrição</h2>

      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 justify-content-center">
        <div v-for="option in FORM_OPTIONS" :key="option.id" class="col">
          <label
            class="card h-100 text-center p-3"
            :class="{ 'border-success border-2': selectedOptionId === option.id }"
          >
            <input
              class="form-check-input mb-2"
              type="radio"
              name="registration-option"
              :value="option.id"
              v-model="selectedOptionId"
            />
            <span class="fw-semibold small">{{ option.label }}</span>
            <span class="text-success small">{{ option.price }}</span>
          </label>
        </div>
      </div>

      <div v-if="isAulaAvulsaMode && !isAulaAvulsaSubmitted" class="mt-4">
        <p class="text-center fw-semibold mb-3">Escolha as aulas que deseja fazer</p>
        <AulaAvulsaClassPicker v-model="selectedClassIds" />
        <div class="text-center mt-3">
          <p class="fw-bold fs-5 mb-3">{{ aulaAvulsaLabel }} — {{ aulaAvulsaPriceDisplay }}</p>
          <button
            type="button"
            class="btn btn-success"
            :disabled="selectedClassIds.length === 0"
            @click="onConfirmAulaAvulsaSelection"
          >
            Confirmar seleção
          </button>
        </div>
      </div>

      <div v-if="isAulaAvulsaMode && isAulaAvulsaSubmitted" class="text-center mt-4">
        <p class="fw-semibold mb-2">{{ aulaAvulsaLabel }}</p>
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="isAulaAvulsaSubmitted = false"
        >
          Alterar seleção
        </button>
      </div>

      <div v-if="pixContext" class="text-center mt-4">
        <p class="mx-auto registration-form__instructions">
          {{ buildPixInstructions(pixContext.priceDisplay) }}
        </p>
        <img
          class="img-fluid rounded mb-2 registration-form__image"
          :src="pixQrImage"
          alt="QR Code Pix"
        />
        <p class="fw-bold fs-5">{{ pixContext.priceDisplay }}</p>
        <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
          <button type="button" class="btn btn-outline-success" @click="onCopyPixCode">
            {{ copyButtonLabel }}
          </button>
          <button type="button" class="btn btn-success" @click="sendPaymentConfirmation">
            Já paguei!
          </button>
        </div>
      </div>

      <p class="text-center text-muted small mt-5 mb-0">
        Site desenvolvido por
        <a href="https://andrespayema.com/" target="_blank" rel="noopener noreferrer" class="text-muted">
          Andres Payema
        </a>
      </p>
    </div>

    <ConfirmModal
      :show="showUpgradeModal"
      title="Atualizar inscrição"
      :message="upgradeModalMessage"
      confirm-label="Confirmar"
      cancel-label="Cancelar"
      @confirm="onConfirmUpgrade"
      @cancel="onCancelUpgrade"
    />
  </section>
</template>

<style scoped>
.registration-form__image {
  max-width: 260px;
}

.registration-form__instructions {
  max-width: 480px;
}
</style>
