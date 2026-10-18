import { redirect } from "@tanstack/react-router";
import { getSessionUser } from "#/server/session";

/**
 * Guard of the application: no screen under /aplikacija opens without a session,
 * the visitor is sent to sign in. Gives the signed-in user to the screens below
 */
export const requireSignIn = async () => {
	const user = await getSessionUser();

	if (!user) {
		throw redirect({ to: "/prijava" });
	}
	return user;
};

/**
 * Guard of the sign-in and sign-up screens: someone already signed in goes to the
 * application. Only a visit rendered by the server is checked - inside the application
 * the one way here with a session is signing out, whose request may still be on its way
 */
export const skipWhenSignedIn = async () => {
	if (import.meta.env.SSR && (await getSessionUser())) {
		throw redirect({ to: "/aplikacija" });
	}
};
