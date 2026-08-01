export const WHATSAPP_PHONE_NUMBER = '5592984240045'
export const WHATSAPP_PAYMENT_MESSAGE = 'Ja paguei minha inscripçao!'

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
