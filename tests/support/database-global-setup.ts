import { fileURLToPath } from "node:url";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { readTestDatabase } from "./test-database";

const MIGRATIONS = fileURLToPath(new URL("../../drizzle", import.meta.url));

/**
 * Runs once before the integration tests: refuses a database that is not the test
 * branch, then applies the migrations not applied yet, so its schema never lags behind
 */
export default async () => {
	const { directUrl } = readTestDatabase();
	const pool = new Pool({ connectionString: directUrl });

	try {
		await migrate(drizzle({ client: pool }), { migrationsFolder: MIGRATIONS });
	} finally {
		await pool.end();
	}
};
