FROM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS build
WORKDIR /app

# Copy dependency files first to cache the npm ci layer
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Commit shown in the app footer (.git is not part of the build context)
ARG GIT_SHA=unknown
RUN GIT_SHA=$GIT_SHA npx quasar build

# Runs as non-root user nginx (uid 101) and listens on 8080
FROM nginx/nginx-unprivileged:1.30.7-alpine@sha256:0c53a1f2890c3526bfd201440f0fd3970e5b78f80630f58284aad0d34b5ec7bd AS production
# html is owned by nginx so the entrypoint script can write config.js at startup
COPY --from=build --chown=nginx:root /app/dist/spa /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/snippets/headers.conf /etc/nginx/snippets/headers.conf

# Runs via the image's own entrypoint before nginx starts
COPY --chmod=755 nginx/40-lama-config.sh /docker-entrypoint.d/40-lama-config.sh

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

LABEL org.opencontainers.image.source="https://github.com/Lippesola/lama-app"
