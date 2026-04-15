type RuntimeConfig = {
  VITE_BACKEND_BASE_URL?: string;
};

declare global {
  interface Window {
    __DEFTER_RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const runtimeBaseUrl = window.__DEFTER_RUNTIME_CONFIG__?.VITE_BACKEND_BASE_URL?.trim();
const buildTimeBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL?.trim();
const rawBaseUrl = runtimeBaseUrl || buildTimeBaseUrl;

export const BACKEND_BASE_URL = import.meta.env.DEV
  ? '/api'
  : rawBaseUrl && rawBaseUrl.length > 0
    ? rawBaseUrl.replace(/\/+$/, '')
    : '';
