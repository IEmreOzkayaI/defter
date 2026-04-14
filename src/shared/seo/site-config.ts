/** Varsayılan meta ve structured data metinleri — prod alanı: `VITE_SITE_URL` + `public/sitemap.xml` */
export const SEO_DEFAULT_TITLE = 'Defter | İşletme Otomasyonu ve POS';

/** ~155 karakter hedefi */
export const SEO_DEFAULT_DESCRIPTION =
  'Defter, işletmeler için işletme otomasyon aracı: hizmet ve siparişten tahsilata tek panel. Sektör şablonları, analitik; isteğe bağlı POS. Ücretsiz canlı demo.';

export function getPublicSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const fromEnv = import.meta.env.VITE_SITE_URL;
  return fromEnv?.replace(/\/$/, '') ?? '';
}
