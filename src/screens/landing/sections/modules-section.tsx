import { LandingSpaModules } from '@/screens/landing/landing-spa-modules';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LandingSectionHeader } from '@/screens/landing/ui/landing-section-header';

export function ModulesSection() {
  return (
    <section id="moduller" className="border-b border-stone-200/60 bg-white py-16 sm:py-20 lg:py-24">
      <LandingContainer>
        <LandingSectionHeader
          kicker="Modüller"
          title={
            <>
              Hamam / sauna / spa
              <br />
              operasyonunun kalbi.
            </>
          }
        />
        <LandingSpaModules />
      </LandingContainer>
    </section>
  );
}
