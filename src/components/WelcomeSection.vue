<script setup lang="ts">
import welcomeHeroImage from '@/assets/images/welcome-hero.svg'
</script>

<template>
  <section class="welcome-section">
    <img class="welcome-section__image" :src="welcomeHeroImage" alt="Wedance" />
    <h1 class="welcome-section__title">Bem-vindo(a) ao Wedance!</h1>
    <p class="welcome-section__subtitle">Estamos muito felizes em ter você com a gente hoje.</p>
  </section>
</template>

<style scoped>
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 2rem 1rem;
}

.welcome-section__image {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 0.5rem;
}

.welcome-section__title {
  font-size: 2rem;
  margin: 0;
}

.welcome-section__subtitle {
  font-size: 1.1rem;
  color: var(--color-text);
  margin: 0;
}
</style>
