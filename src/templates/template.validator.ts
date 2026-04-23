import { canTransition } from '@/domain/session/session.machine';
import type { SectorTemplate } from '@/templates/template.types';

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTemplate(template: SectorTemplate): TemplateValidationResult {
  const errors: string[] = [];

  if (!template.id.trim()) errors.push('Template id zorunlu.');
  if (!template.resourceName.trim()) errors.push('Template resourceName zorunlu.');
  if (template.categories.length === 0) errors.push('En az bir kategori gerekli.');
  if (template.services.length === 0) errors.push('En az bir hizmet gerekli.');

  for (const service of template.services) {
    if (!service.name.trim()) errors.push(`Bos hizmet adi: ${service.id}`);
    if (service.price < 0) errors.push(`Negatif fiyat: ${service.name}`);
    if (!template.categories.some((category) => category.k === service.cat)) {
      errors.push(`Tanimlanmamis kategori: ${service.name} -> ${service.cat}`);
    }
  }

  for (const rule of template.workflow) {
    if (!canTransition(rule.from, rule.to)) {
      errors.push(`Gecersiz workflow: ${rule.from} -> ${rule.to}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
