<script setup lang="ts">
import { computed, ref } from 'vue'
import pixQrImage from '@/assets/images/pix-qr.svg'
import { FORM_OPTIONS } from '@/constants/formOptions'
import { WHATSAPP_PHONE_NUMBER, buildPaymentMessage, buildWhatsAppLink } from '@/constants/whatsapp'
import { buildPixInstructions, copyPixCodeToClipboard } from '@/constants/pix'

const COPY_BUTTON_DEFAULT_LABEL = 'Pix copia Cola!'
const COPY_BUTTON_COPIED_LABEL = 'Copiado!'
const COPY_BUTTON_RESET_DELAY_MS = 1500

const selectedOptionId = ref<string>('')
const copyButtonLabel = ref(COPY_BUTTON_DEFAULT_LABEL)

const selectedOption = computed(() =>
  FORM_OPTIONS.find((option) => option.id === selectedOptionId.value),
)

async function onCopyPixCode(): Promise<void> {
  await copyPixCodeToClipboard()
  copyButtonLabel.value = COPY_BUTTON_COPIED_LABEL
  setTimeout(() => {
    copyButtonLabel.value = COPY_BUTTON_DEFAULT_LABEL
  }, COPY_BUTTON_RESET_DELAY_MS)
}

function sendPaymentConfirmation(): void {
  if (!selectedOption.value) return
  const message = buildPaymentMessage(selectedOption.value.whatsappSuffix)
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

      <div v-if="selectedOption" class="text-center mt-4">
        <p class="mx-auto registration-form__instructions">
          {{ buildPixInstructions(selectedOption.price) }}
        </p>
        <img
          class="img-fluid rounded mb-2 registration-form__image"
          :src="pixQrImage"
          alt="QR Code Pix"
        />
        <p class="fw-bold fs-5">{{ selectedOption.price }}</p>
        <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
          <button type="button" class="btn btn-outline-success" @click="onCopyPixCode">
            {{ copyButtonLabel }}
          </button>
          <button type="button" class="btn btn-success" @click="sendPaymentConfirmation">
            Já paguei!
          </button>
        </div>
      </div>
    </div>
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
