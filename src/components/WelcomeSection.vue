<script setup lang="ts">
import welcomeFlyerImage from '@/assets/images/welcome-flyer.png'
import welcomeFlyerMobileImage from '@/assets/images/welcome-flyer-mobile.png'
</script>

<template>
  <section
    class="vh-100 welcome-section d-flex flex-column justify-content-center align-items-center text-center px-3"
  >
    <picture>
      <source media="(max-width: 767.98px)" :srcset="welcomeFlyerMobileImage" />
      <img
        class="img-fluid welcome-section__image"
        :src="welcomeFlyerImage"
        alt="Wedance — Dance Day, 23 de Agosto"
      />
    </picture>
  </section>
</template>

<style scoped>
.welcome-section {
  height: 100svh;
}

.welcome-section__image {
  max-width: min(90vw, 720px);
  max-height: 94vh;
  max-height: 92svh;
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.6);
}
</style>
