import { z } from "zod";
import type { EmailVerificationStep } from "#/types/auth";

// what Better Auth sends back after the link: our mark of success, or the code of its error
export const EMAIL_VERIFICATION_SEARCH_SCHEMA = z.object({
	status: z.string().optional().catch(undefined),
	error: z.string().optional().catch(undefined),
});

/**
 * What each step tells. The way on is always the sign-in - while the address waits,
 * a sign-in with the right password sends a new link by itself
 */
export const EMAIL_VERIFICATION_MESSAGES = {
	verified: {
		tone: "success",
		title: "E-pošta je potvrđena",
		text: "Sada se možete prijaviti.",
	},
	expired: {
		tone: "destructive",
		title: "Poveznica je istekla",
		text: "Poveznica za potvrdu vrijedi 24 sata. Prijavite se i poslat ćemo vam novu.",
	},
	invalid: {
		tone: "destructive",
		title: "Poveznica nije ispravna",
		text: "Otvorite je ponovno iz e-maila ili se prijavite i poslat ćemo vam novu.",
	},
	missing: {
		tone: "warning",
		title: "Otvorite poveznicu iz e-maila",
		text: "E-pošta se potvrđuje poveznicom iz e-maila koji ste dobili nakon registracije.",
	},
} as const satisfies Record<
	EmailVerificationStep,
	{ tone: "success" | "destructive" | "warning"; title: string; text: string }
>;
