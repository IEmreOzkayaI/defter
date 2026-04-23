import { LandingOnboardingCarousel } from '@/screens/landing/components/landing-onboarding-carousel';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LandingSectionHeader } from '@/screens/landing/ui/landing-section-header';

export function HowItWorksSection() {
  return (
    <section
      id="nasil-baslanir"
      className="border-b border-stone-200/60 bg-gradient-to-b from-[#f7f6f2] via-white to-[#f7f6f2] py-16 sm:py-20 lg:py-24"
    >
      <LandingContainer>
        <LandingSectionHeader
          kicker="Nasıl çalışır"
          title={
            <>
              Kurulum sırası,
              <br />
              adım adım.
            </>
          }
          description="Modülleri ve tanıtımı gördükten sonra aşağıdaki adımlar, işletme kurulumundan gün sonu özetine kadar kısa yol haritası."
        />
        <LandingOnboardingCarousel />
      </LandingContainer>
    </section>
  );
}
