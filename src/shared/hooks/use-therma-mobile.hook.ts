import { useLayoutEffect, useState } from 'react';

import { DEMO_MOBILE_BREAKPOINT } from '@/shared/constants/demo.constants';

function readCompactViewportWidth(): number {
  if (typeof window === 'undefined') return 1920;
  const el = document.documentElement;
  const vv = window.visualViewport;
  return Math.min(window.innerWidth, el.clientWidth || window.innerWidth, vv?.width ?? window.innerWidth);
}

export function isDemoMobileLayout(): boolean {
  if (typeof window === 'undefined') return false;
  const w = readCompactViewportWidth();
  const mq = window.matchMedia(`(max-width: ${DEMO_MOBILE_BREAKPOINT - 1}px)`).matches;
  return mq || w < DEMO_MOBILE_BREAKPOINT;
}

export function useThermaMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? isDemoMobileLayout() : false
  );

  useLayoutEffect(() => {
    const sync = () => setIsMobile(isDemoMobileLayout());
    sync();
    window.addEventListener('resize', sync, { passive: true });
    window.addEventListener('orientationchange', sync);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', sync);
    vv?.addEventListener('scroll', sync);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => sync()) : null;
    ro?.observe(document.documentElement);
    const root = document.getElementById('root');
    if (root) ro?.observe(root);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
      vv?.removeEventListener('resize', sync);
      vv?.removeEventListener('scroll', sync);
      ro?.disconnect();
    };
  }, []);

  return isMobile;
}
