import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getServerEnv } from "#/config/env.server";
import { getDb } from "#/server/db/client.server";
import * as schema from "#/server/db/schema/auth";

const env = getServerEnv();

/**
 * Sign-in of the application: users, sessions and accounts are stored in our own
 * database through Drizzle. Server only, every request that needs the signed-in
 * person goes through this instance
 */
export const auth = betterAuth({
	appName: "Brazda",
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	emailAndPassword: { enabled: true },
	plugins: [tanstackStartCookies()], // lets sign-in from a server function set its cookie, has to stay the last plugin
	database: drizzleAdapter(getDb(), { provider: "pg", schema }),
});
