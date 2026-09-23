<script setup lang="ts">
import wedanceLogo from '@/assets/images/wedance-logo.png'
</script>

<template>
  <div class="home-view min-vh-100 d-flex flex-column">
    <main
      class="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3"
    >
      <img class="img-fluid home-view__logo" :src="wedanceLogo" alt="Wedance" />
      <p class="fs-4 mt-4 mb-0">Próximos eventos em breve</p>
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
.home-view {
  height: 100svh;
}

.home-view__logo {
  width: min(80vw, 380px);
}
</style>
