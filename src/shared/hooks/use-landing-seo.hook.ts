import { useEffect } from 'react';

import { SEO_DEFAULT_DESCRIPTION, SEO_DEFAULT_TITLE } from '@/shared/seo/site-config';

/** Ana sayfa yüklendiğinde başlık, açıklama ve canonical/og:url kökünü günceller. */
export function useLandingSeo(): void {
  useEffect(() => {
    document.title = SEO_DEFAULT_TITLE;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl instanceof HTMLMetaElement) {
      descEl.content = SEO_DEFAULT_DESCRIPTION;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!origin) return;

    const base = `${origin}/`;

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl instanceof HTMLLinkElement) {
      canonicalEl.href = base;
    }

    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl instanceof HTMLMetaElement) {
      ogUrlEl.content = base;
    }
  }, []);
}
