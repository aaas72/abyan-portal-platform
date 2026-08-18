# ════════════════════════════════════════════════════════════
# 1. مرحلة التبعيات (Dependencies Stage)
# ════════════════════════════════════════════════════════════
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

# ════════════════════════════════════════════════════════════
# 2. مرحلة البناء (Builder Stage)
# ════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# بناء التطبيق مع Standalone Output
RUN npm run build

# ════════════════════════════════════════════════════════════
# 3. مرحلة التشغيل النهائي (Production Runner Stage)
# ════════════════════════════════════════════════════════════
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# إنشاء مستخدم غير متميز (Non-root user) لأقصى درجات الأمان
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# نسخ الملفات العامة ومخرجات الـ Standalone فقط
COPY --from=builder /app/public ./public

# إنشاء مجلد .next وضبط الصلاحيات
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
