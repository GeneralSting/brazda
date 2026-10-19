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
- the signed-in person is read through `getSessionUser` from `#/server/session`, signing out is `authClient.signOut` - the server deletes the session and expires the cookie in one answer, the cookie even when the database does not respond, so the screen never waits for it and `/prijava` checks the session only on a server render
- a field the server owns is added to the user through `user.additionalFields` with `input: false`, so a request that sends it is refused - the column is added to `src/server/db/schema/auth.ts` with a migration, as the generator would write it
- the email sign-up needs `acceptTerms: true` in its body, `requireAcceptedTerms` refuses it otherwise with `TERMS_NOT_ACCEPTED` and `stampTermsAcceptance` writes `termsAcceptedAt` from the server clock (`#/server/terms-consent.server`)
- attempts are limited by Better Auth, on only in production, with our limits per IP and path in `#/config/rate-limit` - sign-in and sign-up 5 times a minute, the endpoints that send an email 5 times in 5 minutes, everything else 60 a minute
  - they are counted by our own `rateLimitStorage` (`#/server/rate-limit.server`) in our `rate_limit` table, not by the storage of Better Auth, whose window starts again with every allowed request, so requests a little rarer than the limit would add up without end
  - a window starts with the first request and the count goes back to zero when the whole window has passed - one statement counts and decides by the clock of the database, so parallel requests and several server instances get the same answer
  - a new window deletes the rows whose window ended longer ago than the longest rule, no cleanup job is needed for them
  - the limit is only as good as the client IP - `AUTH_IP_HEADERS` names the header the hosting puts it in, set when the hosting is chosen; a header with a chain of addresses and no trusted proxies gives no IP, and then every visitor shares one count
- the browser talks to it through `authClient` from `#/services/auth-client`
- sign-in is Better Auth, `auth` from `#/server/auth.server`, its tables are generated into `src/server/db/schema/auth.ts` with `pnpm dlx auth@latest generate --config src/server/auth.server.ts --output src/server/db/schema/auth.ts`, then a migration is generated from them like for any other table
