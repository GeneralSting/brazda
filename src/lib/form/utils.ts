import { z } from "zod";
import type { FieldConfig } from "./types";

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

// what the user reads above the submit button when a request fails, whatever the form
export const REQUEST_MESSAGES = {
	noResponse:
		"Poslužitelj ne odgovara. Provjerite vezu s internetom i pokušajte ponovno.",
	tooManyAttempts: "Previše pokušaja. Pričekajte minutu pa pokušajte ponovno.",
	serverError: "Greška na poslužitelju. Pokušajte ponovno za nekoliko minuta.",
	unexpected: "Nešto je pošlo po krivu. Pokušajte ponovno.",
} as const;

export type RequestFailure = {
	status: number;
	code?: string;
};

// the general reason of a failed request, a form adds its own reasons on top
export const getRequestErrorMessage = (failure: RequestFailure) => {
	if (failure.status === 0) {
		return REQUEST_MESSAGES.noResponse;
	}
	if (failure.status === 429) {
		return REQUEST_MESSAGES.tooManyAttempts;
	}
	if (failure.status >= 500) {
		return REQUEST_MESSAGES.serverError;
	}
	return REQUEST_MESSAGES.unexpected;
};

/**
 * Checks that the server answered with what the form expects. A different shape is
 * logged for us and reported to the user as an unexpected failure, never trusted
 */
export const parseResponse = <TSchema extends z.ZodType>(
	schema: TSchema,
	data: unknown,
): z.output<TSchema> | null => {
	const result = schema.safeParse(data);

	if (!result.success) {
		console.error(
			`Server response does not match the expected shape:\n${z.prettifyError(result.error)}`,
		);
		return null;
	}
	return result.data;
};
