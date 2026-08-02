<script setup lang="ts">
import welcomeHeroImage from '@/assets/images/welcome-hero.svg'
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
  </section>
</template>

<style scoped>
.welcome-section__image {
  max-width: 420px;
}
</style>
