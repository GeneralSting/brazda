import type { BetterAuthErrorCode } from "#/types/auth";

/**
 * Codes of Better Auth errors a form has its own message for. The client knows these
 * codes only as types, `authClient.$ERROR_CODES` does not exist at runtime, so they are
 * written out here and checked against those types - a code renamed in an update of
 * Better Auth fails the typecheck
 */
export const BETTER_AUTH_ERROR_CODES = {
	invalidCredentials: "INVALID_EMAIL_OR_PASSWORD",
	emailTaken: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
	invalidToken: "INVALID_TOKEN", // the link for a new password expired or was already used
} as const satisfies Record<string, BetterAuthErrorCode>;

// codes of the errors our own sign-up rules answer with
export const AUTH_ERROR_CODES = {
	termsNotAccepted: "TERMS_NOT_ACCEPTED",
} as const;
