import { createAuthMiddleware } from "better-auth/api";
import { limitSignInsPerAddress } from "#/server/sign-in-limit.server";
import { requireAcceptedTerms } from "#/server/terms-consent.server";

// our rules that run before Better Auth handles a request, each one looks only at its own path
export const beforeAuthRequest = createAuthMiddleware(async (context) => {
	requireAcceptedTerms(context);
	await limitSignInsPerAddress(context);
});
