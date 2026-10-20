import type { BetterAuthErrorCode } from "#/types/auth";

/**
 * Codes of Better Auth errors a form has its own message for. The client knows these
 * codes only as types, `authClient.$ERROR_CODES` does not exist at runtime, so they are
 * written out here and checked against those types - a code renamed in an update of
 * Better Auth fails the typecheck
 */
export const BETTER_AUTH_ERROR_CODES = {
	invalidCredentials: "INVALID_EMAIL_OR_PASSWORD",
	invalidToken: "INVALID_TOKEN", // the link for a new password expired or was already used
	tokenExpired: "TOKEN_EXPIRED", // the link that confirms an email is older than its 24 hours
} as const satisfies Record<string, BetterAuthErrorCode>;

// codes of the errors our own sign-up rules answer with
export const AUTH_ERROR_CODES = {
	termsNotAccepted: "TERMS_NOT_ACCEPTED",
} as const;

// how long a link that confirms an email works, in seconds - the emails and the pages say 24 hours
export const EMAIL_VERIFICATION_EXPIRES_IN = 24 * 60 * 60;

// where Better Auth returns after confirming an email, it appends error= when that fails
export const EMAIL_VERIFIED_CALLBACK = "/potvrda-e-poste?status=verified";
