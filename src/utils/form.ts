import { z } from "zod";
import type { FieldConfig, FormDefaultValues, FormSchema } from "#/types/form";

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

// the first message of a schema issue or a plain string, whatever the validator returned
export const getErrorMessage = (errors: unknown[]) => {
	const [first] = errors;

	if (typeof first === "string") {
		return first;
	}

	if (first && typeof first === "object" && "message" in first) {
		return String(first.message);
	}

	return undefined;
};
