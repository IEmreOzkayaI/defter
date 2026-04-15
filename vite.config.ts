import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')) as {
  version?: string;
};

function devPort(env: ReturnType<typeof loadEnv>) {
  const p = env.VITE_DEV_PORT ?? env.PORT;
  if (p) return Number.parseInt(String(p), 10) || 3000;
  return 3000;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = (env.VITE_BACKEND_BASE_URL || 'http://localhost:3001').trim();

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
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
