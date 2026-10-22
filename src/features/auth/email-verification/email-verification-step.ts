import { BETTER_AUTH_ERROR_CODES } from "#/config/auth";
import type {
	EmailVerificationSearch,
	EmailVerificationStep,
} from "#/types/auth";

/**
 * Reads the address Better Auth returned to: an error wins, our mark of success means
 * the address is confirmed, and with neither the page was not opened from the email
 */
export const getEmailVerificationStep = ({
	status,
	error,
}: EmailVerificationSearch): EmailVerificationStep => {
	if (error === BETTER_AUTH_ERROR_CODES.tokenExpired) {
		return "expired";
	}

	if (error) {
		return "invalid";
	}

	return status === "verified" ? "verified" : "missing";
};
