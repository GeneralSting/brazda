import { z } from "zod";
import type { FieldConfig } from "#/types/form";

type FormSchema<TFields extends Record<string, FieldConfig>> = z.ZodObject<{
	[K in keyof TFields]: TFields[K]["schema"];
}>;

type FormDefaultValues<TFields extends Record<string, FieldConfig>> = {
	[K in keyof TFields]: z.input<TFields[K]["schema"]>;
};

/**
 * Joins field configs into one form: the schema of the whole form and its starting
 * values, both typed from the fields, so the names used in the form are checked
 */
export const createFormConfig = <TFields extends Record<string, FieldConfig>>(
	fields: TFields,
) => {
	const entries = Object.entries(fields);

	return {
		schema: z.object(
			Object.fromEntries(entries.map(([name, field]) => [name, field.schema])),
		) as FormSchema<TFields>,
		defaultValues: Object.fromEntries(
			entries.map(([name, field]) => [name, field.defaultValue]),
		) as FormDefaultValues<TFields>,
	};
};
