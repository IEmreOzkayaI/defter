/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly VITE_SITE_URL?: string;
  readonly VITE_LANDING_HERO_VIDEO?: string;
  readonly VITE_ADMIN_USERNAME?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  /** Geçici: 1 / true — dolu herhangi kullanıcı adı + şifre ile admin girişi (yalnız dev/demo). */
  readonly VITE_ADMIN_LOGIN_MOCK?: string;
  /** Geçici: 1 / true — admin tablosuna örnek talep satırları ekler (prod’da kapalı). */
  readonly VITE_ADMIN_MOCK_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
