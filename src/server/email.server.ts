import { getServerEnv } from "#/config/env.server";
import type { Email } from "#/types/email";

const RESEND_URL = "https://api.resend.com/emails";

// in development the email is only printed, so every link can be opened from the terminal
const printEmail = (email: Email) => {
	console.info(`\n[email] to ${email.to}: ${email.subject}\n${email.text}\n`);
};

/**
 * Sends an email through Resend. Without RESEND_API_KEY it is printed in development
 * and refused in production, so a missing key never hides lost emails
 */
export const sendEmail = async (email: Email) => {
	const { RESEND_API_KEY, EMAIL_FROM } = getServerEnv();

	if (!RESEND_API_KEY) {
		if (import.meta.env.DEV) {
			printEmail(email);
			return;
		}
		throw new Error(
			`RESEND_API_KEY is not set, "${email.subject}" was not sent`,
		);
	}

	const response = await fetch(RESEND_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ from: EMAIL_FROM, ...email, to: [email.to] }),
	});

	if (!response.ok) {
		throw new Error(
			`Resend refused "${email.subject}" with ${response.status}: ${await response.text()}`,
		);
	}
};
