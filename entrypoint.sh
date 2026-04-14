#!/bin/sh
set -e

# CSP frame-ancestors: empty => 'none' (no embedding allowed)
if [ -z "${IFRAME_ALLOWED_ORIGIN}" ]; then
  export IFRAME_ALLOWED_ORIGIN="'none'"
fi

export IFRAME_ALLOWED_ORIGIN

envsubst '$IFRAME_ALLOWED_ORIGIN' < /etc/nginx/templates/nginx.conf > /etc/nginx/conf.d/default.conf
