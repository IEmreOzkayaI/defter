import { LandingPricingCard } from '@/screens/landing/components/landing-pricing-card';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LandingSectionHeader } from '@/screens/landing/ui/landing-section-header';
import type { LandingContactIntent } from '@/screens/landing/types';

type Props = {
  onOpenContact: (intent: LandingContactIntent) => void;
};

export function PricingSection({ onOpenContact }: Props) {
  return (
    <section
      id="fiyatlandirma"
      className="border-b border-stone-200/60 bg-gradient-to-b from-[#f7f6f2] via-stone-100/30 to-[#f7f6f2] py-16 sm:py-20 lg:py-24"
    >
      <LandingContainer>
        <LandingSectionHeader
          kicker="Fiyatlandırma"
          title="Basit, şeffaf."
          description="Güncel paket ve fiyat bilgisini iletişimle paylaşıyoruz; önce Hemen Başla ile demoyu gezin, ardından teklif isteyin."
        />
        <div className="pricing-grid mx-auto max-w-4xl">
          <LandingPricingCard
            label="Temel"
            priceTitle="Fiyat için iletişim"
            priceSubtitle="Temel paket kapsamı ve güncel teklif için formu doldurun."
            desc="Çekirdek otomasyon: oturum, sepet, tahsilat ve raporlama. Lisanslama modeli teklifte netleşir."
            features={[
              'Sınırsız operasyon',
              'Hamam / sauna / spa akışı',
              'Hizmet ve kategori yönetimi',
              'Analitik ve raporlama',
              'Responsive web app',
            ]}
            onAction={() => onOpenContact('start')}
            actionLabel="Teklif iste"
          />
          <LandingPricingCard
            label="Temel + POS"
            priceTitle="Fiyat için iletişim"
            priceSubtitle="POS entegrasyonu dahil paket ve cihaz sayısına göre teklif hazırlanır."
            desc="Temel özelliklere ek olarak POS cihazları, gönderim ve ödeme takibi."
            features={[
              "Temel'deki her şey",
              'POS cihaz entegrasyonu',
              'Çoklu cihaz desteği',
              'Ödeme durumu takibi',
              'Cihaz yönetim paneli',
            ]}
            highlight
            onAction={() => onOpenContact('start')}
            actionLabel="Teklif iste"
          />
        </div>
      </LandingContainer>
    </section>
  );
}
