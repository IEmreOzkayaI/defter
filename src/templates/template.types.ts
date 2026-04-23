import type { PricingType, SessionStatus, TimerMode } from '@/domain/session/session.types';
import type { DemoServiceRow, TemplateCategory, TemplatePreset } from '@/shared/types/demo.types';

export type TemplateSector = 'hamam';

export type TemplateAction = 'add_service' | 'change_qty' | 'close_session' | 'send_to_pos';

export interface TemplateTimerConfig {
  mode: TimerMode;
  defaultDurationMin?: number;
}

export interface TemplatePricingConfig {
  type: PricingType;
  unitPrice?: number;
}

export interface TemplateLabels {
  session: string;
  resource: string;
  sessionsNav: string;
  addServiceCta: string;
  closeSessionCta: string;
}

export interface TemplateWorkflowRule {
  from: SessionStatus;
  to: SessionStatus;
}

export interface SectorTemplate {
  id: string;
  sector: TemplateSector;
  sessionType: string;
  resourceName: string;
  resourcePreset: string[];
  timer: TemplateTimerConfig;
  pricing: TemplatePricingConfig;
  labels: TemplateLabels;
  actions: TemplateAction[];
  workflow: TemplateWorkflowRule[];
  categories: TemplateCategory[];
  services: DemoServiceRow[];
}

export function toTemplatePreset(template: SectorTemplate): TemplatePreset {
  return {
    sessionLabel: template.labels.session,
    resourceLabel: template.labels.resource,
    categories: template.categories.map((category) => ({ ...category })),
    services: template.services.map((service) => ({ ...service })),
  };
}
