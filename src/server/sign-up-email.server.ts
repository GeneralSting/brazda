import { getServerEnv } from "#/config/env.server";
import { sendEmailInBackground } from "#/server/email.server";
import { buildActionEmail } from "#/server/email-template.server";

// the page of a forgotten password with the address already typed in, it is the one the email goes to
const buildForgotPasswordUrl = (email: string) => {
	const url = new URL("/zaboravljena-lozinka", getServerEnv().BETTER_AUTH_URL);
	url.searchParams.set("email", email);
	return url.toString();
};

// a new address, or one whose owner never set a password - the link sets it and confirms the address
export const sendSetPasswordLink = (to: string, url: string) => {
	sendEmailInBackground(
		buildActionEmail({
			to,
			subject: "Dovršite registraciju u Brazdi",
			intro: [
				"Zatražena je registracija u Brazdi s ovom e-poštom. Postavite lozinku i vaš račun je spreman.",
			],
			action: { label: "Postavi lozinku", url },
			outro: [
				"Poveznica vrijedi 24 sata i može se iskoristiti samo jednom.",
				"Ako niste vi zatražili registraciju, zanemarite ovu poruku, bez lozinke se račun ne može koristiti.",
			],
		}),
	);
};

// the address has an account already, no new one is made and nothing about it changes
export const sendAccountExists = (to: string) => {
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
