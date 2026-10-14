<script setup lang="ts">
import { computed } from 'vue'
import type { UpcomingEvent } from '@/constants/eventsSchedule'

const props = defineProps<{ event: UpcomingEvent }>()

const isDone = computed(() => props.event.eventDone === true)
</script>

<template>
  <div :class="['card h-100 event-schedule-card', { 'opacity-50 text-muted': isDone }]">
    <div class="card-body d-flex flex-column gap-2">
      <span class="badge text-bg-success align-self-start">{{ event.dateLabel }}</span>
      <h3 class="h5 mb-0">{{ event.name }}</h3>
    </div>
  </div>
</template>
