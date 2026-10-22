import { APIError } from "better-auth/api";
import { AUTH_ERROR_CODES } from "#/config/auth";
import type { SignUpContext } from "#/types/auth";

// the only way in that has the terms box, Google records its consent on its own later
const EMAIL_SIGN_UP_PATH = "/sign-up/email";

const hasAcceptedTerms = (context: SignUpContext) =>
	context?.body?.acceptTerms === true;

/**
 * Refuses an email sign-up without accepted terms. The box of the form is only the
 * first check - a request sent straight to the API skips it and is stopped here
 */
export const requireAcceptedTerms = (context: SignUpContext) => {
	if (context?.path !== EMAIL_SIGN_UP_PATH || hasAcceptedTerms(context)) {
		return;
	}

	throw APIError.from("BAD_REQUEST", {
		code: AUTH_ERROR_CODES.termsNotAccepted,
		message: "The terms of use and the privacy policy have to be accepted",
	});
};

/**
 * Stamps the moment of the consent on the new user, taken from the server clock and
 * never from the request, so it can serve as proof of when the terms were accepted
 */
export const stampTermsAcceptance = async (
	_user: unknown,
	context: SignUpContext,
) => {
	if (context?.path !== EMAIL_SIGN_UP_PATH || !hasAcceptedTerms(context)) {
		return;
	}

	return { data: { termsAcceptedAt: new Date() } };
};
