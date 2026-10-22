import { createEmailVerificationToken } from "better-auth/api";
import {
	EMAIL_VERIFICATION_EXPIRES_IN,
	EMAIL_VERIFIED_CALLBACK,
} from "#/config/auth";
import { getServerEnv } from "#/config/env.server";
import { sendEmailInBackground } from "#/server/email.server";
import { buildActionEmail } from "#/server/email-template.server";
import type { OnExistingUserSignUp, SendVerificationEmail } from "#/types/auth";

/**
 * The link of Better Auth that confirms the address, always leading back to our page.
 * The one Better Auth builds takes the callbackURL of the request, a sign-in without
 * one would send the user to the public page
 */
const buildVerifyUrl = (token: string) => {
	const url = new URL("/api/auth/verify-email", getServerEnv().BETTER_AUTH_URL);
	url.searchParams.set("token", token);
	url.searchParams.set("callbackURL", EMAIL_VERIFIED_CALLBACK);
	return url.toString();
};

// the page of a forgotten password with the address already typed in, it is the one the email goes to
const buildForgotPasswordUrl = (email: string) => {
	const url = new URL("/zaboravljena-lozinka", getServerEnv().BETTER_AUTH_URL);
	url.searchParams.set("email", email);
	return url.toString();
};

const sendVerifyLink = (to: string, token: string) => {
	sendEmailInBackground(
		buildActionEmail({
			to,
			subject: "Potvrdite e-poštu za Brazdu",
			intro: ["Potvrdite svoju e-poštu da biste se mogli prijaviti u Brazdu."],
			action: { label: "Potvrdi e-poštu", url: buildVerifyUrl(token) },
			outro: [
				"Poveznica vrijedi 24 sata.",
				"Ako niste vi napravili račun u Brazdi, zanemarite ovu poruku.",
			],
		}),
	);
};

const sendAccountExists = (to: string) => {
	sendEmailInBackground(
		buildActionEmail({
			to,
			subject: "Već imate račun u Brazdi",
			intro: [
				"Zatražena je registracija u Brazdi s ovom e-poštom. Račun s njom već imate, pa novi nije napravljen.",
				"Ako niste vi zatražili registraciju, zanemarite ovu poruku, s vašim računom se ništa ne mijenja.",
				"Vaša e-pošta je već potvrđena, pa se možete odmah prijaviti.",
			],
			action: {
				label: "Prijavi se",
				url: new URL("/prijava", getServerEnv().BETTER_AUTH_URL).toString(),
			},
			outro: [
				{
					text: "Ako ste zaboravili lozinku, novu možete zatražiti ovdje:",
					link: {
						label: "Zatraži novu lozinku",
						url: buildForgotPasswordUrl(to),
					},
				},
			],
		}),
	);
};

// sent at sign-up and at every sign-in with the right password before the address is confirmed
export const sendVerificationEmail: SendVerificationEmail = async ({
	user,
	token,
}) => {
	sendVerifyLink(user.email, token);
};

/**
 * A sign-up with an address that has an account answers as if it were new, so no one
 * learns which addresses have one - the owner is told here instead: a new link while
 * the address waits for confirmation, otherwise that the account exists
 */
export const handleExistingSignUp: OnExistingUserSignUp = async ({ user }) => {
	if (user.emailVerified) {
		sendAccountExists(user.email);
		return;
	}
	const token = await createEmailVerificationToken(
		getServerEnv().BETTER_AUTH_SECRET,
		user.email,
		undefined,
		EMAIL_VERIFICATION_EXPIRES_IN,
	);
	sendVerifyLink(user.email, token);
};
