import type { z } from "zod";
import { PASSWORD_FIELD } from "#/config/form-fields";
import { createFormConfig } from "#/utils/form";

// the only field, the new password, with the same rule as at sign-up
export const SAVE_PASSWORD_FORM = createFormConfig({
	password: PASSWORD_FIELD,
});

export type SavePasswordValues = z.output<typeof SAVE_PASSWORD_FORM.schema>;
