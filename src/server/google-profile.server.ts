import type { GoogleProfile } from "better-auth/social-providers";
import { and, eq, isNull, notExists, or, sql } from "drizzle-orm";
import { getDb } from "#/server/db/client.server";
import { account, user } from "#/server/db/schema/auth";

/**
 * Better Auth joins Google only to a confirmed account, so an unfinished email
 * sign-up of the same address is confirmed first - Google has just proven the
 * address, and the account has no password yet, so no one else holds a way into it.
 * An unconfirmed account with a password keeps the guard of Better Auth
 */
const confirmUnfinishedSignUp = async (email: string) => {
	const db = getDb();
	const password = db
		.select()
		.from(account)
		.where(
			and(eq(account.userId, user.id), eq(account.providerId, "credential")),
		);

	await db
		.update(user)
		.set({ emailVerified: true })
		.where(
			and(
				eq(user.email, email),
				eq(user.emailVerified, false),
				notExists(password),
			),
		);
};

/**
 * The name and the picture from Google fill only what is still empty - an email
 * sign-up leaves the name empty and no picture, what the user set on their own stays.
 * Only a confirmed account, one Google is let into, an unconfirmed one stays untouched
 */
const fillEmptyProfile = async (email: string, profile: GoogleProfile) => {
	await getDb()
		.update(user)
		.set({
			name: sql`case when ${user.name} = '' then ${profile.name} else ${user.name} end`,
			image: sql`coalesce(${user.image}, ${profile.picture})`,
		})
		.where(
			and(
				eq(user.email, email),
				eq(user.emailVerified, true),
				or(eq(user.name, ""), isNull(user.image)),
			),
		);
};

/**
 * Runs when Google returns with a profile, before Better Auth looks for an account
 * with its address, and only for an address Google has proven. The profile itself
 * is taken over unchanged, a user Google makes gets its name and picture from it
 */
export const applyGoogleProfile = async (profile: GoogleProfile) => {
	if (!profile.email_verified) {
		return {};
	}

	const email = profile.email.toLowerCase();
	await confirmUnfinishedSignUp(email);
	await fillEmptyProfile(email, profile);
	return {};
};
