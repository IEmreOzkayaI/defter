import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { LandingUser } from '@/shared/types/demo.types';

interface LandingUserContextValue {
  landingUser: LandingUser | null;
  setLandingUser: (u: LandingUser | null) => void;
}

const LandingUserContext = createContext<LandingUserContextValue | null>(null);

export function LandingUserProvider({ children }: { children: ReactNode }) {
  const [landingUser, setLandingUserState] = useState<LandingUser | null>(null);
  const setLandingUser = useCallback((u: LandingUser | null) => {
    setLandingUserState(u);
  }, []);
  const value = useMemo(
    () => ({ landingUser, setLandingUser }),
    [landingUser, setLandingUser]
  );
  return <LandingUserContext.Provider value={value}>{children}</LandingUserContext.Provider>;
}

export function useLandingUser(): LandingUserContextValue {
  const ctx = useContext(LandingUserContext);
  if (!ctx) throw new Error('useLandingUser must be used within LandingUserProvider');
  return ctx;
}
