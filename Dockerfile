# develop stage
FROM node:18 as develop-stage
WORKDIR /
RUN npm i -g add @quasar/cli
COPY . .

# build stage
FROM develop-stage as build-stage
RUN npm i
RUN quasar build

# production stage
FROM nginx:1.23-alpine as production-stage
COPY --from=build-stage /dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
