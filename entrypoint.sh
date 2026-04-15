#!/bin/sh
set -eu

# CSP frame-ancestors: empty => 'none' (no embedding allowed)
if [ -z "${IFRAME_ALLOWED_ORIGIN}" ]; then
  export IFRAME_ALLOWED_ORIGIN="'none'"
fi

# Railway / Fly / Render: reverse proxy $PORT'a yönlendirir; nginx aynı portta dinlemeli (aksi halde 502).
if [ -n "${PORT:-}" ]; then
  export NGINX_PORT="$PORT"
elif [ -z "${NGINX_PORT:-}" ]; then
  export NGINX_PORT="8080"
fi

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__DEFTER_RUNTIME_CONFIG__ = {
  VITE_BACKEND_BASE_URL: "${VITE_BACKEND_BASE_URL:-}"
};
EOF

envsubst '${IFRAME_ALLOWED_ORIGIN} ${NGINX_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
