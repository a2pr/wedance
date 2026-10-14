<script setup lang="ts">
import { onMounted } from 'vue'
import wedanceLogo from '@/assets/images/wedance-logo.png'

const HOME_PAGE_TITLE = 'Wedance'

onMounted(() => {
  document.title = HOME_PAGE_TITLE
})
</script>

<template>
  <div class="home-view min-vh-100 d-flex flex-column">
    <main
      class="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3"
    >
      <img class="img-fluid home-view__logo" :src="wedanceLogo" alt="Wedance" />
      <router-link to="/programacao" class="btn btn-success btn-lg mt-4"
        >Próximos eventos</router-link
      >
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
