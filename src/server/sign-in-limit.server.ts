import { APIError } from "better-auth/api";
import { AUTH_ERROR_CODES } from "#/config/auth";
import { SIGN_IN_PER_ADDRESS } from "#/config/rate-limit";
import { rateLimitStorage } from "#/server/rate-limit.server";
import type { SignInContext } from "#/types/auth";

const EMAIL_SIGN_IN_PATH = "/sign-in/email";

// the address as SHA-256, so the table of counts holds no email of anyone
const hashAddress = async (email: string) => {
	const bytes = new TextEncoder().encode(email.trim().toLowerCase());
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return Array.from(new Uint8Array(digest), (byte) =>
		byte.toString(16).padStart(2, "0"),
	).join("");
};

/**
 * Counts every sign-in to one address, from any IP address, and refuses it above the
 * limit before the password is checked. Counted and decided in one step, so a burst
 * of requests sent at once cannot slip past. An address without an account counts
 * the same, the answer tells no one which addresses have one. On only where the
 * limit per IP address is, in production
 */
export const limitSignInsPerAddress = async (context: SignInContext) => {
	const email = context.body?.email;

	if (
		context.path !== EMAIL_SIGN_IN_PATH ||
		!context.context.rateLimit.enabled ||
		typeof email !== "string"
	) {
		return;
	}

	const { allowed, retryAfter } = await rateLimitStorage.consume(
		`sign-in|${await hashAddress(email)}`,
		SIGN_IN_PER_ADDRESS,
	);

	if (!allowed) {
		// the seconds until the window ends, so the form can tell how long to wait
		throw APIError.fromStatus("TOO_MANY_REQUESTS", {
			code: AUTH_ERROR_CODES.signInLimit,
			message: "Too many sign-ins to this address, try again later",
			retryAfter,
		});
	}
};
