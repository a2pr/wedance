<script setup lang="ts">
import WelcomeSection from '@/components/WelcomeSection.vue'
import ScheduleSection from '@/components/ScheduleSection.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
</script>

<template>
  <main class="day-view">
    <div class="day-view__section"><WelcomeSection /></div>
    <div class="day-view__section"><ScheduleSection /></div>
    <div class="day-view__section"><RegistrationForm /></div>
  </main>
</template>

<style scoped>
.day-view {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.day-view__section {
  scroll-snap-align: start;
}
</style>
