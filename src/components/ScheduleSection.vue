<script setup lang="ts">
import { SCHEDULE_PERIODS } from '@/constants/schedule'
</script>

<template>
  <section class="min-vh-100 d-flex flex-column justify-content-center py-5 px-3">
    <div class="container">
      <h2 class="text-center mb-4">Programação do dia</h2>
      <div class="row g-4">
        <div v-for="period in SCHEDULE_PERIODS" :key="period.period" class="col-12 col-md-4">
          <div class="card h-100">
            <div class="card-header text-center fw-semibold">{{ period.period }}</div>
            <ul class="list-group list-group-flush">
              <li
                v-for="item in period.items"
                :key="item.time"
                class="list-group-item d-flex justify-content-between gap-2"
              >
                <span class="fw-semibold">{{ item.time }}</span>
                <span class="text-end">{{ item.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
