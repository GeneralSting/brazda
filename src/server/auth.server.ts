import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getServerEnv } from "#/config/env.server";
import { RATE_LIMIT_DEFAULT, RATE_LIMIT_RULES } from "#/config/rate-limit";
import { beforeAuthRequest } from "#/server/auth-hooks.server";
import { getDb } from "#/server/db/client.server";
import * as schema from "#/server/db/schema/auth";
import { stampGoogleConsent } from "#/server/google-consent.server";
import { applyGoogleProfile } from "#/server/google-profile.server";
import {
	confirmAddressOnReset,
	sendPasswordResetEmail,
} from "#/server/password-reset.server";
import { rateLimitStorage } from "#/server/rate-limit.server";
import { signUpWithoutPassword } from "#/server/sign-up.server";

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
		disableSignUp: true, // a sign-up goes through /sign-up/request, which sets no password
		requireEmailVerification: true, // no sign-in before the address is confirmed
		revokeSessionsOnPasswordReset: true, // a new password signs out every device, also the one of whoever took the old one
		sendResetPassword: sendPasswordResetEmail,
		onPasswordReset: confirmAddressOnReset,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			prompt: "select_account", // the user picks the account every time, never signed in with the first one unasked
			mapProfileToUser: applyGoogleProfile, // takes over an unfinished email sign-up, fills only an empty name and picture
		},
	},
	verification: { storeIdentifier: "hashed" }, // tokens of links kept as SHA-256, a copy of the database resets no password
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
	hooks: { before: beforeAuthRequest },
	databaseHooks: { user: { create: { before: stampGoogleConsent } } },
	plugins: [signUpWithoutPassword(), tanstackStartCookies()], // the cookie plugin lets sign-in from a server function set its cookie, has to stay the last plugin
	database: drizzleAdapter(getDb(), { provider: "pg", schema }),
});
