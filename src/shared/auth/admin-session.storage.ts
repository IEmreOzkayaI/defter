const SESSION_KEY = 'defter_admin_session_v1';

export function isAdminSessionActive(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function setAdminSessionActive(): void {
  sessionStorage.setItem(SESSION_KEY, '1');
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
