# KH Tattoo — Production Dockerfile
# Optimized for Google Cloud Compute Engine VM

FROM node:20-alpine AS base

# ─────────────────────────────────────────────────────────────────────────────
# Dependencies (all — build needs Tailwind, PostCSS, etc.)
# ─────────────────────────────────────────────────────────────────────────────

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ─────────────────────────────────────────────────────────────────────────────
# Builder
# ─────────────────────────────────────────────────────────────────────────────

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate (schema only — DATABASE_URL not needed for generate)
ENV DATABASE_URL="postgresql://placeholder:5432/db"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npx prisma generate

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Runner
# ─────────────────────────────────────────────────────────────────────────────

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma client + CLI + deps (migrate deploy needs valibot etc.)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
RUN chown -R nextjs:nodejs ./node_modules ./prisma

# Entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
