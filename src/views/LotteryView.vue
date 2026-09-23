<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LotteryHeroSection from '@/components/LotteryHeroSection.vue'
import LotteryPrizesSection from '@/components/LotteryPrizesSection.vue'
import LotteryPromotionSection from '@/components/LotteryPromotionSection.vue'
import LotteryTicketPicker from '@/components/LotteryTicketPicker.vue'
import LotterySellerPicker from '@/components/LotterySellerPicker.vue'
import LotteryPaymentSection from '@/components/LotteryPaymentSection.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import SectionScrollIndicator from '@/components/SectionScrollIndicator.vue'
import { evaluateLotteryTickets } from '@/constants/lotteryTickets'
import { formatPriceBRL } from '@/constants/formOptions'
import { OTHER_SELLER_ID, resolveSellerName } from '@/constants/lotterySellers'
import { parseLotteryPrefill } from '@/constants/lotteryQueryParams'
import {
  LOTTERY_FLOW_NAME,
  LOTTERY_IDLE_PROMPT_CANCEL,
  LOTTERY_IDLE_PROMPT_CONFIRM,
  LOTTERY_IDLE_PROMPT_DELAY_MS,
  LOTTERY_IDLE_PROMPT_MESSAGE,
  LOTTERY_IDLE_PROMPT_TITLE,
  LOTTERY_PAGE_TITLE,
  LOTTERY_SECTION_IDS,
  LOTTERY_NAV_GROUPS,
  LOTTERY_SECTION_NAV_LABEL,
} from '@/constants/lotteryUi'
import { ANALYTICS_EVENTS } from '@/constants/analyticsEvents'
import { trackEvent } from '@/utils/analytics'

/* Fires when a section reaches the middle band of the viewport, at any section height. */
const SECTION_VISIBILITY_ROOT_MARGIN = '-25% 0px -25% 0px'

const route = useRoute()
const prefill = parseLotteryPrefill(route.query)

const paidTickets = ref(prefill.paidTickets)
const selectedSellerId = ref(prefill.sellerId)
const customSellerName = ref('')

const sectionEls = ref<HTMLElement[]>([])
const showIdlePrompt = ref(false)
const activeSectionIndex = ref(0)

let observer: IntersectionObserver | null = null
let idleTimeout: ReturnType<typeof setTimeout> | undefined
let hasShownIdlePrompt = false

const viewedSectionIds = new Set<string>()
let activeSectionFrame = 0

const evaluation = computed(() => evaluateLotteryTickets(paidTickets.value))
const priceDisplay = computed(() => formatPriceBRL(evaluation.value.totalPriceValue))
const hasTickets = computed(() => evaluation.value.paidTickets > 0)

const resolvedSellerName = computed(() =>
  resolveSellerName(selectedSellerId.value, customSellerName.value),
)

const paymentContext = computed(() => {
  if (!hasTickets.value || !resolvedSellerName.value) return null
  return {
    evaluation: evaluation.value,
    priceDisplay: priceDisplay.value,
    sellerId: selectedSellerId.value,
    sellerName: resolvedSellerName.value,
  }
})

const sections = computed(() => [
  { id: LOTTERY_SECTION_IDS.HERO, visible: true },
  { id: LOTTERY_SECTION_IDS.PRIZES, visible: true },
  { id: LOTTERY_SECTION_IDS.PROMOTION, visible: true },
  { id: LOTTERY_SECTION_IDS.TICKETS, visible: true },
  { id: LOTTERY_SECTION_IDS.SELLER, visible: hasTickets.value },
  { id: LOTTERY_SECTION_IDS.PAYMENT, visible: paymentContext.value !== null },
])

const navGroups = LOTTERY_NAV_GROUPS.map((group) => ({ id: group.id, label: group.label }))

const activeNavIndex = computed(() => {
  const activeSectionId = sections.value[activeSectionIndex.value]?.id
  if (!activeSectionId) return 0
  const groupIndex = LOTTERY_NAV_GROUPS.findIndex((group) =>
    (group.sectionIds as readonly string[]).includes(activeSectionId),
  )
  return groupIndex === -1 ? 0 : groupIndex
})

function scrollToNavGroup(groupIndex: number): void {
  const targetSectionId = LOTTERY_NAV_GROUPS[groupIndex]?.sectionIds[0]
  if (!targetSectionId) return
  scrollToSection(sections.value.findIndex((section) => section.id === targetSectionId))
}

function updateActiveSection(): void {
  const viewportCenter = window.innerHeight / 2
  const index = sectionEls.value.findIndex((el) => {
    if (!el) return false
    const rect = el.getBoundingClientRect()
    return rect.top <= viewportCenter && rect.bottom >= viewportCenter
  })
  if (index !== -1) activeSectionIndex.value = index
}

function onScrollOrResize(): void {
  cancelAnimationFrame(activeSectionFrame)
  activeSectionFrame = requestAnimationFrame(updateActiveSection)
}

function setSectionRef(el: Element | null, index: number): void {
  if (el instanceof HTMLElement) {
    sectionEls.value[index] = el
    observer?.observe(el)
  }
}

