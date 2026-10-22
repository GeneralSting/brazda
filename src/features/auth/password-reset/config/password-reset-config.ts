import { z } from "zod";
import type { PasswordLinkPurpose, PasswordLinkTexts } from "#/types/auth";

// the link in the email leads here, with its token or with the reason it is not valid
export const NEW_PASSWORD_PATH = "/nova-lozinka";

/**
 * What the link from the email brings to the page. The link goes to Better Auth
 * first, which checks the token - a valid one comes with the token, an expired, used
 * or damaged one with error=INVALID_TOKEN and no token
 */
export const NEW_PASSWORD_SEARCH_SCHEMA = z.object({
	token: z.string().optional().catch(undefined),
	error: z.string().optional().catch(undefined),
});

// both steps answer only that the request went through, anything else is not trusted
export const PASSWORD_RESET_RESPONSE_SCHEMA = z.object({
	status: z.literal(true),
});

/**
 * What the page of a password link says. A reset gives an account a new password, a
 * set gives a new account its first one - both save it through the same link, which
 * proves the address, so saving also confirms it
 */
export const PASSWORD_LINK_TEXTS = {
	reset: {
		intro:
			"Upišite novu lozinku za svoj račun. Kad je spremite, bit ćete odjavljeni sa svih uređaja.",
		label: "Nova lozinka",
		savedTitle: "Lozinka je promijenjena",
		savedText:
			"Odjavljeni ste sa svih uređaja na kojima ste bili prijavljeni. Prijavite se novom lozinkom.",
		expiredText:
			"Poveznica za novu lozinku vrijedi sat vremena i može se iskoristiti samo jednom. Zatražite novu.",
		missingText:
			"Nova lozinka postavlja se samo preko poveznice iz e-maila koji ste dobili.",
		retry: { label: "Zatraži novu poveznicu", to: "/zaboravljena-lozinka" },
	},
	set: {
		intro:
			"Upišite lozinku kojom ćete se prijavljivati u Brazdu. Kad je spremite, vaša e-pošta je potvrđena.",
		label: "Lozinka",
		savedTitle: "Račun je spreman",
		savedText:
			"Lozinka je spremljena i e-pošta potvrđena. Sada se možete prijaviti.",
		expiredText:
			"Poveznica za lozinku vrijedi 24 sata i može se iskoristiti samo jednom. Registrirajte se ponovno istom adresom i poslat ćemo vam novu.",
		missingText:
			"Lozinka se postavlja samo preko poveznice iz e-maila koji ste dobili nakon registracije.",
		retry: { label: "Registriraj se ponovno", to: "/registracija" },
	},
} as const satisfies Record<PasswordLinkPurpose, PasswordLinkTexts>;
