import type { PricingType } from '@/domain/session/session.types';

export interface PricingInput {
  pricingType: PricingType;
  quantity: number;
  unitPrice: number;
}

export function calculateSessionLinePrice(input: PricingInput): number {
  const qty = Number.isFinite(input.quantity) ? Math.max(0, input.quantity) : 0;
  const unit = Number.isFinite(input.unitPrice) ? Math.max(0, input.unitPrice) : 0;

  if (input.pricingType === 'flat') {
    return unit;
  }

  return qty * unit;
}
