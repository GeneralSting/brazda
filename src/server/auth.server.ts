import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getServerEnv } from "#/config/env.server";
import { RATE_LIMIT_DEFAULT, RATE_LIMIT_RULES } from "#/config/rate-limit";
import { getDb } from "#/server/db/client.server";
import * as schema from "#/server/db/schema/auth";
import { sendPasswordResetEmail } from "#/server/password-reset.server";
import { rateLimitStorage } from "#/server/rate-limit.server";
import {
	requireAcceptedTerms,
	stampTermsAcceptance,
} from "#/server/terms-consent.server";

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
	emailAndPassword: {
		enabled: true,
		sendResetPassword: sendPasswordResetEmail,
		revokeSessionsOnPasswordReset: true, // a new password signs out every device, also the one of whoever took the old one
	},
	/**
	 * Attempts are counted in our rate_limit table, so every server instance sees the
	 * same count. On only in production, the limits per IP address are in config/rate-limit
	 */
	rateLimit: {
		customStorage: rateLimitStorage,
		...RATE_LIMIT_DEFAULT,
		customRules: RATE_LIMIT_RULES,
	},
	advanced: { ipAddress: { ipAddressHeaders: env.AUTH_IP_HEADERS } },
	user: {
		additionalFields: {
			// set only by the server when the terms are accepted, a request cannot send it
			termsAcceptedAt: {
				type: "date",
				required: false,
				input: false,
			},
		},
	},
	hooks: { before: requireAcceptedTerms },
	databaseHooks: { user: { create: { before: stampTermsAcceptance } } },
	plugins: [tanstackStartCookies()], // lets sign-in from a server function set its cookie, has to stay the last plugin
	database: drizzleAdapter(getDb(), { provider: "pg", schema }),
});
