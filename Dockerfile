FROM node:20-alpine as build
WORKDIR /app
# Copy dependency files first to cache npm ci layer
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx quasar build

FROM nginx:1.28-alpine as production-stage
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80
LABEL org.opencontainers.image.source="https://github.com/Lippesola/lama-app"
