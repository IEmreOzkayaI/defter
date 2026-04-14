import type { ContactLead } from '@/shared/storage/contact-leads.storage';

const MOCK_ID_PREFIX = 'mock-lead:';

export function isMockLeadId(id: string): boolean {
  return id.startsWith(MOCK_ID_PREFIX);
}

function flagEnabled(value: string | undefined): boolean {
  const v = (value ?? '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/** Geçici örnek satırlar — yalnız .env ile açılır. */
export function isAdminMockLeadsEnabled(): boolean {
  return flagEnabled(import.meta.env.VITE_ADMIN_MOCK_DATA);
}

/** Gerçek kayıtların üstüne örnek satırlar (id ile ayırt edilir). */
export const ADMIN_MOCK_LEADS: ContactLead[] = [
  {
    id: `${MOCK_ID_PREFIX}1`,
    name: 'Ayşe Yılmaz',
    phone: '0532 111 22 33',
    createdAt: new Date(Date.now() - 86_400_000 * 2).toISOString(),
    note: 'Hamam şablonu ile dönüş istedi.',
  },
  {
    id: `${MOCK_ID_PREFIX}2`,
    name: 'Mehmet Kaya',
    phone: '0542 444 55 66',
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    note: '',
    status: 'bought',
  },
  {
    id: `${MOCK_ID_PREFIX}3`,
    name: 'Derya Öztürk',
    phone: '0555 987 65 43',
    createdAt: new Date(Date.now() - 36_000_000).toISOString(),
    note: 'POS paketi soracak — önümüzdeki hafta.',
    status: 'not_bought',
  },
];

export function mergeLeadsForDisplay(real: ContactLead[]): ContactLead[] {
  if (!isAdminMockLeadsEnabled()) {
    return real;
  }
  const merged = [...ADMIN_MOCK_LEADS, ...real.filter((r) => !isMockLeadId(r.id))];
  return [...merged].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
