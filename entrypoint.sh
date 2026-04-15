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

# Nginx /api/ → bu upstream (sonunda / şart). Boşsa yerel varsayılan; Railway’de API URL’inizi verin.
: "${BACKEND_PROXY_TARGET:=http://127.0.0.1:3001/}"
export BACKEND_PROXY_TARGET

# Boş bırak: tarayıcı /api kullanır (nginx proxy). Dolu: doğrudan o origin’e fetch (CORS gerekir).
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__DEFTER_RUNTIME_CONFIG__ = {
  VITE_BACKEND_BASE_URL: "${VITE_BACKEND_BASE_URL:-}"
};
EOF

envsubst '${IFRAME_ALLOWED_ORIGIN} ${NGINX_PORT} ${BACKEND_PROXY_TARGET}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
