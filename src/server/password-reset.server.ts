import { eq } from "drizzle-orm";
import { getDb } from "#/server/db/client.server";
import { user as userTable } from "#/server/db/schema/auth";
import { sendEmailInBackground } from "#/server/email.server";
import { buildActionEmail } from "#/server/email-template.server";
import type { OnPasswordReset, SendResetPassword } from "#/types/auth";

/**
 * Sends the link for a new password, not awaited, so the answer is the same for every
 * address. An address not confirmed yet gets it too, saving through it confirms the address
 */
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

/**
 * The link reached the owner of the address, so a password saved through it confirms
 * the address too - a new account gets its first password this way
 */
export const confirmAddressOnReset: OnPasswordReset = async ({ user }) => {
	if (user.emailVerified) {
		return;
	}
	await getDb()
		.update(userTable)
		.set({ emailVerified: true })
		.where(eq(userTable.id, user.id));
};
