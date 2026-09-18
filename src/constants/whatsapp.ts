export const WHATSAPP_PHONE_NUMBER = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER
export const WHATSAPP_MESSAGE_PREFIX = 'Ja paguei minha inscripçao'

export function buildPaymentMessage(suffix: string): string {
  return `${WHATSAPP_MESSAGE_PREFIX} ${suffix}!`
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_LOTTERY_MESSAGE_PREFIX = 'Já paguei minha rifa'

export function buildLotteryPaymentMessage(suffix: string, comprovanteLine: string): string {
  return `${WHATSAPP_LOTTERY_MESSAGE_PREFIX} — ${suffix}!\n${comprovanteLine}`
}
