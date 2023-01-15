# develop stage
FROM node:18-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm i -g add @quasar/cli
COPY . .

# build stage
FROM develop-stage as build-stage
RUN npm i
RUN quasar build

# production stage
FROM nginx:1.23-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
