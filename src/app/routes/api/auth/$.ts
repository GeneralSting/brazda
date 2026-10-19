import { createFileRoute } from "@tanstack/react-router";
import { auth } from "#/server/auth.server";

// Better Auth answers every request under /api/auth itself
const handleAuthRequest = ({ request }: { request: Request }) =>
	auth.handler(request);

/**
 * Endpoints of the sign-in (sign-up, sign-in, sign-out, session...). A server
 * route only, it renders no page
 */
export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: handleAuthRequest,
			POST: handleAuthRequest,
		},
	},
});
