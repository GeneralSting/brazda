---
paths:
  - "**/*.server.ts"
  - "src/server/**"
  - "drizzle/**"
  - "drizzle.config.ts"
  - ".env.example"
---

# Server and database

- code that may run only on the server (database, secrets) lives in files ending in `.server.ts` - TanStack Start import protection then fails the build when client code imports one
- a server function (`createServerFn`) that routes or the browser call sits in `src/server` without the `.server` suffix, its body runs on the server and only an RPC call reaches the client - it returns just the fields the screen needs, `getSessionUser` from `#/server/session` is the reference
- environment variables are read only through `getServerEnv` from `#/config/env.server`, which validates them - `.env.example` lists every variable, the real values go into `.env.local`, which is never committed
- the database is Neon PostgreSQL in Frankfurt (`aws-eu-central-1`), reached through Drizzle ORM and the Neon WebSocket driver, which supports transactions
  - the running application connects with `DATABASE_URL_POOLED` through `getDb` from `#/server/db/client.server`
  - drizzle-kit (`pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`) uses the direct `DATABASE_URL`, migrations are generated into `drizzle/` and committed
- every timestamp column is `timestamp(..., { withTimezone: true })`, so a moment means the same whatever the time zone of the server
- the browser talks to it through `authClient` from `#/services/auth-client`
- sign-in is Better Auth, `auth` from `#/server/auth.server`, its tables are generated into `src/server/db/schema/auth.ts` with `pnpm dlx auth@latest generate --config src/server/auth.server.ts --output src/server/db/schema/auth.ts`, then a migration is generated from them like for any other table
