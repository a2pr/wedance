<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { LOTTERY_PRIZES, LOTTERY_PRIZES_MORE_COMING } from '@/constants/lotteryPrizes'
import {
  LOTTERY_PRIZES_HEADING,
  LOTTERY_PRIZES_NEXT_LABEL,
  LOTTERY_PRIZES_PAGE_LABEL,
  LOTTERY_PRIZES_PAGE_NAV_LABEL,
  LOTTERY_PRIZES_PREV_LABEL,
} from '@/constants/lotteryUi'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import NewPrizeMedalIcon from '@/components/icons/NewPrizeMedalIcon.vue'

const SCROLL_TOLERANCE_PX = 4

const sortedPrizes = computed(() =>
  [...LOTTERY_PRIZES].sort((a, b) => Number(b.newPrize ?? false) - Number(a.newPrize ?? false)),
)

const trackEl = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const pageCount = ref(1)
const activePage = ref(0)

function updateScrollState(): void {
  const el = trackEl.value
  if (!el || el.clientWidth === 0) return
  canScrollPrev.value = el.scrollLeft > SCROLL_TOLERANCE_PX
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - SCROLL_TOLERANCE_PX
  pageCount.value = Math.round(el.scrollWidth / el.clientWidth)
  activePage.value = Math.min(pageCount.value - 1, Math.round(el.scrollLeft / el.clientWidth))
}

function scrollByPage(direction: number): void {
  const el = trackEl.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
}

function scrollToPage(page: number): void {
  const el = trackEl.value
  if (!el) return
  el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('resize', updateScrollState)
})

onBeforeUnmount(() => window.removeEventListener('resize', updateScrollState))
</script>

<template>
  <section class="py-5 px-3">
    <div class="container">
      <h2 class="text-center mb-4">{{ LOTTERY_PRIZES_HEADING }}</h2>

      <div class="lottery-prizes__carousel">
        <button
          type="button"
          class="btn btn-outline-success lottery-prizes__arrow lottery-prizes__arrow--prev"
          :disabled="!canScrollPrev"
          :aria-label="LOTTERY_PRIZES_PREV_LABEL"
          @click="scrollByPage(-1)"
        >
          ‹
        </button>

        <div ref="trackEl" class="lottery-prizes__track" @scroll="updateScrollState">
          <div v-for="prize in sortedPrizes" :key="prize.id" class="lottery-prizes__slide">
            <div class="card h-100 lottery-prizes__card">
              <div
                v-if="prize.newPrize"
                class="lottery-prizes__badge"
                role="img"
                aria-label="Novo prêmio"
              >
                <NewPrizeMedalIcon />
              </div>
              <div v-if="prize.image" class="lottery-prizes__media">
                <img
                  class="lottery-prizes__image"
                  :src="prize.image"
                  :alt="`Prêmio: ${prize.name}`"
                  loading="lazy"
                />
              </div>
              <div v-else-if="prize.video" class="lottery-prizes__media">
                <video
                  class="lottery-prizes__image"
                  :src="prize.video"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="metadata"
                ></video>
              </div>
              <div v-else class="lottery-prizes__media lottery-prizes__media--empty">
                <span class="lottery-prizes__emoji" aria-hidden="true">🎁</span>
              </div>

              <div class="card-body text-center p-3">
                <p class="fw-semibold mb-1 lottery-prizes__name">{{ prize.name }}</p>
                <p v-if="prize.description" class="text-muted small mb-0">
                  {{ prize.description }}
                </p>
                <a
                  v-if="prize.instagramUrl"
                  :href="prize.instagramUrl"
                  target="_blank"
                  rel="noopener"
                  class="lottery-prizes__instagram-link d-inline-block mt-2"
                  :aria-label="`Instagram de ${prize.instagramName}`"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-outline-success lottery-prizes__arrow lottery-prizes__arrow--next"
          :disabled="!canScrollNext"
          :aria-label="LOTTERY_PRIZES_NEXT_LABEL"
          @click="scrollByPage(1)"
        >
          ›
        </button>
      </div>

      <div
        v-if="pageCount > 1"
        class="lottery-prizes__dots"
        role="tablist"
        :aria-label="LOTTERY_PRIZES_PAGE_NAV_LABEL"
      >
        <button
          v-for="page in pageCount"
          :key="page"
          type="button"
          class="lottery-prizes__dot"
          :class="{ 'lottery-prizes__dot--active': activePage === page - 1 }"
          role="tab"
          :aria-selected="activePage === page - 1"
          :aria-label="`${LOTTERY_PRIZES_PAGE_LABEL} ${page}`"
          @click="scrollToPage(page - 1)"
        ></button>
      </div>

      <p class="text-center text-success fw-semibold mt-4 mb-0">
        {{ LOTTERY_PRIZES_MORE_COMING }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.lottery-prizes__carousel {
  position: relative;
  --prizes-per-view: 2;
  --prizes-gap: 0.75rem;
}

@media (min-width: 768px) {
  .lottery-prizes__carousel {
    --prizes-per-view: 3;
  }
}

@media (min-width: 992px) {
  .lottery-prizes__carousel {
    --prizes-per-view: 4;
  }
}

.lottery-prizes__track {
  display: flex;
  gap: var(--prizes-gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding-bottom: 0.25rem;
}

.lottery-prizes__track::-webkit-scrollbar {
  display: none;
}

.lottery-prizes__slide {
  flex: 0 0 calc((100% - (var(--prizes-per-view) - 1) * var(--prizes-gap)) / var(--prizes-per-view));
  scroll-snap-align: start;
}

/* Abaixo de xl as setas colidem com os pontos de navegação: o carrossel é deslizado com o dedo. */
.lottery-prizes__arrow {
  display: none;
}

@media (min-width: 1200px) {
  .lottery-prizes__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    font-size: 1.5rem;
    line-height: 1;
    border-radius: 50%;
    background-color: var(--color-brand-black);
    opacity: 0.95;
  }
}

.lottery-prizes__arrow--prev {
  left: -0.75rem;
}

.lottery-prizes__arrow--next {
  right: -0.75rem;
}

.lottery-prizes__card {
  position: relative;
  overflow: hidden;
}

.lottery-prizes__badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 2;
}

.lottery-prizes__media {
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(
    circle at 50% 30%,
    var(--color-brand-green-soft),
    var(--color-brand-black-mute)
  );
}

.lottery-prizes__media--empty {
  background: var(--color-brand-black-mute);
}

.lottery-prizes__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.lottery-prizes__emoji {
  font-size: clamp(2rem, 8vw, 3rem);
}

.lottery-prizes__name {
  font-size: 0.95rem;
  line-height: 1.35;
}

.lottery-prizes__instagram-link {
  color: inherit;
}

.lottery-prizes__instagram-link:hover {
  color: var(--bs-link-hover-color);
}

.lottery-prizes__dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.lottery-prizes__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: var(--color-brand-black-mute);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.lottery-prizes__dot--active {
  background-color: var(--color-brand-green-soft);
  transform: scale(1.4);
}
</style>
