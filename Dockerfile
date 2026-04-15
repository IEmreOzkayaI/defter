FROM node:20-alpine AS build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_SITE_URL
ARG VITE_LANDING_HERO_VIDEO
ARG VITE_BACKEND_BASE_URL

ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_LANDING_HERO_VIDEO=$VITE_LANDING_HERO_VIDEO
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

RUN pnpm run build

FROM nginx:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY entrypoint.sh /docker-entrypoint.d/30-runtime-config.sh

RUN chmod +x /docker-entrypoint.d/30-runtime-config.sh

ENV NGINX_PORT=8080
ENV IFRAME_ALLOWED_ORIGIN='none'
ENV VITE_BACKEND_BASE_URL=

EXPOSE 8080
