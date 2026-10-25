import type { ReactNode } from "react";
import { AuthPageFooter } from "#/components/layout/auth-page/auth-page-footer";
import { useSignUpForm } from "../use-sign-up-form";
import { SignUpDone } from "./sign-up-done";
import { SignUpForm } from "./sign-up-form";

type SignUpProps = {
	footer: ReactNode; // the way to sign in instead, left out once the message has its own button
	googleError?: string; // the code Google returned with, when the sign-up through it failed
};

// the form until the account is made, then the way on through the email
export const SignUp = ({ footer, googleError }: SignUpProps) => {
	const { signUpForm, formError, signedUpAs } = useSignUpForm();

	if (signedUpAs) {
		return <SignUpDone email={signedUpAs} />;
	}

	return (
		<>
			<SignUpForm
				signUpForm={signUpForm}
				formError={formError}
				googleError={googleError}
			/>
			<AuthPageFooter>{footer}</AuthPageFooter>
		</>
	);
};
