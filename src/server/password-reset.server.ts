import { sendEmailInBackground } from "#/server/email.server";
import { buildActionEmail } from "#/server/email-template.server";
import type { SendResetPassword } from "#/types/auth";

/**
 * Sends the link for a new password, not awaited, so the answer is the same for every
 * address. An address not confirmed yet gets nothing, the account first has to prove
 * it - the page tells how, the answer stays the same
 */
export const sendPasswordResetEmail: SendResetPassword = async ({
	user,
	url,
}) => {
	if (!user.emailVerified) {
		return;
	}
	sendEmailInBackground(
		buildActionEmail({
			to: user.email,
			subject: "Nova lozinka za Brazdu",
			intro: ["Zatražena je nova lozinka za vaš račun u Brazdi."],
			action: { label: "Postavi novu lozinku", url },
			outro: [
				"Poveznica vrijedi sat vremena i može se iskoristiti samo jednom.",
				"Ako niste vi zatražili novu lozinku, zanemarite ovu poruku, vaša lozinka se ne mijenja.",
			],
		}),
	);
};
