import { z } from "zod";

// every variable the server needs, the list is mirrored in .env.example
const serverEnvSchema = z.object({
	DATABASE_URL_POOLED: z.url(), // pooled connection to Neon, used by the running application
	BETTER_AUTH_SECRET: z.string().min(32), // signs sessions and tokens, never shared or committed
	BETTER_AUTH_URL: z.url(), // address the application is opened at, e.g. http://localhost:3000
	// headers the hosting puts the client IP in, comma separated - empty keeps x-forwarded-for
	AUTH_IP_HEADERS: z
		.string()
		.optional()
		.transform((value) => {
			const headers = value
				?.split(",")
				.map((header) => header.trim().toLowerCase())
				.filter(Boolean);
			return headers?.length ? headers : undefined;
		}),
});

export type ServerEnv = z.output<typeof serverEnvSchema>;

/**
 * Read when it is needed, not when the file loads: on edge runtimes the variables
 * exist only while a request is handled. A missing or wrong variable fails
 * with its name, so a broken setup shows up on the first request
 */
export const getServerEnv = (): ServerEnv => {
	const result = serverEnvSchema.safeParse(process.env);

	if (!result.success) {
		throw new Error(
			`Server environment is not set up:\n${z.prettifyError(result.error)}`,
		);
	}
	return result.data;
};
