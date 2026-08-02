export const PIX_COPY_PASTE_CODE = import.meta.env.VITE_PIX_COPY_PASTE_CODE

export function buildPixInstructions(price: string): string {
  return `Para fazer a inscrição, você só precisa fazer um PIX no valor de ${price} para o nosso Diretor. Aqui está o QR Code e o código copia e cola para fazer o pix.`
}

export async function copyPixCodeToClipboard(): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(PIX_COPY_PASTE_CODE)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = PIX_COPY_PASTE_CODE
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
