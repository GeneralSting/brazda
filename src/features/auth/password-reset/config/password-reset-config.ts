import { z } from "zod";

// the link in the email leads here, with its token or with the reason it is not valid
export const NEW_PASSWORD_PATH = "/nova-lozinka";

/**
 * What the link from the email brings to the page. The link goes to Better Auth
 * first, which checks the token - a valid one comes with the token, an expired, used
 * or damaged one with error=INVALID_TOKEN and no token
 */
export const NEW_PASSWORD_SEARCH_SCHEMA = z.object({
	token: z.string().optional().catch(undefined),
	error: z.string().optional().catch(undefined),
});

// both steps answer only that the request went through, anything else is not trusted
export const PASSWORD_RESET_RESPONSE_SCHEMA = z.object({
	status: z.literal(true),
});
