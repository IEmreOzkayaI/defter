/**
 * Kimlik bilgileri Vite ile istemci paketine gömülür (VITE_*). Üretimde gerçek güvenlik için sunucu
 * tarafı oturum gerekir.
 */
function isAdminLoginMock(): boolean {
  const v = (import.meta.env.VITE_ADMIN_LOGIN_MOCK ?? '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function getAdminCredentials() {
  const mock = isAdminLoginMock();
  const username = (import.meta.env.VITE_ADMIN_USERNAME ?? '').trim();
  const password = (import.meta.env.VITE_ADMIN_PASSWORD ?? '').trim();
  const hasRealPair = username.length > 0 && password.length > 0;
  return {
    username,
    password,
    /** Mock açıksa gerçek kullanıcı/şifre olmasa da giriş ekranı kullanılabilir. */
    isConfigured: mock || hasRealPair,
    mock,
  };
}

export function credentialsMatch(inputUser: string, inputPass: string): boolean {
  const { username, password, isConfigured, mock } = getAdminCredentials();
  if (!isConfigured) return false;
  const u = inputUser.trim();
  const p = inputPass;
  if (mock) {
    return u.length > 0 && p.length > 0;
  }
  return u === username && p === password;
}
