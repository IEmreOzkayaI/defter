export type SessionStatus = 'open' | 'in_progress' | 'pending_payment' | 'closed';

export type TimerMode = 'count_up' | 'count_down' | 'no_timer';

export type PricingType = 'per_minute' | 'flat';

export interface SessionLineItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface SessionResource {
  id: string;
  name: string;
}

export interface SessionEntity {
  id: string;
  status: SessionStatus;
  startedAt: string;
  endedAt: string | null;
  resource?: SessionResource;
  items: SessionLineItem[];
}
