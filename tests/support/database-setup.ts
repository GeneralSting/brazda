import { sql } from "drizzle-orm";
import { afterAll, beforeEach } from "vitest";
import { getDb } from "#/server/db/client.server";

// every integration test starts from empty tables, sessions and accounts go with their user
beforeEach(async () => {
	await getDb().execute(
		sql`truncate table "user", "session", "account", "verification", "rate_limit" cascade`,
	);
});

// the connections of a test file are closed with it, so no socket keeps the run open
afterAll(async () => {
	await getDb().$client.end();
});
