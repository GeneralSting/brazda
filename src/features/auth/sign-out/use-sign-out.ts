import { useNavigate } from "@tanstack/react-router";
import { authClient } from "#/services/auth-client";

/* The server deletes the session and expires its cookie in one answer, the cookie
   even when the database does not respond. Nothing on the screen waits for it,
   the request finishes in the background while the sign-in page is already open. */
const endSession = async () => {
	try {
		// keepalive lets the request finish even when the tab is closed or reloaded right away
		await authClient.signOut({ fetchOptions: { keepalive: true } });
	} catch {
		// no connection, nothing more can be done from the browser
	}
};

// signing out never waits: the sign-in page opens at once
export const useSignOut = () => {
	const navigate = useNavigate();

	const signOut = () => {
		void endSession();
		void navigate({ to: "/prijava", replace: true });
	};

	return signOut;
};
