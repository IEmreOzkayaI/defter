import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { C } from '@/shared/constants/demo.constants';

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

function VideoShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full animate-landing-fade-up [animation-delay:120ms]">
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-[0_28px_90px_-20px_rgba(0,0,0,0.12)] ring-1 ring-stone-900/[0.04]"
        style={{ borderColor: C.border }}
      >
        {children}
      </div>
    </div>
  );
}

/** Tanıtım medyası — yerel mp4 varsayılan sessiz otomatik oynar. */
export function LandingHeroMedia() {
  const src = HERO_SRC;

  const yt = parseYoutubeId(src);
  if (yt) {
    return (
      <VideoShell>
        <div className="relative aspect-video bg-[#0a0a0a]">
          <iframe
            title="Vaha tanıtım videosu"
            loading="lazy"
            src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`}
            className="absolute inset-0 h-full w-full border-0"
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
        <div className="relative aspect-video bg-[#0a0a0a]">
          <iframe
            title="Vaha tanıtım videosu"
            loading="lazy"
            src={`https://player.vimeo.com/video/${vimeo}?badge=0`}
            className="absolute inset-0 h-full w-full border-0"
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
        <div className="relative aspect-video max-h-[min(72vh,760px)] min-h-[280px] overflow-hidden bg-[#151515]">
          <img
            src={mediaSrc}
            width={1280}
            height={720}
            alt="Hamam, sauna ve spa otomasyonu — kabin oturumu, hizmetler ve tahsilat (Vaha)"
            decoding="async"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
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
      className="block aspect-video max-h-[min(72vh,760px)] min-h-[260px] w-full bg-[#0a0a0a] object-cover"
    >
      <source src={src} />
      Tarayıcınız video oynatmayı desteklemiyor.
    </video>
  );
}
