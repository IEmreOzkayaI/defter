import { LandingContainer } from '@/screens/landing/ui/landing-container';
import { LANDING_HERO_BENEFITS, LANDING_HERO_PILLS } from '@/screens/landing/landing-content';
import { LandingSessionPreview } from '@/screens/landing/components/landing-session-preview';
import type { LandingContactIntent } from '@/screens/landing/types';

type Props = {
  onOpenContact: (intent: LandingContactIntent) => void;
  onOpenDemo: () => void;
};

export function LandingHero({ onOpenContact, onOpenDemo }: Props) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-stone-200/60 bg-gradient-to-b from-stone-200/25 via-[#f7f6f2] to-[#f7f6f2] pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300/60 to-transparent"
      />
      <LandingContainer>
        <div className="grid items-stretch gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-14 xl:gap-16">
          <div className="animate-landing-fade-up max-w-xl lg:max-w-none">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-stone-900" aria-hidden />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Hamam · Sauna · Spa</span>
            </div>
            <h1 className="text-balance text-[clamp(2rem,5vw,3.35rem)] font-bold leading-[1.06] tracking-tight text-stone-900">
              Hamam, sauna ve spa
              <br />
              <span className="text-stone-800">operasyonu tek panelde.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-stone-800 sm:text-[17px]">
              <strong className="font-semibold">Vaha</strong> ile kabin/anahtar oturumunu açın, hamam–sauna–masaj hizmetlerini ekleyin, süreyi takip edin ve
              tahsilatla kapatın. Aynı sade dil hem <strong className="font-semibold">hamam spa otomasyonu</strong> hem de{' '}
              <strong className="font-semibold">spa randevu yazılımı</strong> arayan işletmeler için uyumludur.
            </p>
            <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-stone-600">
              Wellness işletmelerinde “açık hesap / eksik kayıt” derdini azaltır; resepsiyon hızlanır, ekip sahada daha az hata yapar.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {LANDING_HERO_PILLS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200/90 bg-white/80 px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {LANDING_HERO_BENEFITS.map((row) => (
                <div
                  key={row.t}
                  className="rounded-xl border border-stone-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-stone-300/90 hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-stone-900">{row.t}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-600">{row.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-stone-900 px-8 text-[15px] font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-800 sm:w-auto"
              >
                Hemen başla
              </button>
              <button
                type="button"
                onClick={() => onOpenContact('start')}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-stone-300/90 bg-white/90 px-8 text-[15px] font-semibold text-stone-800 shadow-sm backdrop-blur-sm transition hover:border-stone-400 hover:bg-white sm:w-auto"
              >
                Hemen iletişime geç
              </button>
            </div>
            <button
              type="button"
              onClick={() => onOpenContact('walkthrough')}
              className="mt-2 w-full rounded-xl border border-dashed border-stone-300/90 bg-stone-50/80 py-3.5 text-sm font-semibold text-stone-600 transition hover:border-stone-400 hover:bg-stone-100/80 sm:mt-3 sm:w-auto sm:px-6"
            >
              Bana özel 10 dk canlı anlatım
            </button>
          </div>
          <div className="animate-landing-fade-up relative lg:pt-2 [animation-delay:80ms]">
            <LandingSessionPreview />
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
