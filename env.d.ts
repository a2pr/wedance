/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIX_COPY_PASTE_CODE: string
  readonly VITE_WHATSAPP_PHONE_NUMBER: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
