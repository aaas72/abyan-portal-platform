# ════════════════════════════════════════════════════════════
# 1. مرحلة التبعيات والبناء (Builder Stage)
# ════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps --include=dev

COPY . .
RUN npm run build

# ════════════════════════════════════════════════════════════
# 2. مرحلة التشغيل النهائي (Production Runner Stage)
# ════════════════════════════════════════════════════════════
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# مستخدم معزول غير متميز لأعلى أمان
RUN addgroup --system --gid 1001 nestgroup && \
    adduser --system --uid 1001 nestuser

COPY package*.json ./
RUN npm ci --legacy-peer-deps --only=production && \
    npm cache clean --force

COPY --from=builder --chown=nestuser:nestgroup /app/dist ./dist

USER nestuser

EXPOSE 4000

CMD ["node", "dist/src/main"]
