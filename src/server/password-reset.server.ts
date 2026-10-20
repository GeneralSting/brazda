import { sendEmailInBackground } from "#/server/email.server";
import { buildActionEmail } from "#/server/email-template.server";
import type { SendResetPassword } from "#/types/auth";

// sends the link for a new password, not awaited, so the answer is the same for every address
export const sendPasswordResetEmail: SendResetPassword = async ({
	user,
	url,
}) => {
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
