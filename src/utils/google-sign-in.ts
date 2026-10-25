import {
	GOOGLE_CANCELLED_CODES,
	GOOGLE_EXPIRED_CODES,
} from "#/config/google-sign-in";
import type { GoogleSignInProblem } from "#/types/auth";

// the code Better Auth returned with from Google, read as what the user is told, null without one
export const getGoogleSignInProblem = (
	code: string | undefined,
): GoogleSignInProblem | null => {
	if (!code) {
		return null;
	}

	if (GOOGLE_CANCELLED_CODES.includes(code)) {
		return "cancelled";
	}

	return GOOGLE_EXPIRED_CODES.includes(code) ? "expired" : "failed";
};
