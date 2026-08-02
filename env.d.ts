/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIX_COPY_PASTE_CODE: string
  readonly VITE_WHATSAPP_PHONE_NUMBER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
