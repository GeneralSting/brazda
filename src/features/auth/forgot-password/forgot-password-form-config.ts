import { z } from "zod";
import { EMAIL_FIELD } from "#/config/form-fields";
import { createFormConfig } from "#/utils/form";

// the only field, the address the link for a new password goes to
export const FORGOT_PASSWORD_FORM = createFormConfig({
	email: EMAIL_FIELD,
});

export type ForgotPasswordValues = z.output<typeof FORGOT_PASSWORD_FORM.schema>;

// the same answer for every address, whether it has an account or not
export const FORGOT_PASSWORD_RESPONSE_SCHEMA = z.object({
	status: z.literal(true),
});

// the link in the email leads here, with its token or with the reason it is not valid
export const NEW_PASSWORD_PATH = "/nova-lozinka";

// the reason given when the limit of requests is reached, it opens again within 5 minutes
export const TOO_MANY_REQUESTS =
	"Poslali ste previše zahtjeva. Pričekajte nekoliko minuta pa pokušajte ponovno.";
