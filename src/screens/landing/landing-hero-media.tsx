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

/** «Nasıl başlanır» önizlemesi — yerel mp4 varsayılan sessiz otomatik oynar; kullanıcı kontrollerden ses açabilir. */
export function LandingHeroMedia() {
  const src = HERO_SRC;

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
