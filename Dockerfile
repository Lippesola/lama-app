FROM node:24.22.2-alpine AS build
WORKDIR /app

# Copy dependency files first to cache the npm ci layer
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx quasar build

# Runs as non-root user nginx (uid 101) and listens on 8080
FROM nginxinc/nginx-unprivileged:1.30-alpine AS production
# html is owned by nginx so the entrypoint script can write config.js at startup
COPY --from=build --chown=nginx:root /app/dist/spa /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/snippets/headers.conf /etc/nginx/snippets/headers.conf

# Runs via the image's own entrypoint before nginx starts
COPY --chmod=755 nginx/40-lama-config.sh /docker-entrypoint.d/40-lama-config.sh

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q --spider http://localhost:8080/ || exit 1

LABEL org.opencontainers.image.source="https://github.com/Lippesola/lama-app"
