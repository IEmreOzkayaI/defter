import type { SessionStatus } from '@/domain/session/session.types';

const ALLOWED_TRANSITIONS: Record<SessionStatus, SessionStatus[]> = {
  open: ['in_progress', 'closed'],
  in_progress: ['pending_payment', 'closed'],
  pending_payment: ['closed', 'in_progress'],
  closed: [],
};

export function canTransition(from: SessionStatus, to: SessionStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function transitionStatus(current: SessionStatus, next: SessionStatus): SessionStatus {
  if (!canTransition(current, next)) {
    throw new Error(`Invalid session transition: ${current} -> ${next}`);
  }
  return next;
}
