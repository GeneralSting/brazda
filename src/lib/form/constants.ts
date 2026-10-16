import { emailSchema, passwordSchema } from "./schemas";
import type { FieldConfig } from "./types";

// fields shared by the forms of several features, a form picks the ones it needs

export const EMAIL_FIELD = {
	schema: emailSchema,
	defaultValue: "",
} satisfies FieldConfig<typeof emailSchema>;

export const PASSWORD_FIELD = {
	schema: passwordSchema,
	defaultValue: "",
} satisfies FieldConfig<typeof passwordSchema>;
