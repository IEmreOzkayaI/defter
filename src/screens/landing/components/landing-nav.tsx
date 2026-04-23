import { LandingContainer } from '@/screens/landing/ui/landing-container';

type Props = {
  scrolled: boolean;
  onOpenDemo: () => void;
  onOpenContact: () => void;
};

export function LandingNav({ scrolled, onOpenDemo, onOpenContact }: Props) {
  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-stone-200/90 bg-[#f7f6f2]/88 shadow-sm shadow-stone-900/[0.03] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <LandingContainer className="flex h-16 items-center justify-between gap-4">
        <a href="#hero" className="group flex shrink-0 items-center no-underline">
          <span className="text-xl font-bold tracking-tight text-stone-900 transition-colors group-hover:text-stone-700">vaha.</span>
        </a>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Ana eylemler">
          <button
            type="button"
            onClick={onOpenDemo}
            className="rounded-full border border-stone-900/15 bg-white/70 px-3 py-2 text-[13px] font-semibold text-stone-800 shadow-sm backdrop-blur-sm transition hover:border-stone-900/25 hover:bg-white sm:px-4"
          >
            Hemen Başla
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="rounded-full bg-stone-900 px-3 py-2 text-[13px] font-semibold text-white shadow-md shadow-stone-900/15 transition hover:bg-stone-800 sm:px-4"
          >
            Hemen İletişime Geç
          </button>
        </nav>
      </LandingContainer>
    </header>
  );
}
