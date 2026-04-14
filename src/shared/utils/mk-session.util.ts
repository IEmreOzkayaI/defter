import type { DemoSession } from '@/shared/types/demo.types';

let sid = 100;

export function mkSess(name: string): DemoSession {
  return { id: sid++, name, items: [], createdAt: new Date(), closedAt: null, status: 'open' };
}

export function resetSessionIdCounterForTests(next = 100): void {
  sid = next;
}
