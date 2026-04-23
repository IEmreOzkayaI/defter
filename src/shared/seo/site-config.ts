/** Marka adı — UI + JSON-LD Organization/WebSite/SoftwareApplication */
export const SEO_BRAND_NAME = 'Vaha';

/**
 * Prod kanonik alan (yer tutucu).
 * Not: `useLandingSeo` canonical/og:url için `window.location.origin` kullanır; burası önizleme/JSON-LD fallback içindir.
 */
export const SEO_PUBLIC_SITE_ORIGIN_FALLBACK = 'https://vaha.app';

/** Varsayılan meta ve structured data metinleri — prod alanı: `VITE_SITE_URL` + `public/sitemap.xml` */
export const SEO_DEFAULT_TITLE =
  'Vaha | Hamam, sauna ve spa otomasyonu + rezervasyon yazılımı (Türkiye)';

/** ~155 karakter hedefi */
export const SEO_DEFAULT_DESCRIPTION =
  'Hamam, sauna ve spa işletmeleri için otomasyon: kabin/anahtar oturumu, hizmet kalemleri, süre takibi, tahsilat ve POS. Randevu arayanlar için de spa randevu yazılımı anahtar kelimeleriyle uyumlu, sade panel — web üzerinde Dene.';

/** Anahtar kelimeler (meta keywords + icerik tutarliligi icin tek kaynak) */
export const SEO_DEFAULT_KEYWORDS =
  'hamam spa otomasyon, hamam yazılımı, sauna yazılımı, spa yönetim programı, spa randevu yazılımı, hamam rezervasyon, sauna rezervasyon, spa randevu sistemi, hamam işletme programı, spa otomasyon programı, wellness yazılımı, hamam kasa programı, spa müşteri takibi, spa raporlama';

export function getPublicSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const fromEnv = import.meta.env.VITE_SITE_URL;
  return fromEnv?.replace(/\/$/, '') ?? SEO_PUBLIC_SITE_ORIGIN_FALLBACK.replace(/\/$/, '');
}
