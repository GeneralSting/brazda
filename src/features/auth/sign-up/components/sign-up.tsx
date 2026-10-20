import { useSignUpForm } from "../use-sign-up-form";
import { SignUpDone } from "./sign-up-done";
import { SignUpForm } from "./sign-up-form";

// the form until the account is made, then the way on through the email
export const SignUp = () => {
	const { signUpForm, formError, signedUpAs } = useSignUpForm();

	return signedUpAs ? (
		<SignUpDone email={signedUpAs} />
	) : (
		<SignUpForm signUpForm={signUpForm} formError={formError} />
	);
};
