# Étape 1 : construction du site statique (Astro)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG SITE_URL
ENV SITE_URL=${SITE_URL}
RUN npm run build

# Étape 2 : Caddy sert le site construit, le Caddyfile reste monté par docker-compose
FROM caddy:2
COPY --from=build /app/dist /srv
