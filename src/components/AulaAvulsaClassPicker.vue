<script setup lang="ts">
import { computed } from 'vue'
import { PICKABLE_SCHEDULE_PERIODS } from '@/constants/schedule'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const internalSelection = computed({
  get: () => props.modelValue,
  set: (value: string[]) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="row g-3">
    <div v-for="period in PICKABLE_SCHEDULE_PERIODS" :key="period.period" class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header text-center fw-semibold">{{ period.period }}</div>
        <ul class="list-group list-group-flush">
          <li v-for="item in period.items" :key="item.id" class="list-group-item">
            <label class="d-flex align-items-center gap-2 mb-0">
              <input
                class="form-check-input mt-0"
                type="checkbox"
                :value="item.id"
                v-model="internalSelection"
              />
              <span>{{ item.time }} – {{ item.activity }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
