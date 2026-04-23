import { useEffect } from 'react';

import {
  SEO_BRAND_NAME,
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_KEYWORDS,
  SEO_DEFAULT_TITLE,
} from '@/shared/seo/site-config';

/** Ana sayfa yüklendiğinde başlık, açıklama ve canonical/og:url kökünü günceller. */
export function useLandingSeo(): void {
  useEffect(() => {
    document.title = SEO_DEFAULT_TITLE;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl instanceof HTMLMetaElement) {
      descEl.content = SEO_DEFAULT_DESCRIPTION;
    }

    const keywordsEl = document.querySelector('meta[name="keywords"]');
    if (keywordsEl instanceof HTMLMetaElement) {
      keywordsEl.content = SEO_DEFAULT_KEYWORDS;
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

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el instanceof HTMLMetaElement) el.content = content;
    };

    setMeta('meta[property="og:title"]', SEO_DEFAULT_TITLE);
    setMeta('meta[property="og:description"]', SEO_DEFAULT_DESCRIPTION);
    setMeta('meta[property="og:site_name"]', SEO_BRAND_NAME);

    setMeta('meta[name="twitter:title"]', SEO_DEFAULT_TITLE);
    setMeta('meta[name="twitter:description"]', SEO_DEFAULT_DESCRIPTION);
  }, []);
}
