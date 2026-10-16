import { z } from "zod";

// what the user reads under a field, written as an instruction
const MESSAGES = {
	emailRequired: "Upišite e-poštu.",
	emailInvalid: "E-pošta nije ispravna, npr. ime@primjer.hr.",
	passwordRequired: "Upišite lozinku.",
	passwordTooShort: "Lozinka mora imati najmanje 8 znakova.",
} as const;

export const PASSWORD_MIN_LENGTH = 8;

export const emailSchema = z
	.string()
	.trim()
	.min(1, MESSAGES.emailRequired)
	.pipe(z.email(MESSAGES.emailInvalid));

// the only rule for a password is its length, the same for sign-in and sign-up
export const passwordSchema = z
	.string()
	.min(1, MESSAGES.passwordRequired)
	.min(PASSWORD_MIN_LENGTH, MESSAGES.passwordTooShort);