function scrollToSection(index: number): void {
  sectionEls.value[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function clearIdleTimer(): void {
  clearTimeout(idleTimeout)
}

function startIdleTimer(): void {
  clearIdleTimer()
  if (hasShownIdlePrompt) return
  idleTimeout = setTimeout(() => {
    if (hasShownIdlePrompt || paidTickets.value > 0) return
    hasShownIdlePrompt = true
    showIdlePrompt.value = true
    trackEvent(ANALYTICS_EVENTS.VIEW_IDLE_PROMPT, {
      flow: LOTTERY_FLOW_NAME,
      idle_seconds: LOTTERY_IDLE_PROMPT_DELAY_MS / 1000,
    })
  }, LOTTERY_IDLE_PROMPT_DELAY_MS)
}

function onConfirmIdlePrompt(): void {
  trackEvent(ANALYTICS_EVENTS.CONFIRM_IDLE_PROMPT, { flow: LOTTERY_FLOW_NAME })
  showIdlePrompt.value = false
  scrollToSection(sections.value.findIndex((section) => section.id === LOTTERY_SECTION_IDS.TICKETS))
}

function onDismissIdlePrompt(): void {
  trackEvent(ANALYTICS_EVENTS.DISMISS_IDLE_PROMPT, { flow: LOTTERY_FLOW_NAME })
  showIdlePrompt.value = false
}

watch(paidTickets, () => {
  startIdleTimer()
})

watch(selectedSellerId, (value) => {
  startIdleTimer()
  if (value !== OTHER_SELLER_ID) customSellerName.value = ''
  if (!value) return
  trackEvent(ANALYTICS_EVENTS.SELECT_SELLER, {
    seller_id: value,
    is_custom_seller: value === OTHER_SELLER_ID,
  })
})

watch(paymentContext, (newContext, oldContext) => {
  const hasChanged = !oldContext || newContext?.priceDisplay !== oldContext.priceDisplay
  if (newContext && hasChanged) {
    trackEvent(ANALYTICS_EVENTS.VIEW_PAYMENT_INSTRUCTIONS, {
      flow: LOTTERY_FLOW_NAME,
      total_tickets: newContext.evaluation.totalTickets,
      price: newContext.priceDisplay,
    })
  }
})

function trackPrefill(): void {
  if (!prefill.hasSellerPrefill && !prefill.hasTicketPrefill) return
  trackEvent(ANALYTICS_EVENTS.LOTTERY_PREFILL_APPLIED, {
    flow: LOTTERY_FLOW_NAME,
    seller_id: prefill.sellerId,
    paid_tickets: prefill.paidTickets,
    has_seller_prefill: prefill.hasSellerPrefill,
    has_ticket_prefill: prefill.hasTicketPrefill,
  })
}

function trackInitialPaymentInstructions(): void {
  if (!paymentContext.value) return
  trackEvent(ANALYTICS_EVENTS.VIEW_PAYMENT_INSTRUCTIONS, {
    flow: LOTTERY_FLOW_NAME,
    total_tickets: paymentContext.value.evaluation.totalTickets,
    price: paymentContext.value.priceDisplay,
  })
}

onMounted(() => {
  document.title = LOTTERY_PAGE_TITLE

  trackPrefill()
  trackInitialPaymentInstructions()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = sectionEls.value.indexOf(entry.target as HTMLElement)
        const sectionId = sections.value[index]?.id
        if (sectionId && !viewedSectionIds.has(sectionId)) {
          viewedSectionIds.add(sectionId)
          trackEvent(ANALYTICS_EVENTS.VIEW_SECTION, { section_id: sectionId })
        }
      }
    },
    { rootMargin: SECTION_VISIBILITY_ROOT_MARGIN, threshold: 0 },
  )

  for (const el of sectionEls.value) {
    observer.observe(el)
  }

  updateActiveSection()
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize)

  startIdleTimer()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(activeSectionFrame)
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
  observer?.disconnect()
  clearIdleTimer()
})
</script>

<template>
  <main class="lottery-view">
    <div :ref="(el) => setSectionRef(el as Element | null, 0)">
      <LotteryHeroSection />
    </div>

    <div :ref="(el) => setSectionRef(el as Element | null, 1)">
      <LotteryPrizesSection />
    </div>

    <div :ref="(el) => setSectionRef(el as Element | null, 2)">
      <LotteryPromotionSection />
    </div>

    <div :ref="(el) => setSectionRef(el as Element | null, 3)">
      <LotteryTicketPicker v-model="paidTickets" />
    </div>

    <div v-if="hasTickets" :ref="(el) => setSectionRef(el as Element | null, 4)">
      <LotterySellerPicker
        :seller-id="selectedSellerId"
        :custom-name="customSellerName"
        @update:seller-id="selectedSellerId = $event"
        @update:custom-name="customSellerName = $event"
      />
    </div>

    <div v-if="paymentContext" :ref="(el) => setSectionRef(el as Element | null, 5)">
      <LotteryPaymentSection
        :evaluation="paymentContext.evaluation"
        :price-display="paymentContext.priceDisplay"
        :seller-id="paymentContext.sellerId"
        :seller-name="paymentContext.sellerName"
      />
    </div>

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

    <SectionScrollIndicator
      :sections="navGroups"
      :active-index="activeNavIndex"
      :nav-label="LOTTERY_SECTION_NAV_LABEL"
      @navigate="scrollToNavGroup"
    />

    <ConfirmModal
      :show="showIdlePrompt"
      :title="LOTTERY_IDLE_PROMPT_TITLE"
      :message="LOTTERY_IDLE_PROMPT_MESSAGE"
      :confirm-label="LOTTERY_IDLE_PROMPT_CONFIRM"
      :cancel-label="LOTTERY_IDLE_PROMPT_CANCEL"
      @confirm="onConfirmIdlePrompt"
      @cancel="onDismissIdlePrompt"
    />
  </main>
</template>

<style scoped>
.lottery-view {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
</style>
