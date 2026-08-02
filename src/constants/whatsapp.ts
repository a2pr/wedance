export const WHATSAPP_PHONE_NUMBER = '5592984240045'
export const WHATSAPP_MESSAGE_PREFIX = 'Ja paguei minha inscripçao'

export function buildPaymentMessage(suffix: string): string {
  return `${WHATSAPP_MESSAGE_PREFIX} ${suffix}!`
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
