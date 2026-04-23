const SESSION_KEY = 'vaha_admin_session_v1';

export function isAdminSessionActive(): boolean {
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}

export function setAdminSessionActive(authorization: string): void {
  sessionStorage.setItem(SESSION_KEY, authorization);
}

export function getAdminSessionAuthorization(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
