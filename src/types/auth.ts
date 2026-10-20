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
