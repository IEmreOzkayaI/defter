import type { DemoSession } from '@/shared/types/demo.types';

let sid = 100;

export interface SessionSeedConfig {
  sector: string;
  templateId: string;
  sessionLabel: string;
  resourceLabel: string;
  timerMode: DemoSession['timerMode'];
}

interface MkSessionOptions {
  startImmediately?: boolean;
  timerPlan?: Partial<DemoSession['timerPlan']>;
}

export function mkSess(name: string, seed: SessionSeedConfig, options: MkSessionOptions = {}): DemoSession {
  const startImmediately = options.startImmediately === true;
  return {
    id: sid++,
    name,
    items: [],
    createdAt: new Date(),
    closedAt: null,
    status: startImmediately ? 'in_progress' : 'open',
    timerMode: seed.timerMode,
    closingReason: null,
    autoTimerServiceIds: [],
    timerPlan: {
      mode: options.timerPlan?.mode || 'count_up_slice',
      sliceMinutes: options.timerPlan?.sliceMinutes ?? 60,
      fixedMinutes: options.timerPlan?.fixedMinutes ?? null,
      warningShown: options.timerPlan?.warningShown ?? false,
    },
    templateSnapshot: {
      sector: seed.sector,
      templateId: seed.templateId,
      sessionLabel: seed.sessionLabel,
      resourceLabel: seed.resourceLabel,
      timerMode: seed.timerMode,
    },
  };
}

export function resetSessionIdCounterForTests(next = 100): void {
  sid = next;
}
