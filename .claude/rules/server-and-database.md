---
paths:
  - "**/*.server.ts"
  - "src/lib/db/**"
  - "drizzle/**"
  - "drizzle.config.ts"
  - ".env.example"
---

# Server and database

- code that may run only on the server (database, secrets) lives in files ending in `.server.ts` - TanStack Start import protection then fails the build when client code imports one
- environment variables are read only through `getServerEnv` from `#/config/env.server`, which validates them - `.env.example` lists every variable, the real values go into `.env.local`, which is never committed
- the database is Neon PostgreSQL in Frankfurt (`aws-eu-central-1`), reached through Drizzle ORM and the Neon WebSocket driver, which supports transactions
  - the running application connects with `DATABASE_URL_POOLED` through `getDb` from `#/lib/db/client.server`
  - drizzle-kit (`pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`) uses the direct `DATABASE_URL`, migrations are generated into `drizzle/` and committed
