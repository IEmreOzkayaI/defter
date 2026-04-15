/** Varsayılan meta ve structured data metinleri — prod alanı: `VITE_SITE_URL` + `public/sitemap.xml` */
export const SEO_DEFAULT_TITLE = 'Defter | Kağıt adisyonun dijital karşılığı';

/** ~155 karakter hedefi */
export const SEO_DEFAULT_DESCRIPTION =
  'Kağıt fiş ve adisyon kullanan işletmeler için: işlem aç, kalemleri yaz, açık hesabı takip et, kapat. Kafe, PS/internet cafe, hamam, bilardo şablonları; canlı demo.';

export function getPublicSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const fromEnv = import.meta.env.VITE_SITE_URL;
  return fromEnv?.replace(/\/$/, '') ?? '';
}
