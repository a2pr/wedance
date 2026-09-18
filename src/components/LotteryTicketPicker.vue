<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import {
  LOTTERY_BONUS_THRESHOLD,
  LOTTERY_MAX_TICKETS,
  LOTTERY_MIN_TICKETS,
  buildBonusCelebrationMessage,
  buildBonusNudgeMessage,
  clampTicketQuantity,
  evaluateLotteryTickets,
  pluralizeTickets,
} from '@/constants/lotteryTickets'
import { formatPriceBRL } from '@/constants/formOptions'
import { LOTTERY_TICKETS_HEADING } from '@/constants/lotteryUi'
import { ANALYTICS_EVENTS } from '@/constants/analyticsEvents'
import { trackEvent } from '@/utils/analytics'

const QUANTITY_EVENT_DEBOUNCE_MS = 500

const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const evaluation = computed(() => evaluateLotteryTickets(props.modelValue))
const totalPriceDisplay = computed(() => formatPriceBRL(evaluation.value.totalPriceValue))
const bonusCelebration = computed(() => buildBonusCelebrationMessage(evaluation.value))

let quantityEventTimeout: ReturnType<typeof setTimeout> | undefined
let lastNudgedQuantity = 0
let lastEarnedBonusCount = 0

function setQuantity(value: number): void {
  emit('update:modelValue', clampTicketQuantity(value))
}

function onStep(delta: number): void {
  setQuantity(props.modelValue + delta)
}

function onAcceptNudge(): void {
  trackEvent(ANALYTICS_EVENTS.ACCEPT_BONUS_NUDGE, { paid_tickets: evaluation.value.paidTickets })
  onStep(1)
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  setQuantity(Number(target.value))
}

watch(evaluation, (current) => {
  clearTimeout(quantityEventTimeout)
  quantityEventTimeout = setTimeout(() => {
    if (current.paidTickets === 0) return
    trackEvent(ANALYTICS_EVENTS.SELECT_TICKET_QUANTITY, {
      paid_tickets: current.paidTickets,
      bonus_tickets: current.bonusTickets,
      total_tickets: current.totalTickets,
      price: formatPriceBRL(current.totalPriceValue),
    })
  }, QUANTITY_EVENT_DEBOUNCE_MS)

  if (current.isOneAwayFromBonus && current.paidTickets !== lastNudgedQuantity) {
    lastNudgedQuantity = current.paidTickets
    trackEvent(ANALYTICS_EVENTS.VIEW_BONUS_NUDGE, { paid_tickets: current.paidTickets })
  }

  if (current.bonusTickets > lastEarnedBonusCount) {
    lastEarnedBonusCount = current.bonusTickets
    trackEvent(ANALYTICS_EVENTS.EARN_BONUS_TICKET, {
      bonus_tickets: current.bonusTickets,
      total_tickets: current.totalTickets,
    })
  }
  if (current.bonusTickets < lastEarnedBonusCount) {
    lastEarnedBonusCount = current.bonusTickets
  }
})

onBeforeUnmount(() => clearTimeout(quantityEventTimeout))
</script>

<template>
  <section class="py-5 px-3">
    <div class="container">
      <h2 class="text-center mb-4">{{ LOTTERY_TICKETS_HEADING }}</h2>

      <div class="row g-3 justify-content-center align-items-stretch">
        <div class="col-12 col-md-6">
          <div class="card h-100 text-center p-4 d-flex flex-column justify-content-center">
            <div class="d-flex align-items-center justify-content-center gap-3">
              <button
                type="button"
                class="btn btn-outline-success lottery-ticket-picker__step"
                :disabled="evaluation.paidTickets <= LOTTERY_MIN_TICKETS"
                aria-label="Remover um bilhete"
                @click="onStep(-1)"
              >
                −
              </button>

              <input
                class="form-control text-center fw-bold lottery-ticket-picker__input"
                type="number"
                inputmode="numeric"
                :min="LOTTERY_MIN_TICKETS"
                :max="LOTTERY_MAX_TICKETS"
                :value="evaluation.paidTickets"
                aria-label="Quantidade de bilhetes"
                @input="onInput"
              />

              <button
                type="button"
                class="btn btn-outline-success lottery-ticket-picker__step"
                :disabled="evaluation.hasReachedMax"
                aria-label="Adicionar um bilhete"
                @click="onStep(1)"
              >
                +
              </button>
            </div>

            <p v-if="evaluation.hasReachedMax" class="text-muted small mt-3 mb-0">
              Máximo de {{ LOTTERY_MAX_TICKETS }} bilhetes por pessoa.
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div
            class="card h-100 p-4"
            :class="{ 'border-success border-2': evaluation.bonusTickets > 0 }"
          >
            <p class="fs-4 fw-bold text-center mb-3">
              {{ evaluation.totalTickets }} {{ pluralizeTickets(evaluation.totalTickets) }}
            </p>

            <div class="d-flex justify-content-between">
              <span>Bilhetes pagos</span>
              <span class="fw-semibold">{{ evaluation.paidTickets }}</span>
            </div>

            <div
              v-if="evaluation.bonusTickets > 0"
              class="d-flex justify-content-between text-success"
            >
              <span>Bônus ({{ LOTTERY_BONUS_THRESHOLD }}+1)</span>
              <span class="fw-semibold">+{{ evaluation.bonusTickets }}</span>
            </div>

            <hr />

            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-semibold">Total a pagar</span>
              <span class="fs-4 fw-bold text-success">{{ totalPriceDisplay }}</span>
            </div>

            <p
              v-if="evaluation.bonusTickets > 0"
              class="text-success fw-semibold text-center mt-3 mb-0"
            >
              🎉 {{ bonusCelebration }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="evaluation.isOneAwayFromBonus" class="text-center mt-4">
        <div
          class="alert alert-success d-inline-flex flex-wrap align-items-center justify-content-center gap-2 mb-0"
        >
          <span class="fw-semibold">{{ buildBonusNudgeMessage() }}</span>
          <button type="button" class="btn btn-success btn-sm" @click="onAcceptNudge">
            Adicionar mais 1
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lottery-ticket-picker__step {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
}

.lottery-ticket-picker__input {
  max-width: 6rem;
  font-size: 1.5rem;
}
</style>
