import { z } from "zod";
import { EMAIL_FIELD, PASSWORD_FIELD } from "#/config/form-fields";
import { MINUTE } from "#/config/rate-limit";
import { createFormConfig } from "#/utils/form";

// the fields of the sign-in form, the names used in its UI come from here
export const SIGN_IN_FORM = createFormConfig({
	email: EMAIL_FIELD,
	password: PASSWORD_FIELD,
});

export type SignInValues = z.output<typeof SIGN_IN_FORM.schema>;

// what a successful sign-in has to answer with, anything else is not trusted
export const SIGN_IN_RESPONSE_SCHEMA = z.object({
	token: z.string().min(1),
	user: z.object({ id: z.string().min(1), email: z.email() }),
});

// the reason given when the email and password do not belong together
export const CREDENTIALS_MISMATCH =
	"E-pošta i lozinka se ne podudaraju. Provjerite ih i pokušajte ponovno.";

// what the server adds to a refused sign-in of one address, the seconds until its window ends
export const SIGN_IN_LIMIT_SCHEMA = z.object({
	retryAfter: z.number().int().positive(),
});

// the word after a number of minutes, "minuta" for every count without its own form
const PLURAL_RULES = new Intl.PluralRules("hr");
const MINUTE_WORDS: Partial<Record<Intl.LDMLPluralRule, string>> = {
	one: "minutu",
	few: "minute",
	other: "minuta",
};

/**
 * The reason given when one address had too many sign-ins, the wait rounded up to
 * whole minutes, so it is never shorter than the real one
 */
export const buildTooManySignIns = (seconds: number) => {
	const minutes = Math.ceil(seconds / MINUTE);
	const word = MINUTE_WORDS[PLURAL_RULES.select(minutes)] ?? MINUTE_WORDS.other;

	return `Previše pokušaja prijave za ovu e-poštu. Pričekajte ${minutes} ${word} pa pokušajte ponovno.`;
};

// the reason given for the right password on an address not confirmed yet, the sign-in itself sent a new link
export const EMAIL_NOT_CONFIRMED =
	"Prije prijave potvrdite e-poštu. Poslali smo vam novu poveznicu za potvrdu, vrijedi 24 sata.";
