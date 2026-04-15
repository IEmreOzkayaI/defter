#!/bin/sh
set -eu

# CSP frame-ancestors: empty => 'none' (no embedding allowed)
if [ -z "${IFRAME_ALLOWED_ORIGIN}" ]; then
  export IFRAME_ALLOWED_ORIGIN="'none'"
fi

if [ -z "${NGINX_PORT:-}" ]; then
  export NGINX_PORT="8080"
fi

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__DEFTER_RUNTIME_CONFIG__ = {
  VITE_BACKEND_BASE_URL: "${VITE_BACKEND_BASE_URL:-}"
};
EOF

envsubst '${IFRAME_ALLOWED_ORIGIN} ${NGINX_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
