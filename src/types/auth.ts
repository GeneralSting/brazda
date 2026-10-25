import type { BetterAuthOptions } from "better-auth";
import type { authClient } from "#/services/auth-client";

// every error code Better Auth can answer with, read from the types of its client
export type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;

// the error body of an auth endpoint, typed by hand for our own endpoints, which the client does not know
export type AuthRequestError = { code?: string; message?: string };

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

// the part of an email sign-in the limit per address reads, with the switch of rate limiting
export type SignInContext = {
	path?: string;
	body?: { email?: unknown };
	context: { rateLimit: { enabled: boolean } };
};

// the part of a Better Auth request a database hook reads, null when the server writes on its own
export type AuthHookContext = { path?: string } | null;

// the auth page a Google sign-in starts on, Google returns there when it fails
export type GoogleSignInPage = "/prijava" | "/registracija";

// what went wrong on the way through Google: the user stopped, the attempt ran out, or anything else
export type GoogleSignInProblem = "cancelled" | "expired" | "failed";

// what an auth page reads from its address, the code Better Auth returns with from Google
export type GoogleSignInSearch = { error?: string };
