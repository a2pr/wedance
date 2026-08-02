/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIX_COPY_PASTE_CODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
