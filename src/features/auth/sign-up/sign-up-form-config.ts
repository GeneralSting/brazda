import { z } from "zod";
import { EMAIL_FIELD } from "#/config/form-fields";
import type { FieldConfig } from "#/types/form";
import { createFormConfig } from "#/utils/form";

// what the user reads under the box of the consent, written as an instruction
const TERMS_REQUIRED = "Prihvatite Uvjete korištenja i Politiku privatnosti.";

// the form can be sent unchecked, it then fails with the message under the box
const termsSchema = z.boolean().refine((accepted) => accepted, TERMS_REQUIRED);

const TERMS_FIELD = {
	schema: termsSchema,
	defaultValue: false,
} satisfies FieldConfig<typeof termsSchema>;

/**
 * The fields of the sign-up form, the names used in its UI come from here. No
 * password, it is set through the link in the email, and no name, the user sets it
 * in the profile when they want
 */
export const SIGN_UP_FORM = createFormConfig({
	email: EMAIL_FIELD,
	acceptTerms: TERMS_FIELD,
});

export type SignUpValues = z.output<typeof SIGN_UP_FORM.schema>;

// an address that has an account answers the same, the owner is told by email instead
export const SIGN_UP_RESPONSE_SCHEMA = z.object({
	status: z.literal(true),
});

// the reason given when the server refuses the sign-up because the terms were not accepted
export const TERMS_REFUSED = TERMS_REQUIRED;
