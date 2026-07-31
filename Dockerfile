# Google Cloud Run Dockerfile for Pixel Picker Node.js WebSockets Server
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy package descriptors
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and build production bundle
COPY . .
RUN pnpm run build

# Production Runtime Image
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Expose HTTP & WebSockets Port
EXPOSE 8080

CMD ["node", "server/server.js"]
