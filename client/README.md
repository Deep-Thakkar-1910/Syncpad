# Syncpad Client

Next.js frontend and app-backend layer for authentication, room management, invite flow, and code execution API.

## What Lives Here

- App Router UI (`app/`) for dashboard, room editor, chat, and terminal
- API route handlers (`app/(Server)/api/`) for rooms, auth, execution, inngest
- Better Auth configuration (`lib/auth.ts`)
- Prisma schema + migrations (`prisma/`)
- Redis client for execution result caching (`lib/redis.ts`)

## Requirements

- Bun 1.3+
- Node.js 20+
- PostgreSQL database
- Redis instance
- Judge0 endpoint

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` values (DB, OAuth, Redis, Judge0, JWT).
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start development server:
   ```bash
   bun run dev
   ```

App runs on `http://localhost:3000` by default.

## Important Env Vars

- `NEXT_PUBLIC_SERVER_URL` - frontend API base URL (usually `http://localhost:3000/api`)
- `NEXT_PUBLIC_WS_CONNECTION_URL` - websocket base URL (usually `ws://localhost:8080`)
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - auth signing secret
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `JWT_SECRET` - token signing for room websocket auth
- `REDIS_URL` - Redis connection URL
- `JUDGE0_BASE_URL` - Judge0 endpoint

## Scripts

- `bun run dev` - start dev server
- `bun run build` - build app
- `bun run start` - start production app
- `bun run lint` - run lint checks

## Related Docs

- Root project docs: [../README.md](../README.md)
- WebSocket server docs: [../server/README.md](../server/README.md)
