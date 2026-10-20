import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ForgotPasswordSent } from "./forgot-password-sent";

// the form until the link is asked for, then what to expect in the inbox
export const ForgotPassword = () => {
	const { forgotPasswordForm, formError, sentTo, showForm } =
		useForgotPasswordForm();

	return sentTo ? (
		<ForgotPasswordSent email={sentTo} onRetry={showForm} />
	) : (
		<ForgotPasswordForm form={forgotPasswordForm} error={formError} />
	);
};
