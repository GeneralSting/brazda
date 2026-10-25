import type { GoogleSignInProblem } from "#/types/auth";

// the user pressed "Cancel" on the page of Google
export const GOOGLE_CANCELLED_CODES = ["access_denied"];

/**
 * The attempt ran out - longer than 5 minutes at Google (the cookie that ties it to
 * the browser lasts that long), started in one browser and finished in another, or a
 * step repeated with the back button
 */
export const GOOGLE_EXPIRED_CODES = [
	"state_mismatch",
	"state_not_found",
	"please_restart_the_process",
	"invalid_code",
	"no_code",
];

// worded for the sign-in and the sign-up page alike, every unknown code is a failure
export const GOOGLE_SIGN_IN_MESSAGES = {
	cancelled: {
		tone: "warning",
		title: "Google je prekinut",
		text: "Pokušajte ponovno ili upišite e-poštu.",
	},
	expired: {
		tone: "destructive",
		title: "Google veza je istekla",
		text: "Pokušajte ponovno.",
	},
	failed: {
		tone: "destructive",
		title: "Nastavak s Googleom nije uspio",
		text: "Pokušajte ponovno ili upišite e-poštu.",
	},
} as const satisfies Record<
	GoogleSignInProblem,
	{ tone: "warning" | "destructive"; title: string; text: string }
>;
