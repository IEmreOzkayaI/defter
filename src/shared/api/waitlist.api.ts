import { BACKEND_BASE_URL } from './backend-url';

export type WaitlistStatus = 'new' | 'bought' | 'not_bought';

export type WaitlistItem = {
  _id: string;
  full_name: string;
  phone_number: string;
  status: string;
  note: string;
  created_at: string;
  updated_at: string;
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type ApiEnvelope<T> = { success?: boolean; data?: T };

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(bodyText || `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as TResponse;
  return (await response.json()) as TResponse;
}

function unwrapData<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const maybeData = (payload as ApiEnvelope<T>).data;
    if (maybeData !== undefined) return maybeData;
  }
  return payload as T;
}

function makeBearerTokenHeader(accessToken: string): string {
  return `Bearer ${accessToken}`;
}

export async function createWaitlistLead(input: { full_name: string; phone_number: string; status?: WaitlistStatus; note?: string }): Promise<WaitlistItem> {
  const payload = await request<WaitlistItem | ApiEnvelope<WaitlistItem>>('/v1/admin/waitlist', {
    method: 'POST',
    body: JSON.stringify({
      full_name: input.full_name,
      phone_number: input.phone_number,
      status: input.status ?? 'new',
      note: input.note ?? '',
    }),
  });
  return unwrapData(payload);
}

export async function adminLogin(input: { username: string; password: string }): Promise<{ authorization: string }> {
  const payload = await request<{ accessToken: string } | ApiEnvelope<{ accessToken: string }>>('/v1/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: input.username,
      password: input.password,
    }),
  });

  const data = unwrapData(payload);
  return { authorization: makeBearerTokenHeader(data.accessToken) };
}

export async function findAllWaitlist(input: { authorization: string }): Promise<WaitlistItem[]> {
  const payload = await request<WaitlistItem[] | ApiEnvelope<WaitlistItem[]>>('/v1/admin/waitlist', {
    method: 'GET',
    headers: {
      Authorization: input.authorization,
    },
  });
  const list = unwrapData(payload);
  return Array.isArray(list) ? list : [];
}

export async function updateWaitlist(input: {
  authorization: string;
  id: string;
  update: Partial<Pick<WaitlistItem, 'status' | 'note' | 'full_name' | 'phone_number'>>;
}): Promise<WaitlistItem> {
  const updatePayload = Object.fromEntries(
    Object.entries(input.update).filter(([, value]) => value !== undefined),
  ) as Record<string, JsonValue>;

  const responsePayload = await request<WaitlistItem | ApiEnvelope<WaitlistItem>>(`/v1/admin/waitlist/${input.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: input.authorization,
    },
    body: JSON.stringify(updatePayload),
  });
  return unwrapData(responsePayload);
}

export async function deleteWaitlist(input: { authorization: string; id: string }): Promise<void> {
  await request<void>(`/v1/admin/waitlist/${input.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: input.authorization,
    },
  });
}
