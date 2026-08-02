<script setup lang="ts">
import { computed, ref } from 'vue'
import { FORM_OPTIONS } from '@/constants/formOptions'
import { WHATSAPP_PHONE_NUMBER, buildPaymentMessage, buildWhatsAppLink } from '@/constants/whatsapp'

const selectedOptionId = ref<string>('')

const selectedOption = computed(() =>
  FORM_OPTIONS.find((option) => option.id === selectedOptionId.value),
)

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
        <img
          class="img-fluid rounded mb-3 registration-form__image"
          :src="selectedOption.image"
          :alt="selectedOption.label"
        />
        <div>
          <button type="button" class="btn btn-success btn-lg" @click="sendPaymentConfirmation">
            Já paguei!
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.registration-form__image {
  max-width: 320px;
}
</style>
