import { LANDING_QUICK_QA } from '@/screens/landing/landing-content';
import { LandingContainer } from '@/screens/landing/ui/landing-container';
import type { LandingContactIntent } from '@/screens/landing/types';

type Props = {
  onOpenContact: (intent: LandingContactIntent) => void;
};

export function QuickAnswersSection({ onOpenContact }: Props) {
  return (
    <section id="hizli-sorular" className="bg-[#f7f6f2] py-12 sm:py-16">
      <LandingContainer className="max-w-4xl">
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Hızlı cevaplar</p>
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {LANDING_QUICK_QA.map(({ q, a }) => (
              <article
                key={q}
                className="rounded-xl border border-stone-100 bg-stone-50/80 p-4 transition hover:border-stone-200 hover:bg-white"
              >
                <h3 className="text-sm font-semibold text-stone-900">{q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-600">{a}</p>
              </article>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onOpenContact('walkthrough')}
            className="w-full rounded-xl bg-stone-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
          >
            Bana özel 10 dk canlı anlatım
          </button>
        </div>
      </LandingContainer>
    </section>
  );
}
