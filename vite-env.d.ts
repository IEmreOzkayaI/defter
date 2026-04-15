/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly VITE_SITE_URL?: string;
  readonly VITE_LANDING_HERO_VIDEO?: string;
  readonly VITE_BACKEND_BASE_URL?: string;
  readonly VITE_DEV_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
