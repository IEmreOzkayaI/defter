import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { C, bd, mono } from '@/shared/constants/demo.constants';

/** Boşsa `public/video.mp4` — `.env`: `VITE_LANDING_HERO_VIDEO` */
const HERO_SRC = import.meta.env.VITE_LANDING_HERO_VIDEO?.trim() || '/video.mp4';

function isGifPath(src: string): boolean {
  return /\.gif(\?|#|$)/i.test(src);
}

function parseYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

function parseVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

function normalizeFileOrCdnSrc(src: string): string {
  const s = src.trim();
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;
  return `/${s}`;
}

/** Tanıtım medyası (landing “Tanıtım” bölümü) — tam genişlik kart */
function VideoShell({ children }: { children: ReactNode }) {
  return (
    <div className="fu4" style={{ width: '100%' }}>
      <div
        style={{
          borderRadius: 20,
          border: bd,
          background: C.card,
          overflow: 'hidden',
          boxShadow: '0 28px 90px rgba(0,0,0,.09), 0 4px 12px rgba(0,0,0,.05)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HeroMockFallback() {
  return (
    <VideoShell>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div
        style={{
          height: 40,
          borderBottom: bd,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#ffbd2e', '#28ca42'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ fontSize: 11, fontFamily: mono, color: C.light, marginLeft: 8 }}>defter — Hamam & SPA</span>
      </div>
      <div style={{ display: 'flex', height: 340 }}>
        <div style={{ width: '40%', borderRight: bd, padding: 10 }}>
          <div
            style={{ fontSize: 8, color: C.light, fontFamily: mono, letterSpacing: 1, marginBottom: 8 }}
          >
            AÇIK — 3
          </div>
          {['Kabine 1', 'Ahmet Bey', 'VIP Oda'].map((n, i) => (
            <div
              key={n}
              style={{
                padding: '8px 10px',
                marginBottom: 4,
                borderRadius: 6,
                background: i === 0 ? C.accentSoft : 'transparent',
                borderLeft: i === 0 ? `3px solid ${C.dark}` : '3px solid transparent',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: C.dark }}>{n}</div>
              <div style={{ fontSize: 9, color: C.light, fontFamily: mono }}>
                {['1.250 ₺', '680 ₺', '2.100 ₺'][i]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 10 }}>
          <div
            style={{ fontSize: 9, color: C.light, fontFamily: mono, letterSpacing: 1, marginBottom: 6 }}
          >
            SEPET — KABİNE 1
          </div>
          {[
            { n: 'Kese + Köpük', p: '420 ₺' },
            { n: 'Fin Saunası', p: '250 ₺' },
            { n: 'Aromatik Masaj', p: '520 ₺' },
            { n: 'Bitki Çayı ×2', p: '90 ₺' },
          ].map((item) => (
            <div
              key={item.n}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5px 0',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 10, color: C.dark }}>{item.n}</span>
              <span style={{ fontSize: 10, fontFamily: mono, fontWeight: 600, color: C.dark }}>
                {item.p}
              </span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              paddingTop: 8,
              borderTop: `1.5px solid ${C.dark}`,
            }}
          >
            <span style={{ fontSize: 10, color: C.light, fontFamily: mono }}>TOPLAM</span>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: mono, color: C.dark }}>
              1.280 ₺
            </span>
          </div>
        </div>
      </div>
      </div>
    </VideoShell>
  );
}

/** «Nasıl başlanır» önizlemesi — yerel mp4 varsayılan sessiz otomatik oynar; kullanıcı kontrollerden ses açabilir. */
export function LandingHeroMedia() {
  const src = HERO_SRC;

  if (src === 'mock') {
    return <HeroMockFallback />;
  }

  const yt = parseYoutubeId(src);
  if (yt) {
    return (
      <VideoShell>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#0a0a0a' }}>
          <iframe
            title="Defter tanıtım videosu"
            loading="lazy"
            src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </VideoShell>
    );
  }

  const vimeo = parseVimeoId(src);
  if (vimeo) {
    return (
      <VideoShell>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#0a0a0a' }}>
          <iframe
            title="Defter tanıtım videosu"
            loading="lazy"
            src={`https://player.vimeo.com/video/${vimeo}?badge=0`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </VideoShell>
    );
  }

  const mediaSrc = normalizeFileOrCdnSrc(src);

  if (isGifPath(mediaSrc)) {
    return (
      <VideoShell>
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: '#151515',
            aspectRatio: '16 / 9',
            maxHeight: 'min(72vh, 760px)',
            minHeight: 280,
            overflow: 'hidden',
          }}
        >
          <img
            src={mediaSrc}
            width={1280}
            height={720}
            alt="Farklı sektörlerde otomasyon ve sipariş yönetimi — Defter"
            decoding="async"
            loading="lazy"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        </div>
      </VideoShell>
    );
  }

  return (
    <VideoShell>
      <AutoplayMutedVideo src={mediaSrc} />
    </VideoShell>
  );
}

function AutoplayMutedVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    void el.play().catch(() => {
      /* bazı tarayıcılar kullanıcı etkileşimi isteyebilir */
    });
  }, [src]);

  return (
    <video
      ref={ref}
      controls
      playsInline
      muted
      autoPlay
      loop
      preload="auto"
      style={{
        width: '100%',
        display: 'block',
        aspectRatio: '16 / 9',
        maxHeight: 'min(72vh, 760px)',
        minHeight: 260,
        objectFit: 'cover',
        background: '#0a0a0a',
      }}
    >
      <source src={src} />
      Tarayıcınız video oynatmayı desteklemiyor.
    </video>
  );
}
