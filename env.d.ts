/// <reference types="vite/client" />

/* vite-imagetools directive imports (e.g. `?w=460&format=webp`) resolve to a string URL at build time. */
declare module '*&format=webp' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_PIX_COPY_PASTE_CODE: string
  readonly VITE_WHATSAPP_PHONE_NUMBER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
