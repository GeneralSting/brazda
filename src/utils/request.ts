import { z } from "zod";

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
