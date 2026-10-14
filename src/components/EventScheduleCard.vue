<script setup lang="ts">
import type { UpcomingEvent } from '@/constants/eventsSchedule'

defineProps<{ event: UpcomingEvent }>()
</script>

<template>
  <div class="card h-100 event-schedule-card">
    <div class="card-body d-flex flex-column gap-2">
      <span class="badge text-bg-success align-self-start">{{ event.dateLabel }}</span>
      <h3 class="h5 mb-0">{{ event.name }}</h3>
    </div>
  </div>
</template>
