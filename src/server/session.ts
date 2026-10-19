import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/server/auth.server";
import type { SessionUser } from "#/types/user";

/**
 * The signed-in person read from the session cookie, null without a session.
 * A server function, so the browser can call it on every navigation - only the
 * fields the application needs leave the server, never the session token
 */
export const getSessionUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<SessionUser | null> => {
		const session = await auth.api.getSession({ headers: getRequestHeaders() });

		if (!session) {
			return null;
		}

		const { id, name, email } = session.user;
		return { id, name, email };
	},
);
