# Syncpad (Collaborative IDE)

A real-time collaborative coding platform with shared Monaco editor state, live room chat, role-based room access, and remote code execution.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-ws-010101)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-orange)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-F9F1E1?logo=bun&logoColor=black)

## Quick Navigation

- Client setup: [Click here to open client setup instructions](./client/README.md)
- Server setup: [Click here to open server setup instructions](./server/README.md)

## Project Structure

```text
Syncpad/
├── client/                     # Next.js app (UI + API routes + auth + Prisma)
│   ├── app/(Rooms)/            # Collaborative room pages/components
│   ├── app/(Server)/api/       # Backend API routes inside Next.js app
│   ├── lib/                    # Auth, DB, Redis, API helpers
│   └── prisma/                 # Prisma schema + migrations
├── server/                     # Dedicated WebSocket server (Yjs + chat)
├── docker-compose.yml          # Production-like multi-service compose
└── docker-compose.dev.yml      # Development compose with volume mounts
```

## Basic Architecture

1. User signs in via Better Auth in the `client` app.
2. Room membership is verified by Next.js API routes using Prisma.
3. `GET /api/(Rooms)/room/auth/[roomId]` mints a short-lived JWT for socket auth.
4. Frontend connects to WebSocket server:
   - `/yjs/:roomId?token=...` for CRDT editor sync.
   - `/chat/:roomId?token=...` for room chat + presence.
5. Code execution hits `POST /api/execute`:
   - validates membership,
   - checks Redis cache,
   - forwards execution to Judge0,
   - caches output with TTL.

## Tech Stack

- Frontend: Next.js 16, React 19, Tailwind CSS v4, Monaco Editor
- Collaboration: Yjs, y-websocket, y-monaco
- Backend (app layer): Next.js Route Handlers, Better Auth, Prisma
- Realtime server: Node.js + `ws` + `@y/websocket-server`
- Data: PostgreSQL (Prisma), Redis (execution cache)
- Jobs: Inngest (invite cleanup)
- Infra: Docker, Docker Compose

## Prerequisites

- Node.js 20+
- Bun 1.3+
- npm 10+
- PostgreSQL database
- Redis instance
- Judge0 instance (or hosted endpoint)

## Installation (Local)

1. Clone and enter project.
2. Create env files from examples:
   - `cp client/.env.example client/.env`
   - `cp server/.env.example server/.env`
3. Install dependencies:
   - Client: `cd client && bun install`
   - Server: `cd ../server && npm ci`
4. Run database migrations and generate Prisma client:
   - `cd ../client && npx prisma migrate dev`
5. Start apps in separate terminals:
   - Client: `cd client && bun run dev`
   - WebSocket server: `cd server && npm run dev`

## Run With Docker

- Development: `docker compose -f docker-compose.dev.yml up --build`
- Production-like: `docker compose up --build -d`

Services:

- Client: `http://localhost:3000`
- WebSocket server: `ws://localhost:8080`
- Redis: `localhost:6379`

## Environment Files

- Client template: [`client/.env.example`](./client/.env.example)
- Server template: [`server/.env.example`](./server/.env.example)

## Scripts

### Client (`client/package.json`)

- `bun run dev` - start Next.js dev server
- `bun run build` - build app
- `bun run start` - run production build

### Server (`server/package.json`)

- `npm run dev` - start websocket server in watch mode
- `npm run build` - compile TypeScript
- `npm start` - run compiled server

## Security Notes

- Never commit real `.env` files.
- Rotate OAuth, JWT, and DB credentials if leaked.
- Keep `CORS_ALLOWED_ORIGIN` strict in production.
