import { LandingHeroMedia } from '@/screens/landing/landing-hero-media';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LandingSectionHeader } from '@/screens/landing/ui/landing-section-header';

export function VideoSection() {
  return (
    <section
      id="tanitim"
      className="border-b border-stone-200/60 bg-gradient-to-b from-[#f7f6f2] via-stone-100/35 to-[#f7f6f2] py-16 sm:py-20 lg:py-24"
    >
      <LandingContainer>
        <LandingSectionHeader
          kicker="Tanıtım"
          title={
            <>
              Ürünü kısa bir kayıtta
              <br />
              izleyin.
            </>
          }
          description="Arayüz ve akış — tek bakışta Vaha’nın hamam / sauna / spa otomasyonunda neyi çözdüğünü görün."
        />
        <LandingHeroMedia />
      </LandingContainer>
    </section>
  );
}
