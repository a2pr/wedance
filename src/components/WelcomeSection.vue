<script setup lang="ts">
import welcomeHeroImage from '@/assets/images/welcome-hero.svg'
import { EVENT_DATE, EVENT_INSTAGRAM_HANDLE, EVENT_INSTAGRAM_URL } from '@/constants/event'
</script>

<template>
  <section class="vh-100 d-flex flex-column justify-content-center align-items-center text-center px-3">
    <img
      class="img-fluid mb-4 welcome-section__image"
      :src="welcomeHeroImage"
      alt="Wedance"
    />
    <h1 class="display-5 fw-bold">Bem-vindo(a) ao Wedance!</h1>
    <p class="lead">Estamos muito felizes em ter você com a gente hoje.</p>
    <p class="fw-semibold mb-1 welcome-section__date">{{ EVENT_DATE }}</p>
    <a
      :href="EVENT_INSTAGRAM_URL"
      target="_blank"
      rel="noopener"
      class="welcome-section__instagram-link"
    >
      @{{ EVENT_INSTAGRAM_HANDLE }}
    </a>
  </section>
</template>

<style scoped>
.welcome-section__image {
  max-width: 420px;
}

.welcome-section__date {
  font-size: clamp(1.25rem, 0.75rem + 2vw, 1.75rem);
}

.welcome-section__instagram-link {
  font-weight: bold;
}

.welcome-section__instagram-link:hover {
  font-weight: 900;
}
</style>
