import { useMemo } from 'react';

import { ONBOARD_STEPS } from '@/shared/constants/demo.constants';
import { FAQ_LANDING_ITEMS } from '@/shared/seo/faq-landing.data';
import { SEO_BRAND_NAME, SEO_DEFAULT_DESCRIPTION, getPublicSiteOrigin } from '@/shared/seo/site-config';

export function LandingJsonLd() {
  const jsonLd = useMemo(() => {
    const origin = getPublicSiteOrigin();
    const url = origin ? `${origin}/` : '/';

    const org = {
      '@type': 'Organization',
      '@id': `${url}#organization`,
      name: SEO_BRAND_NAME,
      url: origin || undefined,
      description: SEO_DEFAULT_DESCRIPTION,
    };

    const website = {
      '@type': 'WebSite',
      '@id': `${url}#website`,
      name: SEO_BRAND_NAME,
      url,
      description: SEO_DEFAULT_DESCRIPTION,
      publisher: { '@id': `${url}#organization` },
      inLanguage: 'tr-TR',
    };

    const software = {
      '@type': 'SoftwareApplication',
      '@id': `${url}#software`,
      name: SEO_BRAND_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Modern tarayıcı (Chrome, Safari, Firefox, Edge)',
      description: SEO_DEFAULT_DESCRIPTION,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'TRY',
        availability: 'https://schema.org/OnlineOnly',
        description: 'Temel ve Temel + POS paketleri; güncel fiyat ve teklif için iletişime geçin.',
      },
      publisher: { '@id': `${url}#organization` },
    };

    const faq = {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: FAQ_LANDING_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    const howTo = {
      '@type': 'HowTo',
      '@id': `${url}#howto`,
      name: 'Vaha ile hamam / sauna / spa otomasyonuna nasıl başlanır?',
      description:
        'İşletme bilgisi, hizmet kataloğu, kabin/anahtar oturumu, süre takibi, tahsilat/POS ve günlük rapor adımları (Dene turu ile aynı akış).',
      step: ONBOARD_STEPS.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.desc,
      })),
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [org, website, software, faq, howTo],
    };
  }, []);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
