import { Alert } from "#/components/feedback/alert";
import { GOOGLE_SIGN_IN_MESSAGES } from "#/config/google-sign-in";
import { getGoogleSignInProblem } from "#/utils/google-sign-in";

type GoogleSignInErrorProps = {
	code?: string; // the code Better Auth returned with from Google
};

// what went wrong on the way through Google, nothing while the address carries no code
export const GoogleSignInError = ({ code }: GoogleSignInErrorProps) => {
	const problem = getGoogleSignInProblem(code);

	if (!problem) {
		return null;
	}

	const message = GOOGLE_SIGN_IN_MESSAGES[problem];
	return (
		<Alert tone={message.tone} title={message.title}>
			{message.text}
		</Alert>
	);
};
