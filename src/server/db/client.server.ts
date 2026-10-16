import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { getServerEnv } from "#/config/env.server";

/**
 * The WebSocker driver of Neon, because it supports transactions, which signing up
 * and creating a holding need. Node has WebSocket built in, so no extra package
 */
const createDb = () => {
	const pool = new Pool({
		connectionString: getServerEnv().DATABASE_URL_POOLED,
	});
	// camelCase fields in TypeScript, snake_case columns in the database
	return drizzle({ client: pool, casing: "snake_case" });
};

let db: ReturnType<typeof createDb> | undefined;

/**
 * Database of the appliaction, created on first use and then shared by every request
 * of the running server. Server Only, the .server suffix stops the client bundle
 * from importing it
 */
export const getDb = () => {
	db ??= createDb();
	return db;
};
