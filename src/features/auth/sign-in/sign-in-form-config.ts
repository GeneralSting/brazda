import { z } from "zod";
import { EMAIL_FIELD, PASSWORD_FIELD } from "#/lib/form/constants";
import { createFormConfig } from "#/lib/form/utils";

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
