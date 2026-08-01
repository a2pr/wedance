<script setup lang="ts">
import { computed, ref } from 'vue'
import { FORM_OPTIONS } from '@/constants/formOptions'
import { WHATSAPP_PHONE_NUMBER, WHATSAPP_PAYMENT_MESSAGE, buildWhatsAppLink } from '@/constants/whatsapp'

const selectedOptionId = ref<string>('')

const selectedOption = computed(() =>
  FORM_OPTIONS.find((option) => option.id === selectedOptionId.value),
)

function sendPaymentConfirmation(): void {
  const link = buildWhatsAppLink(WHATSAPP_PHONE_NUMBER, WHATSAPP_PAYMENT_MESSAGE)
  window.open(link, '_blank', 'noopener')
}
</script>

<template>
  <section class="registration-form">
    <h2 class="registration-form__title">Inscrição</h2>

    <div class="registration-form__options">
      <label
        v-for="option in FORM_OPTIONS"
        :key="option.id"
        class="registration-form__option"
      >
        <input
          type="radio"
          name="registration-option"
          :value="option.id"
          v-model="selectedOptionId"
        />
        {{ option.label }}
      </label>
    </div>

    <div v-if="selectedOption" class="registration-form__result">
      <img
        class="registration-form__image"
        :src="selectedOption.image"
        :alt="selectedOption.label"
      />
      <button type="button" class="registration-form__pay-button" @click="sendPaymentConfirmation">
        Já paguei!
      </button>
    </div>
  </section>
</template>

<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.registration-form__title {
  font-size: 1.5rem;
  margin: 0;
}

.registration-form__options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.registration-form__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.registration-form__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.registration-form__image {
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 0.5rem;
}

.registration-form__pay-button {
  background-color: #25d366;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.registration-form__pay-button:hover {
  opacity: 0.9;
}
</style>
