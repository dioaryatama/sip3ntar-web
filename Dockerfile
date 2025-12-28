# ======================
# Stage 1: Dependencies
# ======================
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ======================
# Stage 2: Builder
# ======================
FROM node:18-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV BROWSERSLIST_IGNORE_OLD_DATA=true
ENV NPM_CONFIG_LOGLEVEL=info
ENV NEXT_DEBUG=true
ENV DEBUG=next:*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN sh -c ' \
  echo "===== NEXT BUILD START ====="; \
  ( while sleep 10; do echo "[BUILD] still running..."; done ) & \
  npm run build; \
  echo "===== NEXT BUILD END =====" \
'

# ======================
# Stage 3: Runner
# ======================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 8080
CMD ["node", "server.js"]
