import { LandingContainer } from '@/screens/landing/ui/landing-container';

const links = [
  { href: '#urun-akisi', label: 'Ürün akışı' },
  { href: '#moduller', label: 'Modüller' },
  { href: '#tanitim', label: 'Tanıtım' },
  { href: '#nasil-baslanir', label: 'Nasıl çalışır' },
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#fiyatlandirma', label: 'Fiyat' },
  { href: '#sss', label: 'SSS' },
  { href: '/sitemap.xml', label: 'Sitemap' },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-stone-200/80 bg-white py-10">
      <LandingContainer>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold tracking-tight text-stone-900">vaha.</span>
            <span className="text-xs text-stone-400">© 2026</span>
          </div>
          <nav aria-label="Sayfa bölümleri" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-500">
            {links.map(({ href, label }) => (
              <a key={href} href={href} className="transition hover:text-stone-900">
                {label}
              </a>
            ))}
          </nav>
          <p className="text-sm text-stone-400 lg:text-right">Wellness işletmeleri için sade otomasyon.</p>
        </div>
      </LandingContainer>
    </footer>
  );
}
