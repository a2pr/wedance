<script setup lang="ts">
import { SCHEDULE_ENTRIES } from '@/constants/schedule'
</script>

<template>
  <section class="schedule-section">
    <h2 class="schedule-section__title">Programação do dia</h2>
    <ul class="schedule-section__list">
      <li v-for="entry in SCHEDULE_ENTRIES" :key="entry.time" class="schedule-section__item">
        <span class="schedule-section__time">{{ entry.time }}</span>
        <span class="schedule-section__activity">{{ entry.activity }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.schedule-section {
  padding: 2rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.schedule-section__title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.schedule-section__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.schedule-section__item {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.schedule-section__time {
  font-weight: bold;
  min-width: 4rem;
}
</style>
