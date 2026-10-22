import type { BetterAuthErrorCode } from "#/types/auth";

/**
 * Codes of Better Auth errors a form has its own message for. The client knows these
 * codes only as types, `authClient.$ERROR_CODES` does not exist at runtime, so they are
 * written out here and checked against those types - a code renamed in an update of
 * Better Auth fails the typecheck
 */
export const BETTER_AUTH_ERROR_CODES = {
	invalidCredentials: "INVALID_EMAIL_OR_PASSWORD",
	invalidToken: "INVALID_TOKEN", // the link for a password expired or was already used
} as const satisfies Record<string, BetterAuthErrorCode>;

// codes of the errors our own auth rules answer with
export const AUTH_ERROR_CODES = {
	termsNotAccepted: "TERMS_NOT_ACCEPTED",
	signInLimit: "SIGN_IN_LIMIT_REACHED", // too many sign-ins to one address, from whatever IP addresses
} as const;

// how long the link of a sign-up works, in seconds - the emails and the pages say 24 hours
export const SET_PASSWORD_EXPIRES_IN = 24 * 60 * 60;

// where the link of a sign-up opens, Better Auth checks its token on the way
export const SET_PASSWORD_PATH = "/postavi-lozinku";
