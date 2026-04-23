import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { C } from '@/shared/constants/demo.constants';

type Props = {
  onClose: () => void;
};

export function LandingDemoPickerModal({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[9000] flex animate-landing-fade-in items-center justify-center overflow-y-auto bg-[#f7f6f2]/92 p-3 backdrop-blur-sm sm:p-4"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-landing-fade-up relative my-auto w-full max-w-md rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-2xl sm:p-8"
        style={{ maxHeight: 'min(92dvh, 720px)' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        >
          ×
        </button>
        <p className="mb-2 pr-10 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Demo seç</p>
        <h2 id="demo-picker-title" className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
          Hangi planı denemek istersiniz?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">Örnek verilerle dolu; 2–3 dakikada oturum → sepet → kapat akışını deneyin.</p>
        <p className="mt-2 text-xs text-stone-500">
          Akış: <strong className="font-semibold text-stone-700">Hamam / sauna / spa</strong> (sabit)
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/demo/onboarding/temel"
            className="group block rounded-xl border p-4 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            style={{ borderColor: C.border, background: C.bg }}
          >
            <p className="text-[15px] font-semibold text-stone-900">Temel</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">Oturum aç → sepete hizmet ekle → tahsilatla kapat → analiz. POS yok.</p>
          </Link>
          <Link
            to="/demo/onboarding/pos"
            className="group relative block rounded-xl border-2 border-stone-900 bg-white p-4 pt-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="absolute -top-px right-4 rounded-b-md bg-stone-900 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              + POS
            </span>
            <p className="text-[15px] font-semibold text-stone-900">Temel + POS</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">Temel akış + POS cihazı seç → ödeme gönderimi (demo simülasyonu).</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
