<script setup lang="ts">
import { onMounted } from 'vue'
import wedanceLogo from '@/assets/images/wedance-logo.png'
import EventScheduleCard from '@/components/EventScheduleCard.vue'
import {
  EVENTS_SCHEDULE_BACK_LABEL,
  EVENTS_SCHEDULE_HEADING,
  EVENTS_SCHEDULE_INTRO,
  EVENTS_SCHEDULE_PAGE_TITLE,
  UPCOMING_EVENTS,
} from '@/constants/eventsSchedule'
import { ANALYTICS_EVENTS } from '@/constants/analyticsEvents'
import { trackEvent } from '@/utils/analytics'

onMounted(() => {
  document.title = EVENTS_SCHEDULE_PAGE_TITLE
  trackEvent(ANALYTICS_EVENTS.VIEW_EVENTS_SCHEDULE)
})
</script>

<template>
  <div class="events-schedule-view min-vh-100 d-flex flex-column">
    <main class="flex-grow-1 py-5 px-3">
      <div class="container">
        <div class="text-center pt-2 pb-4">
          <img
            class="img-fluid events-schedule-view__logo"
            :src="wedanceLogo"
            alt="Wedance"
          />
        </div>

        <h1 class="text-center mb-2">{{ EVENTS_SCHEDULE_HEADING }}</h1>
        <p class="text-center text-muted mb-4">{{ EVENTS_SCHEDULE_INTRO }}</p>

        <div class="row g-4">
          <div v-for="event in UPCOMING_EVENTS" :key="event.id" class="col-12 col-md-6 col-lg-4">
            <EventScheduleCard :event="event" />
          </div>
        </div>

        <div class="text-center mt-5">
          <router-link to="/" class="btn btn-outline-success">{{
            EVENTS_SCHEDULE_BACK_LABEL
          }}</router-link>
        </div>
      </div>
    </main>

    <footer class="mt-auto">
      <p class="text-center text-muted small py-4 mb-0">
        Site desenvolvido por
        <a
          href="https://andrespayema.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted"
        >
          Andres Payema
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.events-schedule-view__logo {
  width: min(60vw, 240px);
}
</style>
