import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LandingContactModal } from '@/screens/landing/components/landing-contact-modal';
import { LandingDemoPickerModal } from '@/screens/landing/components/landing-demo-picker-modal';
import { LandingFooter } from '@/screens/landing/components/landing-footer';
import { LandingHero } from '@/screens/landing/components/landing-hero';
import { LandingNav } from '@/screens/landing/components/landing-nav';
import { FaqSection } from '@/screens/landing/sections/faq-section';
import { FeaturesSection } from '@/screens/landing/sections/features-section';
import { FinalCtaSection } from '@/screens/landing/sections/final-cta-section';
import { HowItWorksSection } from '@/screens/landing/sections/how-it-works-section';
import { ModulesSection } from '@/screens/landing/sections/modules-section';
import { PricingSection } from '@/screens/landing/sections/pricing-section';
import { ProductFlowSection } from '@/screens/landing/sections/product-flow-section';
import { QuickAnswersSection } from '@/screens/landing/sections/quick-answers-section';
import { VideoSection } from '@/screens/landing/sections/video-section';
import type { LandingContactIntent } from '@/screens/landing/types';
import { useLandingSeo } from '@/shared/hooks/use-landing-seo.hook';
import { LandingJsonLd } from '@/shared/seo/landing-json-ld';

export type { LandingContactIntent } from '@/screens/landing/types';

export default function LandingScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [contactIntent, setContactIntent] = useState<LandingContactIntent>('start');
  const [showDemoPicker, setShowDemoPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const openContact = (intent: LandingContactIntent) => {
    setContactIntent(intent);
    setShowContact(true);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!showDemoPicker) return;
    void import('@/screens/demo/onboarding/demo-onboarding.screen');
  }, [showDemoPicker]);

  useEffect(() => {
    const st = location.state as { openContact?: boolean; contactIntent?: LandingContactIntent } | null;
    if (!st?.openContact) return;
    setContactIntent(st.contactIntent ?? 'from_demo');
    setShowContact(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  useLandingSeo();

  return (
    <div ref={ref} className="h-[100dvh] overflow-y-auto scroll-smooth bg-[#f7f6f2] font-sans text-stone-900 antialiased">
      <LandingJsonLd />

      {showContact ? <LandingContactModal onClose={() => setShowContact(false)} intent={contactIntent} /> : null}
      {showDemoPicker ? <LandingDemoPickerModal onClose={() => setShowDemoPicker(false)} /> : null}

      <LandingNav scrolled={scrollY > 40} onOpenDemo={() => setShowDemoPicker(true)} onOpenContact={() => openContact('start')} />

      <main id="main-content">
        <LandingHero onOpenContact={openContact} onOpenDemo={() => setShowDemoPicker(true)} />
        <ProductFlowSection />
        <ModulesSection />
        <VideoSection />
        <QuickAnswersSection onOpenContact={openContact} />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection onOpenContact={openContact} />
        <FaqSection />
        <FinalCtaSection onOpenContact={openContact} onOpenDemo={() => setShowDemoPicker(true)} />
      </main>

      <button
        type="button"
        onClick={() => openContact('start')}
        className="fixed bottom-5 right-5 z-[120] rounded-lg bg-stone-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-stone-900/25 transition hover:bg-stone-800 sm:bottom-6 sm:right-6"
      >
        Hemen İletişime Geç
      </button>

      <LandingFooter />
    </div>
  );
}
