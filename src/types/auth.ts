import type { BetterAuthOptions } from "better-auth";
import type { authClient } from "#/services/auth-client";

// every error code Better Auth can answer with, read from the types of its client
export type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;

// what Better Auth calls with the link for a new password
export type SendResetPassword = NonNullable<
	NonNullable<BetterAuthOptions["emailAndPassword"]>["sendResetPassword"]
>;

/**
 * What the page of a new password shows: the form, the new password saved, a link
 * Better Auth refused (expired, used or damaged), or a page opened without the link
 */
export type ResetPasswordStep =
	| "form"
	| "changed"
	| "link-expired"
	| "link-missing";

// what the address of the new password page carries, the token and the refusal of Better Auth
export type NewPasswordSearch = { token?: string; error?: string };

// what Better Auth calls with the link that confirms an email
export type SendVerificationEmail = NonNullable<
	NonNullable<BetterAuthOptions["emailVerification"]>["sendVerificationEmail"]
>;

// what Better Auth calls when someone signs up with an address that has an account
export type OnExistingUserSignUp = NonNullable<
	NonNullable<BetterAuthOptions["emailAndPassword"]>["onExistingUserSignUp"]
>;

// what the page after the link that confirms an email shows
export type EmailVerificationStep =
	| "verified"
	| "expired"
	| "invalid"
	| "missing";

// what Better Auth sends that page: the mark of success from our callback, or its error
export type EmailVerificationSearch = { status?: string; error?: string };
