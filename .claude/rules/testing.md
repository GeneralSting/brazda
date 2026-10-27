---
paths:
  - "tests/**"
  - "**/*.test.ts"
---

# Testing

- `src` holds no line that exists only for tests and never knows tests exist - everything that serves only tests (configuration, replacements, helpers) lives in `tests/`
- tests run with Vitest (`pnpm test` once, `pnpm test:watch` while working), configured in `tests/vitest.config.ts`, apart from `vite.config.ts` - tests import plain TypeScript modules and need none of its plugins
- `pnpm test:coverage` counts every file of `src`, also the untouched ones, and writes the report to `tests/coverage` (ignored by git, `index.html` opens in the browser) - it shows the branches no test reaches, it is no share the run has to meet
- tests never sit in `src` - they live in `tests/` at the root, one folder per kind (`unit`, later `integration` and `e2e`), and inside it follow the path of the file they test, named after it: `src/server/email.server.ts` -> `tests/unit/server/email.server.test.ts`
  - a test imports the code through the `#/` alias like any other file, never with a relative path into `src` - only the helpers of `tests/support/` are imported relatively
- `tests/support/setup.ts` runs before every test file - what every test needs is set there once
- `describe` names the unit, every `it` reads as a sentence about one behaviour (`it("prints the email in development without a key")`), in English like the rest of the code
- unit tests touch no database, no network and no browser - they cover our own functions, never the behaviour of Better Auth, Drizzle or another library
- `tests/vitest.config.ts` gives every variable of `getServerEnv` a fake value of the right shape; its database address leads nowhere, so a test that reaches the database by mistake fails at once and never writes into the development data
- no test sends a real email - `setup.ts` replaces `sendEmail` and `sendEmailInBackground` for every test with a copy into the outbox (`tests/support/email-outbox.ts`), emptied before each test; a test reads it with `readOutbox`, and only a test of the sending itself lifts it with `vi.unmock` at its top, so its plain imports are the real module, the network faked with `vi.spyOn(globalThis, "fetch")` - `tests/unit/support/setup.test.ts` guards the replacement, it fails first if the replacement ever stops reaching the module
