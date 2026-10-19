import { z } from "zod";
import { EMAIL_FIELD, PASSWORD_FIELD } from "#/config/form-fields";
import type { FieldConfig } from "#/types/form";
import { createFormConfig } from "#/utils/form";

// what the user reads under a field of this form, written as an instruction
const MESSAGES = {
	nameRequired: "Upišite ime i prezime.",
	termsRequired: "Prihvatite Uvjete korištenja i Politiku privatnosti.",
} as const;

const nameSchema = z.string().trim().min(1, MESSAGES.nameRequired);
// the form can be sent unchecked, it then fails with the message under the box
const termsSchema = z
	.boolean()
	.refine((accepted) => accepted, MESSAGES.termsRequired);

const NAME_FIELD = {
	schema: nameSchema,
	defaultValue: "",
} satisfies FieldConfig<typeof nameSchema>;

const TERMS_FIELD = {
	schema: termsSchema,
	defaultValue: false,
} satisfies FieldConfig<typeof termsSchema>;

// the fields of the sign-up form, the names used in its UI come from here
export const SIGN_UP_FORM = createFormConfig({
	name: NAME_FIELD,
	email: EMAIL_FIELD,
	password: PASSWORD_FIELD,
	acceptTerms: TERMS_FIELD,
});

export type SignUpValues = z.output<typeof SIGN_UP_FORM.schema>;

// a new account is signed in at once, so the answer carries the session token
export const SIGN_UP_RESPONSE_SCHEMA = z.object({
	token: z.string().min(1),
	user: z.object({ id: z.string().min(1), email: z.email() }),
});

// the reason given when the server refuses the sign-up because the terms were not accepted
export const TERMS_REFUSED = MESSAGES.termsRequired;

// the reason given when an account with the email already exists
export const EMAIL_TAKEN =
	"Račun s ovom e-poštom već postoji. Prijavite se ili upišite drugu e-poštu.";
