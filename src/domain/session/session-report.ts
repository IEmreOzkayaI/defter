import type { DemoSession } from '@/shared/types/demo.types';

export interface DailyReportSummary {
  totalSessions: number;
  closedSessions: number;
  revenue: number;
  averageSessionDurationMinutes: number;
  zeroDurationClosures: number;
  pendingPaymentSessions: number;
  manualClosures: number;
}

function getSessionTotal(session: DemoSession): number {
  return session.items.reduce((acc, item) => acc + item.price * item.qty, 0);
}

function getDurationMinutes(startedAt: Date, endedAt: Date | null): number {
  if (!endedAt) return 0;
  const diffMs = endedAt.getTime() - startedAt.getTime();
  return Math.max(0, Math.round(diffMs / 60000));
}

export function buildDailySessionReport(sessions: DemoSession[]): DailyReportSummary {
  const closed = sessions.filter((session) => session.status === 'closed');
  const pending = sessions.filter((session) => session.status === 'pending_payment');
  const totalDuration = closed.reduce(
    (acc, session) => acc + getDurationMinutes(session.createdAt, session.closedAt),
    0
  );
  const zeroDurationClosures = closed.filter(
    (session) => getDurationMinutes(session.createdAt, session.closedAt) === 0
  ).length;

  return {
    totalSessions: sessions.length,
    closedSessions: closed.length,
    revenue: closed.reduce((acc, session) => acc + getSessionTotal(session), 0),
    averageSessionDurationMinutes: closed.length === 0 ? 0 : Math.round(totalDuration / closed.length),
    zeroDurationClosures,
    pendingPaymentSessions: pending.length,
    manualClosures: closed.filter((session) => session.closingReason === 'manual').length,
  };
}
