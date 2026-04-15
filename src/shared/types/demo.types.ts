import type { SessionStatus, TimerMode } from '@/domain/session/session.types';

export type DemoMode = 'temel' | 'pos';

export interface LandingUser {
  email: string;
  phone?: string;
  sector?: string;
}

/** Landing / dokümantasyon: `docs/05-product-scope-and-roadmap.md` ile uyumlu. */
export type SectorRoadmap = 'phase1' | 'phase2' | 'phase3' | 'niche' | 'out';

export interface SectorRow {
  id: string;
  icon: string;
  name: string;
  desc: string;
  session: string;
  unit: string;
  roadmap?: SectorRoadmap;
}

export interface DemoServiceRow {
  id: number;
  cat: string;
  name: string;
  price: number;
  dur: number;
  kdv?: number;
  active?: boolean;
}

export type PosDeviceStatus = 'online' | 'busy' | 'offline';

export interface PosDeviceRow {
  id: string;
  name: string;
  loc: string;
  st: PosDeviceStatus;
}

export interface TemplateCategory {
  k: string;
  l: string;
}

export interface TemplatePreset {
  sessionLabel: string;
  resourceLabel: string;
  categories: TemplateCategory[];
  services: DemoServiceRow[];
}

export interface DemoSetupPayload {
  sector: string;
  businessName: string;
  sessionLabel: string;
  template: TemplatePreset;
}

export interface DemoSessionItem extends DemoServiceRow {
  qty: number;
}

export interface DemoSession {
  id: number;
  name: string;
  items: DemoSessionItem[];
  createdAt: Date;
  closedAt: Date | null;
  status: SessionStatus;
  timerMode: TimerMode;
  closingReason: 'payment' | 'manual' | null;
  autoTimerServiceIds: number[];
  timerPlan: {
    mode: 'count_up_slice' | 'fixed_duration';
    sliceMinutes: number | null;
    fixedMinutes: number | null;
    warningShown: boolean;
  };
  templateSnapshot: {
    sector: string;
    templateId: string;
    sessionLabel: string;
    resourceLabel: string;
    timerMode: TimerMode;
  };
}
