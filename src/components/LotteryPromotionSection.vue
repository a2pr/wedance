<script setup lang="ts">
import {
  LOTTERY_BONUS_THRESHOLD,
  LOTTERY_TICKET_PRICE,
  LOTTERY_BONUS_REWARD,
} from '@/constants/lotteryTickets'
import { formatPriceBRL } from '@/constants/formOptions'
import {
  LOTTERY_DRAW_DATE,
  LOTTERY_DRAW_LABEL,
  LOTTERY_DRAW_MORE_INFO,
  LOTTERY_INSTAGRAM_HANDLE,
  LOTTERY_INSTAGRAM_URL,
  LOTTERY_TICKET_NUMBERS_NOTICE,
} from '@/constants/lotteryDraw'
import { LOTTERY_PROMOTION_HEADING } from '@/constants/lotteryUi'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'

const unitPriceDisplay = formatPriceBRL(LOTTERY_TICKET_PRICE)
const bundlePriceDisplay = formatPriceBRL(LOTTERY_TICKET_PRICE * LOTTERY_BONUS_THRESHOLD)
const bundleTotalTickets = LOTTERY_BONUS_THRESHOLD + LOTTERY_BONUS_REWARD
</script>

<template>
  <section class="py-5 px-3">
    <div class="container lottery-promotion">
      <h2 class="text-center mb-4">{{ LOTTERY_PROMOTION_HEADING }}</h2>

      <div class="row g-3 justify-content-center">
        <div class="col-12 col-md-6">
          <div class="card h-100 text-center p-4">
            <p class="fs-5 fw-semibold mb-1">Cada bilhete custa</p>
            <p class="display-6 fw-bold text-success mb-0">{{ unitPriceDisplay }}</p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 text-center p-4 border-success border-2">
            <p class="fs-5 fw-semibold mb-1">
              A cada {{ LOTTERY_BONUS_THRESHOLD }} bilhetes, você ganha
              {{ LOTTERY_BONUS_REWARD }} grátis
            </p>
            <p class="display-6 fw-bold text-success mb-1">
              {{ LOTTERY_BONUS_THRESHOLD }} → {{ bundleTotalTickets }}
            </p>
            <p class="text-muted small mb-0">Pagando apenas {{ bundlePriceDisplay }}</p>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <p class="fs-5 mb-1">
          <span class="fw-semibold">{{ LOTTERY_DRAW_LABEL }}:</span>
          {{ ' ' }}
          <span class="text-success fw-bold">{{ LOTTERY_DRAW_DATE }}</span>
        </p>
        <p class="mb-2">
          {{ LOTTERY_DRAW_MORE_INFO }}
          <a
            :href="LOTTERY_INSTAGRAM_URL"
            target="_blank"
            rel="noopener"
            class="lottery-promotion__instagram-link d-inline-flex align-items-center gap-1"
            :aria-label="`Instagram ${LOTTERY_INSTAGRAM_HANDLE}`"
          >
            <InstagramIcon />
            {{ LOTTERY_INSTAGRAM_HANDLE }}
          </a>
        </p>
        <p class="text-muted small mb-0 mx-auto lottery-promotion__notice">
          {{ LOTTERY_TICKET_NUMBERS_NOTICE }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lottery-promotion__instagram-link {
  color: var(--color-brand-green);
}

.lottery-promotion__notice {
  max-width: 480px;
}
</style>
