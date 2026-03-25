# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 运行阶段 - 自定义 server 修复 OrbStack chunk 加载
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/scripts ./scripts

RUN npm ci --omit=dev

RUN mkdir -p /app/data /app/public/uploads && chown -R nextjs:nodejs /app/data /app/public .next

USER nextjs

EXPOSE 8080

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATA_DIR=/app/data

CMD ["sh", "-c", "[ -f /app/data/content.json ] || DATA_DIR=/app/data node scripts/seed-data.js; node server.js"]
