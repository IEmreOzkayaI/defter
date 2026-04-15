type RuntimeConfig = {
  VITE_BACKEND_BASE_URL?: string;
};

declare global {
  interface Window {
    __DEFTER_RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const runtimeBaseUrl = window.__DEFTER_RUNTIME_CONFIG__?.VITE_BACKEND_BASE_URL?.trim();
const buildTimeBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL?.trim();

/**
 * Production'da mutlak URL olmalı. Şema yoksa tarayıcı göreli path sanar:
 * `defter-backend.../v1/...` → `https://frontend.up.railway.app/defter-backend.../v1/...` → nginx 405.
 */
function normalizeProductionBackendBase(raw: string): string {
  let base = raw.trim().replace(/\/+$/, '');
  if (!base) return '';

  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }

  if (typeof window !== 'undefined' && /\.railway\.internal\b/i.test(base)) {
    // eslint-disable-next-line no-console
    console.error(
      '[Defter] VITE_BACKEND_BASE_URL must be the API public HTTPS URL (…up.railway.app), not *.railway.internal — internal hostnames only work between Railway containers, not in the browser.',
    );
  }

  return base;
}

const rawBaseUrl = normalizeProductionBackendBase(runtimeBaseUrl || buildTimeBaseUrl || '');

export const BACKEND_BASE_URL = import.meta.env.DEV
  ? '/api'
  : rawBaseUrl.length > 0
    ? rawBaseUrl
    : '';
