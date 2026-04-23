import { LandingProductStory } from '@/screens/landing/landing-product-story';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LandingSectionHeader } from '@/screens/landing/ui/landing-section-header';

export function ProductFlowSection() {
  return (
    <section id="urun-akisi" className="border-b border-stone-200/60 bg-[#f7f6f2] py-16 sm:py-20 lg:py-24">
      <LandingContainer>
        <LandingSectionHeader
          kicker="Ürünün özü"
          title={
            <>
              Wellness işletmesine
              <br />
              göre kurgulanmış.
            </>
          }
          description='Tek akış: kabin/anahtar oturumu + hizmet kalemleri + süre + tahsilat. “Hamam spa otomasyon” ve “spa randevu yazılımı” arayanlar için de aynı sade dil — Hemen Başla, gerçek operasyonu hızlı anlatır.'
        />
        <LandingProductStory />
      </LandingContainer>
    </section>
  );
}
