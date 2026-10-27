---
paths:
  - "tests/**"
  - "**/*.test.ts"
---

# Testing

- `src` holds no line that exists only for tests and never knows tests exist - everything that serves only tests (configuration, replacements, helpers) lives in `tests/`
- tests run with Vitest, configured in `tests/vitest.config.ts`, apart from `vite.config.ts` - tests import plain TypeScript modules and need none of its plugins; the config holds one project per kind: `pnpm test` (`pnpm test:watch` while working) runs `unit`, `pnpm test:integration` runs `integration`
- `pnpm test:coverage` runs every project, counts every file of `src`, also the untouched ones, and writes the report to `tests/coverage` (ignored by git, `index.html` opens in the browser) - it shows the branches no test reaches, it is no share the run has to meet
- tests never sit in `src` - they live in `tests/` at the root, one folder per kind (`unit`, `integration`, later `e2e`), and inside it follow the path of the file they test, named after it: `src/server/email.server.ts` -> `tests/unit/server/email.server.test.ts`
  - a test imports the code through the `#/` alias like any other file, never with a relative path into `src` - only the helpers of `tests/support/` are imported relatively
- `tests/support/setup.ts` runs before every test file - what every test needs is set there once
- `describe` names the unit, every `it` reads as a sentence about one behaviour (`it("prints the email in development without a key")`), in English like the rest of the code
- unit tests touch no database, no network and no browser - they cover our own functions, never the behaviour of Better Auth, Drizzle or another library
- integration tests run our server code against a real database, the Neon branch `test`, whose two addresses (`DATABASE_URL` direct, `DATABASE_URL_POOLED` pooled) live only in `.env.test.local`, never read from `.env.local`
  - `tests/support/database-global-setup.ts` runs once before them: it refuses an address that leads to the development database of `.env.local` and applies the migrations of `drizzle/` not applied yet
  - `tests/support/database-setup.ts` empties the tables before every test, so every test makes the rows it needs and files run one after another
  - an auth endpoint is called through `postToAuth` of `tests/support/auth-request.ts`, the handler of Better Auth answers in the test process, no server is started; the emails it sends land in the outbox, where a test reads the link and goes on with it
- the config holds configuration only, the env files are read in `tests/support/env-files.ts` and handed to Vitest's `env`, which wins over a variable of the shell
  - `tests/.env.test` (committed) gives every variable of `getServerEnv` a fake value of the right shape; its database address leads nowhere, so a test that reaches the database by mistake fails at once and never writes into the development data
  - the integration project puts `.env.test.local` on top of it, a new variable of the server gets its fake value in `tests/.env.test` together with `.env.example`
- no test sends a real email - `setup.ts` replaces `sendEmail` and `sendEmailInBackground` for every test with a copy into the outbox (`tests/support/email-outbox.ts`), emptied before each test; a test reads it with `readOutbox`, and only a test of the sending itself lifts it with `vi.unmock` at its top, so its plain imports are the real module, the network faked with `vi.spyOn(globalThis, "fetch")` - `tests/unit/support/setup.test.ts` guards the replacement, it fails first if the replacement ever stops reaching the module
