<script setup lang="ts">
import { computed } from 'vue'
import { SCHEDULE_PERIODS } from '@/constants/schedule'
import ScheduleListItem from '@/components/ScheduleListItem.vue'
import scheduleSideLeft from '@/assets/images/schedule-side-left.png'
import scheduleSideRight from '@/assets/images/schedule-side-right.png'

const mainPeriods = computed(() => SCHEDULE_PERIODS.slice(0, -1))
const lastPeriod = computed(() => SCHEDULE_PERIODS.at(-1))
</script>

<template>
  <section class="min-vh-100 d-flex flex-column justify-content-center position-relative py-5 schedule-section">
    <img
      :src="scheduleSideLeft"
      alt=""
      class="schedule-section__side-image schedule-section__side-image--left d-none d-xl-block"
    />
    <img
      :src="scheduleSideRight"
      alt=""
      class="schedule-section__side-image schedule-section__side-image--right d-none d-xl-block"
    />

    <div class="container">
      <h2 class="text-center mb-4">Programação do dia</h2>

      <div class="row g-4">
        <div v-for="period in mainPeriods" :key="period.period" class="col-12 col-md-6">
          <div class="card h-100">
            <div class="card-header text-center fw-semibold">{{ period.period }}</div>
            <ul class="list-group list-group-flush">
              <ScheduleListItem v-for="item in period.items" :key="item.id" :item="item" />
            </ul>
          </div>
        </div>
      </div>

      <div v-if="lastPeriod" class="row g-4 mt-4">
        <div class="col-12 col-md-6 mx-auto">
          <div class="card">
            <div class="card-header text-center fw-semibold">{{ lastPeriod.period }}</div>
            <ul class="list-group list-group-flush">
              <ScheduleListItem v-for="item in lastPeriod.items" :key="item.id" :item="item" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  container-type: inline-size;
}

.schedule-section {
  --schedule-side-image-width: clamp(140px, 15vw, 260px);
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1200px) {
  .schedule-section {
    padding-left: calc(var(--schedule-side-image-width) + 1.5rem);
    padding-right: calc(var(--schedule-side-image-width) + 1.5rem);
  }
}

.schedule-section__side-image {
  position: absolute;
  top: 0;
  height: 100%;
  width: var(--schedule-side-image-width);
  object-fit: cover;
}

.schedule-section__side-image--left {
  left: 0;
}

.schedule-section__side-image--right {
  right: 0;
}
</style>
