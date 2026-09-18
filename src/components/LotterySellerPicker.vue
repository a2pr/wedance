<script setup lang="ts">
import { computed } from 'vue'
import { LOTTERY_SELLERS, OTHER_SELLER_ID } from '@/constants/lotterySellers'
import { LOTTERY_SELLER_HEADING } from '@/constants/lotteryUi'

const props = defineProps<{ sellerId: string; customName: string }>()
const emit = defineEmits<{
  'update:sellerId': [string]
  'update:customName': [string]
}>()

const isOtherSeller = computed(() => props.sellerId === OTHER_SELLER_ID)

function onSelectSeller(event: Event): void {
  emit('update:sellerId', (event.target as HTMLSelectElement).value)
}

function onCustomNameInput(event: Event): void {
  emit('update:customName', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <section class="py-5 px-3">
    <div class="container lottery-seller-picker">
      <h2 class="text-center mb-4">{{ LOTTERY_SELLER_HEADING }}</h2>

      <div class="mx-auto lottery-seller-picker__field">
        <label class="form-label" for="lottery-seller-select">Vendedor</label>
        <select
          id="lottery-seller-select"
          class="form-select"
          :value="sellerId"
          @change="onSelectSeller"
        >
          <option value="" disabled>Selecione o vendedor</option>
          <option v-for="seller in LOTTERY_SELLERS" :key="seller.id" :value="seller.id">
            {{ seller.name }}
          </option>
          <option :value="OTHER_SELLER_ID">Outro</option>
        </select>

        <div v-if="isOtherSeller" class="mt-3">
          <label class="form-label" for="lottery-seller-custom-name">Nome do vendedor</label>
          <input
            id="lottery-seller-custom-name"
            class="form-control"
            type="text"
            :value="customName"
            placeholder="Digite o nome do vendedor"
            @input="onCustomNameInput"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lottery-seller-picker__field {
  max-width: 420px;
}
</style>
