# Dockerfile.nginx

# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app
COPY . /app

RUN yarn
RUN yarn build

# Stage 2: Set up Nginx to serve the built app
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY spotnet.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]