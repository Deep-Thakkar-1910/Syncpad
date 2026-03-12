# syntax=docker/dockerfile:1

FROM oven/bun:1.3.7 AS dev
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN bun install --frozen-lockfile
EXPOSE 3000
CMD ["bun", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

FROM oven/bun:1.3.7 AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN bun install --frozen-lockfile

FROM oven/bun:1.3.7 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1.3.7 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Keep runtime simple and reliable for Next + Prisma output.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["bun", "run", "start"]
