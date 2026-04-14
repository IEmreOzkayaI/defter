# --- Base Stage ---
FROM node:20-alpine AS base

RUN npm install -g pnpm@10.6.5

# --- Deps Stage ---
FROM base AS deps
WORKDIR /dependencies

COPY package.json pnpm-lock.yaml ./

RUN if [ -f yarn.lock ] || [ -f package-lock.json ]; then \
        echo "Error: Use only pnpm."; \
        exit 1; \
    fi

RUN pnpm install --frozen-lockfile

# --- Builder Stage ---
FROM base AS builder
WORKDIR /build

COPY --from=deps /dependencies/node_modules ./node_modules

COPY . .

# Build-time (Vite): docker-compose .env ile aynı VITE_* değişkenleri
ARG VITE_SITE_URL
ARG VITE_LANDING_HERO_VIDEO
ARG VITE_ADMIN_USERNAME
ARG VITE_ADMIN_PASSWORD
ARG VITE_ADMIN_LOGIN_MOCK
ARG VITE_ADMIN_MOCK_DATA
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_LANDING_HERO_VIDEO=$VITE_LANDING_HERO_VIDEO
ENV VITE_ADMIN_USERNAME=$VITE_ADMIN_USERNAME
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD
ENV VITE_ADMIN_LOGIN_MOCK=$VITE_ADMIN_LOGIN_MOCK
ENV VITE_ADMIN_MOCK_DATA=$VITE_ADMIN_MOCK_DATA

RUN pnpm run build

# ---------- Nginx runtime ----------
FROM nginx:alpine AS proxy
WORKDIR /usr/share/nginx/html

COPY --from=builder /build/dist ./

COPY nginx.conf /etc/nginx/templates/nginx.conf

COPY entrypoint.sh /docker-entrypoint.d/30-configure-nginx.sh
RUN chmod +x /docker-entrypoint.d/30-configure-nginx.sh
