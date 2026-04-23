import type { ReactNode } from 'react';

function VideoShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg">
        {children}
      </div>
    </div>
  );
}

export function ArcadeEmbed() {
  return (
    <div style={{ position: 'relative', paddingBottom: 'calc(50.982318271119844% + 41px)', height: '0', width: '100%' }}>
      <iframe
        src="https://demo.arcade.software/wz2YrQW7XDhKOZTIjbb1?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true"
        title="Spa POS ile müşteri işlemi oluşturma ve tahsilat tamamlama"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>
  )
}

/** Tanıtım medyası — mp4 yerine Arcade embed */
export function LandingHeroMedia() {
  return (
    <VideoShell>
      <ArcadeEmbed />
    </VideoShell>
  );
}
