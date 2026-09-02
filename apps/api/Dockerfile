# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* tsconfig.base.json ./

# Copy API package
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma/
COPY apps/api/src ./apps/api/src/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Compile TypeScript
RUN cd apps/api && npx tsc

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

WORKDIR /app

# Copy workspace root
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy API package.json for production install
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy Prisma schema and generate client directly in production stage
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma/
RUN cd apps/api && npx prisma generate
# Copy compiled output
COPY --from=builder /app/apps/api/dist ./apps/api/dist/

WORKDIR /app/apps/api

EXPOSE 3001

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
