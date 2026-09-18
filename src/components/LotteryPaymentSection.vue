<script setup lang="ts">
import { ref } from 'vue'
import pixQrImage from '@/assets/images/pix-qr.png'
import { buildLotteryPixInstructions, copyPixCodeToClipboard } from '@/constants/pix'
import {
  WHATSAPP_PHONE_NUMBER,
  buildLotteryPaymentMessage,
  buildWhatsAppLink,
} from '@/constants/whatsapp'
import {
  COMPROVANTE_ALERT_MESSAGE,
  COMPROVANTE_ALERT_TITLE,
  COMPROVANTE_BUTTON_LABEL,
  COMPROVANTE_WHATSAPP_LINE,
} from '@/constants/lotteryComprovante'
import { LOTTERY_TICKET_NUMBERS_NOTICE } from '@/constants/lotteryDraw'
import { LOTTERY_FLOW_NAME, LOTTERY_PAYMENT_HEADING } from '@/constants/lotteryUi'
import {
  buildLotteryWhatsappSuffix,
  type LotteryTicketEvaluation,
} from '@/constants/lotteryTickets'
import { ANALYTICS_EVENTS } from '@/constants/analyticsEvents'
import { trackEvent } from '@/utils/analytics'

const COPY_BUTTON_DEFAULT_LABEL = 'Pix copia e cola!'
const COPY_BUTTON_COPIED_LABEL = 'Copiado!'
const COPY_BUTTON_RESET_DELAY_MS = 1500

const props = defineProps<{
  evaluation: LotteryTicketEvaluation
  priceDisplay: string
  sellerId: string
  sellerName: string
}>()

const copyButtonLabel = ref(COPY_BUTTON_DEFAULT_LABEL)

async function onCopyPixCode(): Promise<void> {
  await copyPixCodeToClipboard()
  trackEvent(ANALYTICS_EVENTS.COPY_PIX_CODE, {
    flow: LOTTERY_FLOW_NAME,
    price: props.priceDisplay,
  })
  copyButtonLabel.value = COPY_BUTTON_COPIED_LABEL
  setTimeout(() => {
    copyButtonLabel.value = COPY_BUTTON_DEFAULT_LABEL
  }, COPY_BUTTON_RESET_DELAY_MS)
}

function sendPaymentConfirmation(): void {
  trackEvent(ANALYTICS_EVENTS.PAYMENT_CONFIRMED, {
    flow: LOTTERY_FLOW_NAME,
    paid_tickets: props.evaluation.paidTickets,
    bonus_tickets: props.evaluation.bonusTickets,
    price: props.priceDisplay,
    seller_id: props.sellerId,
  })
  const suffix = buildLotteryWhatsappSuffix(props.evaluation, props.sellerName, props.priceDisplay)
  const message = buildLotteryPaymentMessage(suffix, COMPROVANTE_WHATSAPP_LINE)
  window.open(buildWhatsAppLink(WHATSAPP_PHONE_NUMBER, message), '_blank', 'noopener')
}
</script>

<template>
  <section class="py-5 px-3">
    <div class="container text-center">
      <h2 class="mb-4">{{ LOTTERY_PAYMENT_HEADING }}</h2>

      <p class="mx-auto lottery-payment__instructions">
        {{ buildLotteryPixInstructions(priceDisplay) }}
      </p>

      <p class="display-6 fw-bold text-success mb-3">{{ priceDisplay }}</p>

      <img
        class="img-fluid rounded mb-3 lottery-payment__image"
        :src="pixQrImage"
        alt="QR Code do PIX para pagamento da rifa"
      />

      <div class="alert alert-warning mx-auto text-start lottery-payment__alert" role="alert">
        <strong>⚠️ {{ COMPROVANTE_ALERT_TITLE }}:</strong>
        {{ COMPROVANTE_ALERT_MESSAGE }}
      </div>

      <p class="text-muted small mx-auto lottery-payment__instructions">
        {{ LOTTERY_TICKET_NUMBERS_NOTICE }}
      </p>

      <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
        <button type="button" class="btn btn-outline-success" @click="onCopyPixCode">
          {{ copyButtonLabel }}
        </button>
        <button type="button" class="btn btn-success" @click="sendPaymentConfirmation">
          {{ COMPROVANTE_BUTTON_LABEL }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lottery-payment__image {
  max-width: 260px;
}

.lottery-payment__instructions {
  max-width: 480px;
}

.lottery-payment__alert {
  max-width: 480px;
}
</style>
