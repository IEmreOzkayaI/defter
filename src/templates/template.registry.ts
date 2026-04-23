import { spaTemplate } from '@/templates/spa.template';
import type { SectorTemplate, TemplateSector } from '@/templates/template.types';

export const DEFAULT_TEMPLATE_SECTOR: TemplateSector = 'hamam';

const TEMPLATE_REGISTRY: Record<TemplateSector, SectorTemplate> = {
  hamam: spaTemplate,
};

export function listTemplates(): SectorTemplate[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplateBySector(sector: TemplateSector): SectorTemplate {
  return TEMPLATE_REGISTRY[sector];
}
