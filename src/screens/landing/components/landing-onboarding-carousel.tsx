import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { C, mono, ONBOARD_STEPS } from '@/shared/constants/demo.constants';

const PATH_VB = {
  desktop: { w: 900, h: 180 },
  mobile: { w: 360, h: 660 },
} as const;

export function LandingOnboardingCarousel() {
  const n = ONBOARD_STEPS.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobilePath, setIsMobilePath] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 720;
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewBox = isMobilePath ? PATH_VB.mobile : PATH_VB.desktop;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      setIsMobilePath(window.innerWidth < 720);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const nodePts = useMemo(() => {
    const { w, h } = viewBox;
    if (isMobilePath) {
      const centerX = w / 2;
      const padY = 56;
      const usableY = h - padY * 2;
      return ONBOARD_STEPS.map((_, i) => {
        const t = n <= 1 ? 0.5 : i / (n - 1);
        const y = padY + t * usableY;
        const x = centerX + 44 * Math.sin(t * Math.PI * 2 + 0.2) + (i % 2 === 0 ? -8 : 8);
        return { x, y };
      });
    }
    const padX = 44;
    const usableX = w - padX * 2;
    return ONBOARD_STEPS.map((_, i) => {
      const t = n <= 1 ? 0.5 : i / (n - 1);
      const x = padX + t * usableX;
      const y = h / 2 + 28 * Math.sin(t * Math.PI * 2.1 + 0.35) + (i % 3) * 2 - 2;
      return { x, y };
    });
  }, [isMobilePath, n, viewBox]);

  const pathD = useMemo(() => {
    if (nodePts.length === 0) return '';
    if (nodePts.length === 1) return `M ${nodePts[0].x} ${nodePts[0].y}`;
    let d = `M ${nodePts[0].x} ${nodePts[0].y}`;
    for (let i = 0; i < nodePts.length - 1; i++) {
      const p0 = nodePts[i];
      const p1 = nodePts[i + 1];
      const mx = (p0.x + p1.x) / 2 + (isMobilePath ? (i % 2 === 0 ? 14 : -14) : 0);
      const my = (p0.y + p1.y) / 2 + (isMobilePath ? 0 : i % 2 === 0 ? 10 : -10);
      d += ` Q ${mx} ${my} ${p1.x} ${p1.y}`;
    }
    return d;
  }, [isMobilePath, nodePts]);

  const schedule = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % n);
    }, 5000);
  }, [n]);

  useEffect(() => {
    schedule();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [schedule]);

  const goTo = (i: number) => {
    setActiveIdx(i);
    schedule();
  };

  const step = ONBOARD_STEPS[activeIdx];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
        <div className="flex justify-center">
          <svg
            viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
            role="img"
            aria-label="Kurulum adımları yol haritası"
            className="block h-auto w-full max-h-[520px] max-w-[380px] sm:max-h-[240px] sm:max-w-none"
          >
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.border} stopOpacity={0.45} />
                <stop offset="100%" stopColor={C.light} stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <path
              d={pathD}
              fill="none"
              stroke="url(#pathGrad)"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              pathLength={1}
              d={pathD}
              fill="none"
              stroke={C.dark}
              strokeWidth={1.35}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={1 - (activeIdx + 1) / n}
              style={{ transition: 'stroke-dashoffset 0.55s ease' }}
              vectorEffect="non-scaling-stroke"
              opacity={0.92}
            />
            {nodePts.map((pt, i) => {
              const on = i === activeIdx;
              const done = i < activeIdx;
              return (
                <g key={i}>
                  {on && (
                    <circle cx={pt.x} cy={pt.y} r={isMobilePath ? 32 : 30} fill={C.dark} opacity={0.08} style={{ transition: 'all .35s ease' }} />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={on ? (isMobilePath ? 16 : 15) : done ? (isMobilePath ? 12 : 11.5) : isMobilePath ? 11 : 10.5}
                    fill={on ? C.dark : C.card}
                    stroke={done || on ? C.dark : C.border}
                    strokeWidth={on ? (isMobilePath ? 3.1 : 3) : isMobilePath ? 2.2 : 2.1}
                    style={{ transition: 'all .35s ease', cursor: 'pointer' }}
                    onClick={() => goTo(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goTo(i);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Adım ${i + 1}: ${ONBOARD_STEPS[i].title}`}
                    aria-current={on ? 'step' : undefined}
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 5}
                    textAnchor="middle"
                    style={{
                      fontFamily: mono,
                      fontSize: on ? (isMobilePath ? 16 : 15) : isMobilePath ? 14 : 13,
                      fontWeight: 700,
                      fill: on ? '#fff' : C.dark2,
                      pointerEvents: 'none',
                    }}
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div aria-live="polite" className="mt-6 border-t border-stone-200/90 pt-6 animate-landing-fade-in">
          <div className="flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ring-1 ring-stone-200/60"
              style={{ background: step.color }}
              aria-hidden
            >
              {step.icon}
            </div>
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[11px] text-stone-400">
                Adım {activeIdx + 1} / {n}
              </p>
              <p className="text-lg font-semibold tracking-tight text-stone-900">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
