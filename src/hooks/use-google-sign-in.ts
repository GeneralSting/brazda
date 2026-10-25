import { useEffect, useState } from "react";
import { authClient } from "#/services/auth-client";
import type { GoogleSignInPage } from "#/types/auth";

/**
 * Sends the browser to Google, which returns it to the application, or to the page it
 * started on when something fails there, with the code in its address. The button
 * waits until the page is left, a request that fails before that, or a way back to
 * the page, lets it be pressed again
 */
export const useGoogleSignIn = (errorPage: GoogleSignInPage) => {
	const [pending, setPending] = useState(false);

	const signInWithGoogle = async () => {
		setPending(true);

		try {
			const { error } = await authClient.signIn.social({
				provider: "google",
				callbackURL: "/aplikacija",
				errorCallbackURL: errorPage,
			});

			if (error) {
				setPending(false);
			}
		} catch {
			setPending(false); // the request never reached the server or got no answer
		}
	};

	// the back button can restore the page from the cache of the browser, frozen as it was left
	useEffect(() => {
		const handlePageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				setPending(false);
			}
		};

		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, []);

	return { signInWithGoogle, pending };
};
