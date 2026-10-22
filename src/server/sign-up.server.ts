import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { generateRandomString } from "better-auth/crypto";
import { z } from "zod";
import {
	AUTH_ERROR_CODES,
	SET_PASSWORD_EXPIRES_IN,
	SET_PASSWORD_PATH,
} from "#/config/auth";
import {
	sendAccountExists,
	sendSetPasswordLink,
} from "#/server/sign-up-email.server";

const SIGN_UP_BODY = z.object({ email: z.email(), acceptTerms: z.boolean() });

/**
 * The link that sets the first password, made like the one of a reset - Better Auth
 * checks its token on the way to our page and saves the password, which confirms the address.
 * "reset-password" in the path is the name of that endpoint of Better Auth, the user
 * lands on /postavi-lozinku and never sees a reset
 */
const buildSetPasswordUrl = (baseURL: string, token: string) =>
	`${baseURL}/reset-password/${token}?callbackURL=${encodeURIComponent(SET_PASSWORD_PATH)}`;

/**
 * A sign-up asks only for the address and the consent, the password comes through the
 * link, so no one sets a password on an address they do not own. The answer is the
 * same for every address, the owner learns the rest by email: a link to set the
 * password, or that the account exists
 */
export const signUpWithoutPassword = () =>
	({
		id: "sign-up-without-password",
		endpoints: {
			requestSignUp: createAuthEndpoint(
				"/sign-up/request",
				{ method: "POST", body: SIGN_UP_BODY },
				async (context) => {
					if (!context.body.acceptTerms) {
						throw APIError.from("BAD_REQUEST", {
							code: AUTH_ERROR_CODES.termsNotAccepted,
							message:
								"The terms of use and the privacy policy have to be accepted",
						});
					}

					const email = context.body.email.toLowerCase();
					const { internalAdapter } = context.context;
					const found = await internalAdapter.findUserByEmail(email);

					if (found?.user.emailVerified) {
						sendAccountExists(email);
						return context.json({ status: true });
					}

					// the moment of the consent from the server clock, the name is set in the profile
					const user =
						found?.user ??
						(await internalAdapter.createUser(
							{
								email,
								name: "",
								emailVerified: false,
								termsAcceptedAt: new Date(),
							},
							{ method: "email-password" },
						));
					const token = generateRandomString(24, "a-z", "A-Z", "0-9");
					// the prefix of a reset token, the only one the endpoint saving a password accepts
					await internalAdapter.createVerificationValue({
						identifier: `reset-password:${token}`,
						value: user.id,
						expiresAt: new Date(Date.now() + SET_PASSWORD_EXPIRES_IN * 1000),
					});
					sendSetPasswordLink(
						email,
						buildSetPasswordUrl(context.context.baseURL, token),
					);
					return context.json({ status: true });
				},
			),
		},
	}) satisfies BetterAuthPlugin;
