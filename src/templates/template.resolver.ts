import { DEFAULT_TEMPLATE_SECTOR, getTemplateBySector, listTemplates } from '@/templates/template.registry';
import { toTemplatePreset, type SectorTemplate, type TemplateSector } from '@/templates/template.types';
import { validateTemplate } from '@/templates/template.validator';

export interface ResolveTemplateResult {
  template: SectorTemplate;
  preset: ReturnType<typeof toTemplatePreset>;
  usedFallback: boolean;
  errors: string[];
}

function isTemplateSector(value: string): value is TemplateSector {
  return listTemplates().some((template) => template.sector === value);
}

export function resolveTemplateBySector(sectorId: string): ResolveTemplateResult {
  const usedFallback = !isTemplateSector(sectorId);
  const resolvedSector = usedFallback ? DEFAULT_TEMPLATE_SECTOR : sectorId;
  const template = getTemplateBySector(resolvedSector);
  const validation = validateTemplate(template);

  return {
    template,
    preset: toTemplatePreset(template),
    usedFallback,
    errors: validation.errors,
  };
}

export function hasTemplateForSector(sectorId: string): boolean {
  return isTemplateSector(sectorId);
}
