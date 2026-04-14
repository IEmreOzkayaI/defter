import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type ProxyOptions, defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')) as {
  version?: string;
};

function devPort(env: ReturnType<typeof loadEnv>) {
  const p = env.VITE_DEV_PORT ?? env.PORT;
  if (p) return Number.parseInt(String(p), 10) || 3000;
  return 3000;
}

/** Uzak SSO / gateway varsa yerel `npm run dev` isteklerini yönlendir (örnek yapı; Defter’de zorunlu değil). */
function devProxy(env: ReturnType<typeof loadEnv>) {
  const sso = (env.SSO_BASE_URL ?? '').trim();
  const gw = (env.GATEWAY_BASE_URL ?? '').trim();
  if (!sso && !gw) return undefined;

  const out: Record<string, ProxyOptions> = {};

  if (sso) {
    out['/api/oauth'] = {
      target: sso,
      changeOrigin: true,
      secure: false,
      timeout: 30_000,
      proxyTimeout: 30_000,
      rewrite: (p) => p.replace(/^\/api\/oauth/, '/api/oauth'),
      headers: env.TOKENX_ENERGY_DASHBOARD_SSO_CREDENTIAL
        ? { Authorization: env.TOKENX_ENERGY_DASHBOARD_SSO_CREDENTIAL }
        : undefined,
    };
  }

  if (gw) {
    out['/api/v1'] = {
      target: gw,
      changeOrigin: true,
      secure: false,
      rewrite: (p) => p.replace(/^\/api\/v1/, '/internal/v1/admin'),
      headers: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL
        ? { Authorization: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL }
        : undefined,
    };

    out['^/api/versions/(organization|product|report|basket|migration)$'] = {
      target: gw,
      changeOrigin: true,
      secure: false,
      rewrite: (p) => p.replace(/^\/api\/versions\/(.+)/, '/internal/$1/v1/version'),
      headers: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL
        ? { Authorization: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL }
        : undefined,
    };

    out['/api/versions/pos'] = {
      target: gw,
      changeOrigin: true,
      secure: false,
      rewrite: () => '/pos/version',
      headers: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL
        ? { Authorization: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL }
        : undefined,
    };

    out['/api/versions/internal'] = {
      target: gw,
      changeOrigin: true,
      secure: false,
      rewrite: () => '/internal/version',
      headers: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL
        ? { Authorization: env.TOKENX_ENERGY_INTERNAL_GW_CREDENTIAL }
        : undefined,
    };
  }

  return out;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version ?? '0.0.0'),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: devPort(env),
      proxy: devProxy(env),
    },
  };
});
