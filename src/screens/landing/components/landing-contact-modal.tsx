import { useEffect, useState } from 'react';

import { createWaitlistLead } from '@/shared/api/waitlist.api';
import { C, sans } from '@/shared/constants/demo.constants';
import type { LandingContactIntent } from '@/screens/landing/types';

type Props = {
  onClose: () => void;
  intent: LandingContactIntent;
};

export function LandingContactModal({ onClose, intent }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const ok = Boolean(name.trim() && phone.trim());
  const isWalkthrough = intent === 'walkthrough';
  const isFromDemo = intent === 'from_demo';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const noteForIntent =
    isWalkthrough ? 'Talep tipi: 10 dk canlı anlatım' : isFromDemo ? 'Talep tipi: Dene sonrası iletişim' : 'Talep tipi: Hemen iletişime geç';

  return (
    <div
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClose();
      }}
      className="fixed inset-0 z-[9000] flex animate-landing-fade-in items-center justify-center bg-[#f7f6f2]/92 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="animate-landing-fade-up relative w-full max-w-md rounded-2xl border-2 border-stone-900 bg-white p-8 shadow-2xl shadow-stone-900/10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 rounded-lg p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        >
          ×
        </button>
        {!sent ? (
          <>
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">İletişim</p>
            <h2 id="contact-modal-title" className="text-2xl font-bold tracking-tight text-stone-900">
              {isWalkthrough ? '10 dk canlı anlatım' : isFromDemo ? 'Dene nasıldı?' : 'Hemen iletişime geçin'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {isWalkthrough
                ? 'Ekibinize özel kısa bir canlı tur planlayalım.'
                : isFromDemo
                  ? 'Denemeyi kapattınız. Pilot veya fiyat için formu doldurun; kısa sürede size döneriz.'
                  : 'Bilgilerinizi bırakın, 24 saat içinde size ulaşalım.'}
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Ad soyad *
                </label>
                <input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none ring-stone-900/10 transition focus:ring-2"
                  style={{ borderColor: C.border, fontFamily: sans, background: C.bg }}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Telefon *
                </label>
                <input
                  id="contact-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0532 123 45 67"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none ring-stone-900/10 transition focus:ring-2"
                  style={{ borderColor: C.border, fontFamily: sans, background: C.bg }}
                />
              </div>
            </div>
            <button
              type="button"
              disabled={!ok || sending}
              onClick={() => {
                if (!ok || sending) return;
                setSending(true);
                void createWaitlistLead({
                  full_name: name.trim(),
                  phone_number: phone.trim(),
                  status: 'new',
                  note: noteForIntent,
                })
                  .then(() => setSent(true))
                  .finally(() => setSending(false));
              }}
              className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: ok ? C.dark : C.border, color: ok ? '#fff' : C.light }}
            >
              {sending ? 'Gönderiliyor…' : isWalkthrough ? 'Anlatım talep et' : 'Gönder'}
            </button>
          </>
        ) : (
          <div className="animate-landing-fade-up py-6 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
              style={{ background: C.greenSoft, color: C.green }}
            >
              ✓
            </div>
            <p className="text-xl font-bold text-stone-900">Talebiniz alındı</p>
            <p className="mt-2 text-sm text-stone-600">
              24 saat içinde tarafınıza
              <br />
              ulaşılacaktır.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-xl border px-8 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              style={{ borderColor: C.border }}
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
