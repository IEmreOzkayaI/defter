type RuntimeConfig = {
  VITE_BACKEND_BASE_URL?: string;
};

declare global {
  interface Window {
    __DEFTER_RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

/**
 * `env-config.js` boş string yazdığında `"" || buildTime` yanlışlıkla build-time URL’e düşer → admin CORS.
 * Key runtime’da tanımlıysa (boş dahil) sadece o değeri kullan.
 */
function resolveBackendBaseRaw(): string {
  const cfg = typeof window !== 'undefined' ? window.__DEFTER_RUNTIME_CONFIG__ : undefined;
  const fromRuntime = cfg !== undefined && 'VITE_BACKEND_BASE_URL' in cfg;
  if (fromRuntime) {
    return String(cfg!.VITE_BACKEND_BASE_URL ?? '').trim();
  }
  return String(import.meta.env.VITE_BACKEND_BASE_URL ?? '').trim();
}

/**
 * Doğrudan API origin’i (CORS gerekir). Şema yoksa tarayıcı göreli path sanar → nginx 405.
 * Göreli path: `/api` gibi — nginx proxy ile aynı origin.
 */
function normalizeProductionBackendBase(raw: string): string {
  const base = raw.trim().replace(/\/+$/, '');
  if (!base) return '';

  if (base.startsWith('/') && !base.startsWith('//')) {
    return base;
  }

  let absolute = base;
  if (!/^https?:\/\//i.test(absolute)) {
    absolute = `https://${absolute}`;
  }

  if (typeof window !== 'undefined' && /\.railway\.internal\b/i.test(absolute)) {
    // eslint-disable-next-line no-console
    console.error(
      '[Defter] Tarayıcıdan *.railway.internal kullanılamaz. Boş bırakıp nginx /api proxy kullanın veya public https API URL verin.',
    );
  }

  return absolute;
}

const fromEnv = resolveBackendBaseRaw();
const normalizedProd = fromEnv ? normalizeProductionBackendBase(fromEnv) : '';

/** Dev: Vite proxy. Prod: boş → nginx /api proxy (CORS yok); dolu → doğrudan API. */
export const BACKEND_BASE_URL = import.meta.env.DEV ? '/api' : normalizedProd.length > 0 ? normalizedProd : '/api';
