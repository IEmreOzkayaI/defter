import type { DemoMode, DemoSetupPayload } from '@/shared/types/demo.types';

const KEY = 'defter_demo_setup_v1';

export function persistDemoSetup(setup: DemoSetupPayload, mode: DemoMode): void {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        setup,
        mode,
        savedAt: Date.now(),
      })
    );
  } catch {
    /* ignore */
  }
}

export function readPersistedDemoSetup(): {
  setup: DemoSetupPayload;
  mode: DemoMode;
} | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      setup: DemoSetupPayload;
      mode: DemoMode;
    };
    if (!parsed?.setup?.template?.services) return null;
    return { setup: parsed.setup, mode: parsed.mode };
  } catch {
    return null;
  }
}

export function clearPersistedDemoSetup(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
