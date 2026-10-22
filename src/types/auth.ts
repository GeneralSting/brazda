import type { BetterAuthOptions } from "better-auth";
import type { authClient } from "#/services/auth-client";

// every error code Better Auth can answer with, read from the types of its client
export type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;

// what Better Auth calls with the link for a new password
export type SendResetPassword = NonNullable<
	NonNullable<BetterAuthOptions["emailAndPassword"]>["sendResetPassword"]
>;

/**
 * What the page of a password link shows: the form, the password saved, a link
 * Better Auth refused (expired, used or damaged), or a page opened without the link
 */
export type SavePasswordStep =
	| "form"
	| "saved"
	| "link-expired"
	| "link-missing";

// why a link for a password was sent: a new password for an account, or the first one of a new account
export type PasswordLinkPurpose = "reset" | "set";

// what the page of a password link says, one set of texts for each purpose
export type PasswordLinkTexts = {
	intro: string;
	label: string; // the label of the password field
	savedTitle: string;
	savedText: string;
	expiredText: string;
	missingText: string;
	retry: { label: string; to: "/zaboravljena-lozinka" | "/registracija" }; // the way to a new link
};

// what Better Auth calls once a password is saved through a link
export type OnPasswordReset = NonNullable<
	NonNullable<BetterAuthOptions["emailAndPassword"]>["onPasswordReset"]
>;

// what the address of the forgotten password page may carry, the address to type in
export type ForgotPasswordSearch = { email?: string };

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

// the part of an email sign-in the limit per address reads, with the switch of rate limiting
export type SignInContext = {
	path?: string;
	body?: { email?: unknown };
	context: { rateLimit: { enabled: boolean } };
};

// the part of a Better Auth request the terms consent reads, null when the server creates a user on its own
export type SignUpContext = {
	path?: string;
	body?: { acceptTerms?: unknown };
} | null;

// what the page after the link that confirms an email shows
export type EmailVerificationStep =
	| "verified"
	| "expired"
	| "invalid"
	| "missing";

// what Better Auth sends that page: the mark of success from our callback, or its error
export type EmailVerificationSearch = { status?: string; error?: string };
