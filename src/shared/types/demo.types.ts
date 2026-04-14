export type DemoMode = 'temel' | 'pos';

export interface LandingUser {
  email: string;
  phone?: string;
  sector?: string;
}

export interface SectorRow {
  id: string;
  icon: string;
  name: string;
  desc: string;
  session: string;
  unit: string;
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
  status: 'open' | 'closed';
}
