import { z } from "zod";
import { EMAIL_FIELD } from "#/config/form-fields";
import { createFormConfig } from "#/utils/form";

// the only field, the address the link for a new password goes to
export const FORGOT_PASSWORD_FORM = createFormConfig({
	email: EMAIL_FIELD,
});

export type ForgotPasswordValues = z.output<typeof FORGOT_PASSWORD_FORM.schema>;

// the address a link from one of our emails types in for the user, checked like any typed one on submit
export const FORGOT_PASSWORD_SEARCH_SCHEMA = z.object({
	email: z.string().optional().catch(undefined),
});

// the reason given when the limit of requests is reached, it opens again within 5 minutes
export const TOO_MANY_REQUESTS =
	"Poslali ste previše zahtjeva. Pričekajte nekoliko minuta pa pokušajte ponovno.";
