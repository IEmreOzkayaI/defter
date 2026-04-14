const STORAGE_KEY = 'defter_contact_leads_v1';

/** İletişim takibi — not eklendiği gibi statü de saklanır. */
export type LeadStatus = 'bought' | 'not_bought';

export type ContactLead = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  note: string;
  status?: LeadStatus;
};

function isLeadStatus(x: string): x is LeadStatus {
  return x === 'bought' || x === 'not_bought';
}

/** Eski kayıtlarda `contacted` kalmış olabilir. */
function isStoredLegacyStatus(x: string): boolean {
  return x === 'contacted' || isLeadStatus(x);
}

function isLead(x: unknown): x is ContactLead {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  if (
    typeof o.id !== 'string' ||
    typeof o.name !== 'string' ||
    typeof o.phone !== 'string' ||
    typeof o.createdAt !== 'string' ||
    typeof o.note !== 'string'
  ) {
    return false;
  }
  if (o.status !== undefined && (typeof o.status !== 'string' || !isStoredLegacyStatus(o.status))) {
    return false;
  }
  return true;
}

function parse(raw: string | null): ContactLead[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(isLead);
  } catch {
    return [];
  }
}

function write(leads: ContactLead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function stripLegacyContacted(lead: ContactLead): ContactLead {
  if ((lead.status as string | undefined) === 'contacted') {
    const { status: _s, ...rest } = lead;
    return rest;
  }
  return lead;
}

export function getContactLeads(): ContactLead[] {
  const leads = parse(localStorage.getItem(STORAGE_KEY)).map(stripLegacyContacted);
  return [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function appendContactLead(name: string, phone: string): ContactLead {
  const leads = parse(localStorage.getItem(STORAGE_KEY));
  const item: ContactLead = {
    id: newId(),
    name,
    phone,
    createdAt: new Date().toISOString(),
    note: '',
  };
  leads.unshift(item);
  write(leads);
  return item;
}

export function updateLeadNote(id: string, note: string): void {
  const leads = parse(localStorage.getItem(STORAGE_KEY));
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return;
  leads[idx] = { ...leads[idx], note };
  write(leads);
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const leads = parse(localStorage.getItem(STORAGE_KEY));
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return;
  leads[idx] = { ...leads[idx], status };
  write(leads);
}
