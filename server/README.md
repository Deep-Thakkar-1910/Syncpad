# Syncpad WebSocket Server

Dedicated websocket service for real-time editor sync (Yjs relay) and room chat/presence.

## What Lives Here

- HTTP upgrade server (`src/server.ts`)
- Yjs websocket namespace: `/yjs/:roomId?token=...`
- Chat websocket namespace: `/chat/:roomId?token=...`
- JWT verification for room-scoped socket access
- In-memory room presence tracking and chat fanout

## Requirements

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:8080` by default (WebSocket upgrades).

## Important Env Vars

- `PORT` - websocket server port (default: `8080`)
- `JWT_SECRET` - must match client env for token verification
- `CORS_ALLOWED_ORIGIN` - allowed browser origin for websocket upgrade

## Scripts

- `npm run dev` - watch mode server
- `npm run build` - compile TypeScript to `dist/`
- `npm start` - run compiled server

## Related Docs

- Root project docs: [../README.md](../README.md)
- Client docs: [../client/README.md](../client/README.md)
