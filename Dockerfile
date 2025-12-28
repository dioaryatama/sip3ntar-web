# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies only untuk production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Set memory limit untuk build (optimized untuk RAM 2GB)
ENV NODE_OPTIONS="--max-old-space-size=1792"
ENV GENERATE_SOURCEMAP=false

# Install semua dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build aplikasi dengan optimasi memory
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output untuk image lebih kecil
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

# Jalankan dengan node server.js (lebih efisien dari npm start)
CMD ["node", "server.js"]