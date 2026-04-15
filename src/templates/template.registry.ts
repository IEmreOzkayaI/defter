import { bilardoTemplate } from '@/templates/bilardo.template';
import { cafeTemplate } from '@/templates/cafe.template';
import { internetCafeTemplate } from '@/templates/internet-cafe.template';
import { psCafeTemplate } from '@/templates/ps-cafe.template';
import { spaTemplate } from '@/templates/spa.template';
import type { SectorTemplate, TemplateSector } from '@/templates/template.types';

export const DEFAULT_TEMPLATE_SECTOR: TemplateSector = 'hamam';

const TEMPLATE_REGISTRY: Record<TemplateSector, SectorTemplate> = {
  net: internetCafeTemplate,
  ps: psCafeTemplate,
  hamam: spaTemplate,
  cafe: cafeTemplate,
  bilardo: bilardoTemplate,
};

export function listTemplates(): SectorTemplate[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplateBySector(sector: TemplateSector): SectorTemplate {
  return TEMPLATE_REGISTRY[sector];
}
