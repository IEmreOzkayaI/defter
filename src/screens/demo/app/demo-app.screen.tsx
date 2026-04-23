import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { DemoApp } from '@/screens/demo/app/demo-app-views';
import UnknownTemplateScreen from '@/screens/demo/shared/unknown-template.screen';
import { useLandingUser } from '@/shared/context/landing-user.context';
import type { DemoMode, DemoSetupPayload } from '@/shared/types/demo.types';
import { clearPersistedDemoSetup, readPersistedDemoSetup } from '@/shared/utils/demo-setup-storage.util';
import { hasTemplateForSector, resolveTemplateBySector } from '@/templates/template.resolver';

function modeFromParam(p: string | undefined): DemoMode {
  return p === 'pos' ? 'pos' : 'temel';
}

/**
 * Router state öncelikli; yoksa sessionStorage yalnızca URL modu eşleşiyorsa.
 * readPersistedDemoSetup() her çağrıda yeni nesne döndüğü için sonucu useMemo ile sabitliyoruz
 * (gereksiz re-render / effect tetiklenmesi önlenir).
 */
export default function DemoAppScreen() {
  const navigate = useNavigate();
  const { mode: modeParam } = useParams();
  const location = useLocation();
  const mode = modeFromParam(modeParam);
  const { landingUser, setLandingUser } = useLandingUser();

  const setup = useMemo((): DemoSetupPayload | undefined => {
    const fromState = (location.state as { setup?: DemoSetupPayload } | undefined)?.setup;
    if (fromState) return fromState;
    const persisted = readPersistedDemoSetup();
    if (persisted?.mode === mode) return persisted.setup;
    return undefined;
  }, [location.key, location.pathname, location.state, mode]);

  useEffect(() => {
    if (setup) return;
    navigate(`/demo/onboarding/${mode === 'pos' ? 'pos' : 'temel'}`, { replace: true });
  }, [setup, navigate, mode]);

  if (!setup) {
    return null;
  }

  if (!hasTemplateForSector(setup.sector)) {
    return (
      <UnknownTemplateScreen
        sectorId={setup.sector}
        onBack={() => navigate(`/demo/onboarding/${mode === 'pos' ? 'pos' : 'temel'}`, { replace: true })}
      />
    );
  }

  const resolvedPreset = resolveTemplateBySector(setup.sector);
  const resolvedSetup: DemoSetupPayload = {
    ...setup,
    template: resolvedPreset.preset,
  };

  const demoKey = `${mode}:${resolvedSetup.sector}:${resolvedSetup.businessName}:${resolvedSetup.sessionLabel}`;

  const leaveDemo = () => {
    clearPersistedDemoSetup();
    navigate('/', {
      replace: true,
      state: { openContact: true, contactIntent: 'from_demo' as const },
    });
  };

  return (
    <DemoApp
      key={demoKey}
      mode={mode}
      onBack={leaveDemo}
      setup={resolvedSetup}
      landingUser={landingUser}
      onUserChange={setLandingUser}
    />
  );
}
