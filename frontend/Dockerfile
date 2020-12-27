FROM node:12.20.0-alpine3.12 as build_stage
RUN mkdir -p /license-manager-frontend
WORKDIR  /license-manager-frontend
COPY . /license-manager-frontend
RUN yarn install --production
RUN yarn build

FROM nginx:1.19.6-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build_stage /license-manager-frontend/build .
COPY --from=build_stage /license-manager-frontend/ssl /etc/nginx/ssl
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]