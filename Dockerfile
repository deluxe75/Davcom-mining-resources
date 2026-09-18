FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends php-cli php-sqlite3 procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build \
    && mkdir -p backend/uploads public/uploads \
    && chmod -R 775 backend/uploads public/uploads

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
