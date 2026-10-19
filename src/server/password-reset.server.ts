import { sendEmail } from "#/server/email.server";
import type { SendResetPassword } from "#/types/auth";

const SUBJECT = "Nova lozinka za Brazdu";

/**
 * Written by hand with inline styles, since email clients read no stylesheet and no
 * tokens - the colours are those of --primary and --foreground in styles.css
 */
const buildHtml = (url: string) => `
<div style="font-family: system-ui, sans-serif; color: #1d1c19; font-size: 16px; line-height: 24px">
	<p>Zatražena je nova lozinka za vaš račun u Brazdi.</p>
	<p>
		<a href="${url}" style="display: inline-block; padding: 12px 20px; border-radius: 10px; background: #1e5a3c; color: #ffffff; text-decoration: none; font-weight: 600">Postavi novu lozinku</a>
	</p>
	<p>Poveznica vrijedi sat vremena i može se iskoristiti samo jednom.</p>
	<p>Ako niste vi zatražili novu lozinku, zanemarite ovu poruku, vaša lozinka se ne mijenja.</p>
</div>`;

const buildText = (url: string) =>
	[
		"Zatražena je nova lozinka za vaš račun u Brazdi.",
		`Novu lozinku postavite na: ${url}`,
		"Poveznica vrijedi sat vremena i može se iskoristiti samo jednom.",
		"Ako niste vi zatražili novu lozinku, zanemarite ovu poruku, vaša lozinka se ne mijenja.",
	].join("\n\n");

/**
 * Sends the link for a new password. It is not awaited - an answer that waited for
 * the email would be slower for an address with an account and give it away. A
 * failure is only logged, the user gets the same answer either way
 */
export const sendPasswordResetEmail: SendResetPassword = async ({
	user,
	url,
}) => {
	sendEmail({
		to: user.email,
		subject: SUBJECT,
		html: buildHtml(url),
		text: buildText(url),
	}).catch((error: unknown) => {
		console.error("Password reset email was not sent", error);
	});
};
