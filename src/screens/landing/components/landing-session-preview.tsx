import { C, mono, ONBOARD_STEPS } from '@/shared/constants/demo.constants';
import { LANDING_SESSION_STATS } from '@/screens/landing/landing-content';

export function LandingSessionPreview() {
  return (
    <aside className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.12)] ring-1 ring-stone-900/[0.04] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-amber-100/80 via-stone-100/40 to-transparent blur-2xl"
      />
      <div>
        <p className="mb-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Vaha ile bir oturum</p>
        <div className="flex flex-col gap-4">
          {ONBOARD_STEPS.map((step, i) => (
            <div key={step.title} className="grid grid-cols-[36px_1fr] items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-stone-900"
                style={{ background: C.accentSoft, fontFamily: mono }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] font-semibold leading-snug text-stone-900">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 border-t border-stone-200/90 pt-5">
        <div className="flex flex-wrap justify-between gap-6">
          {LANDING_SESSION_STATS.map((s) => (
            <div key={s.l} className="min-w-[4.5rem] text-center">
              <div className="font-mono text-xl font-bold tracking-tight text-stone-900">{s.v}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-stone-400">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
