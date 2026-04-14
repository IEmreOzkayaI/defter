import { useMemo } from 'react';

import { ONBOARD_STEPS } from '@/shared/constants/demo.constants';
import { FAQ_LANDING_ITEMS } from '@/shared/seo/faq-landing.data';
import { SEO_DEFAULT_DESCRIPTION, getPublicSiteOrigin } from '@/shared/seo/site-config';

export function LandingJsonLd() {
  const jsonLd = useMemo(() => {
    const origin = getPublicSiteOrigin();
    const url = origin ? `${origin}/` : '/';

    const org = {
      '@type': 'Organization',
      '@id': `${url}#organization`,
      name: 'Defter',
      url: origin || undefined,
      description: SEO_DEFAULT_DESCRIPTION,
    };

    const website = {
      '@type': 'WebSite',
      '@id': `${url}#website`,
      name: 'Defter',
      url,
      description: SEO_DEFAULT_DESCRIPTION,
      publisher: { '@id': `${url}#organization` },
      inLanguage: 'tr-TR',
    };

    const software = {
      '@type': 'SoftwareApplication',
      '@id': `${url}#software`,
      name: 'Defter',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Modern tarayıcı (Chrome, Safari, Firefox, Edge)',
      description: SEO_DEFAULT_DESCRIPTION,
      offers: {
        '@type': 'Offer',
        price: '10000',
        priceCurrency: 'TRY',
        description: 'Defter Temel — yıllık tek ödeme (örnek bilgi; güncel fiyat için iletişim).',
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
      name: 'Defter ile nasıl başlanır?',
      description:
        'Şablon seçimi, kategori ve hizmet kurulumu, POS tanımları, adisyon, tahsilat ve raporlarla işletmenizi ayağa kaldırma adımları.',
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
