<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import lotteryFlyerImage from '@/assets/images/hero-banner.jpeg'
import {
  LOTTERY_FLYER_ALT,
  LOTTERY_FLYER_CLOSE_LABEL,
  LOTTERY_FLYER_ZOOM_HINT,
} from '@/constants/lotteryUi'

const isZoomed = ref(false)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') isZoomed.value = false
}

watch(isZoomed, (zoomed) => {
  if (zoomed) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section class="py-4 px-3">
    <div class="container d-flex justify-content-center">
      <button
        type="button"
        class="lottery-hero__trigger"
        :aria-label="LOTTERY_FLYER_ZOOM_HINT"
        @click="isZoomed = true"
      >
        <img
          class="img-fluid rounded lottery-hero__flyer"
          :src="lotteryFlyerImage"
          :alt="LOTTERY_FLYER_ALT"
        />
        <span class="lottery-hero__zoom-hint" aria-hidden="true">🔍 {{ LOTTERY_FLYER_ZOOM_HINT }}</span>
      </button>
    </div>

    <template v-if="isZoomed">
      <div class="modal-backdrop show lottery-hero__backdrop" @click="isZoomed = false"></div>
      <div
        class="modal d-block lottery-hero__lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="LOTTERY_FLYER_ALT"
        @click="isZoomed = false"
      >
        <img
          class="lottery-hero__lightbox-image"
          :src="lotteryFlyerImage"
          :alt="LOTTERY_FLYER_ALT"
          @click.stop
        />
        <button
          type="button"
          class="btn-close btn-close-white lottery-hero__lightbox-close"
          :aria-label="LOTTERY_FLYER_CLOSE_LABEL"
          @click="isZoomed = false"
        ></button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.lottery-hero__flyer {
  display: block;
  width: 100%;
}

.lottery-hero__trigger {
  position: relative;
  display: inline-block;
  width: min(100%, 560px);
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
}

.lottery-hero__zoom-hint {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 999px;
}

.lottery-hero__backdrop,
.lottery-hero__lightbox {
  z-index: 1050;
}

.lottery-hero__lightbox {
  overflow: auto;
  padding: 1rem;
  text-align: center;
  cursor: zoom-out;
}

.lottery-hero__lightbox-image {
  display: inline-block;
  width: 1024px;
  max-width: none;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.75rem;
  cursor: default;
}

.lottery-hero__lightbox-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1051;
}
</style>
