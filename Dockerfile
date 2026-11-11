FROM node:24.22.2-alpine@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8 AS build
WORKDIR /app

# Copy dependency files first to cache the npm ci layer
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Commit shown in the app footer (.git is not part of the build context)
ARG GIT_SHA=unknown
RUN GIT_SHA=$GIT_SHA npx quasar build

# Runs as non-root user nginx (uid 101) and listens on 8080
FROM nginxinc/nginx-unprivileged:1.30-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS production
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
