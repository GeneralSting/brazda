import type { AuthHookContext } from "#/types/auth";

// where Google returns after the sign-in, the only place it makes a user
const OAUTH_CALLBACK_PATH = "/callback/:id";

/**
 * Stamps the consent on a user Google makes - the click on the button is the consent,
 * the text under it says so on both pages. Taken from the server clock, like the
 * consent of an email sign-up, an existing user who links Google keeps their own
 */
export const stampGoogleConsent = async (
	_user: unknown,
	context: AuthHookContext,
) => {
	if (context?.path !== OAUTH_CALLBACK_PATH) {
		return;
	}

	return { data: { termsAcceptedAt: new Date() } };
};
