import { LANDING_FEATURES } from '@/screens/landing/landing-content';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LandingSectionHeader } from '@/screens/landing/ui/landing-section-header';

export function FeaturesSection() {
  return (
    <section id="ozellikler" className="border-b border-stone-200/60 bg-white py-16 sm:py-20 lg:py-24">
      <LandingContainer>
        <LandingSectionHeader
          kicker="Özellikler"
          title="Her şey tek panelde."
          description="Demodaki ekranlar çekirdek operasyonu gösterir; POS ve derin entegrasyonlar ayrı paket olarak ilerler."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-stone-200/80 bg-[#fafaf9] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white hover:shadow-lg hover:shadow-stone-900/[0.06]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-stone-200/60 transition group-hover:ring-stone-300/80">
                {f.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-stone-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
