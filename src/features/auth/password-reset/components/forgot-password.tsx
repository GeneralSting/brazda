import type { ForgotPasswordSearch } from "#/types/auth";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ForgotPasswordSent } from "./forgot-password-sent";

type ForgotPasswordProps = {
	search: ForgotPasswordSearch; // the address a link from an email may bring
};

// the form until the link is asked for, then what to expect in the inbox
export const ForgotPassword = ({ search }: ForgotPasswordProps) => {
	const { forgotPasswordForm, formError, sentTo, showForm } =
		useForgotPasswordForm(search.email);

	return sentTo ? (
		<ForgotPasswordSent email={sentTo} onRetry={showForm} />
	) : (
		<ForgotPasswordForm form={forgotPasswordForm} error={formError} />
	);
};
