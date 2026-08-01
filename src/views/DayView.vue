<script setup lang="ts">
import WelcomeSection from '@/components/WelcomeSection.vue'
import ScheduleSection from '@/components/ScheduleSection.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
</script>

<template>
  <main class="day-view">
    <WelcomeSection />
    <ScheduleSection />
    <RegistrationForm />
  </main>
</template>

<style scoped>
.day-view {
  display: flex;
  flex-direction: column;
}
</style>
