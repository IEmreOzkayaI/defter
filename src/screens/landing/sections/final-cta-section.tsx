import { LandingContainer } from '@/screens/landing/ui/landing-container';
import type { LandingContactIntent } from '@/screens/landing/types';

type Props = {
  onOpenContact: (intent: LandingContactIntent) => void;
  onOpenDemo: () => void;
};

export function FinalCtaSection({ onOpenContact, onOpenDemo }: Props) {
  return (
    <section
      id="cta"
      className="bg-gradient-to-b from-stone-200/25 via-[#f7f6f2] to-[#f7f6f2] py-20 text-center sm:py-24 lg:py-28"
    >
      <LandingContainer>
        <h2 className="mx-auto max-w-3xl text-balance text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold tracking-tight text-stone-900">
          Spa operasyonu sade kalsın.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-stone-600">
          Hamam / sauna / spa işletmenizi tek panelde toparlayın; Hemen Başla ile birkaç dakikada demoyu gezin.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onOpenDemo}
            className="w-full min-w-[200px] rounded-lg bg-stone-900 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-800 sm:w-auto"
          >
            Hemen Başla
          </button>
          <button
            type="button"
            onClick={() => onOpenContact('start')}
            className="w-full min-w-[200px] rounded-lg border border-stone-300/90 bg-white/90 px-10 py-4 text-base font-semibold text-stone-800 shadow-sm backdrop-blur-sm transition hover:border-stone-400 hover:bg-white sm:w-auto"
          >
            Hemen İletişime Geç
          </button>
          <button
            type="button"
            onClick={() => onOpenContact('walkthrough')}
            className="w-full min-w-[200px] rounded-lg border border-dashed border-stone-300/90 bg-stone-50/90 px-8 py-4 text-[15px] font-semibold text-stone-600 transition hover:bg-stone-100/90 sm:w-auto"
          >
            10 dk canlı anlatım
          </button>
        </div>
      </LandingContainer>
    </section>
  );
}
