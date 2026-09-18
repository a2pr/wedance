<script setup lang="ts">
import { LOTTERY_PRIZES, LOTTERY_PRIZES_MORE_COMING } from '@/constants/lotteryPrizes'
import { LOTTERY_PRIZES_HEADING } from '@/constants/lotteryUi'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
</script>

<template>
  <section class="py-5 px-3">
    <div class="container">
      <h2 class="text-center mb-4">{{ LOTTERY_PRIZES_HEADING }}</h2>

      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="prize in LOTTERY_PRIZES" :key="prize.id" class="col">
          <div class="card h-100 lottery-prizes__card">
            <div v-if="prize.image" class="lottery-prizes__media">
              <img
                class="lottery-prizes__image"
                :src="prize.image"
                :alt="`Prêmio: ${prize.name}`"
                loading="lazy"
              />
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

      <p class="text-center text-success fw-semibold mt-4 mb-0">
        {{ LOTTERY_PRIZES_MORE_COMING }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.lottery-prizes__card {
  overflow: hidden;
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
</style>
