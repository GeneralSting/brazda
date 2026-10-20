import type { NewPasswordSearch } from "#/types/auth";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";
import { ResetPasswordChanged } from "./reset-password-changed";
import { ResetPasswordForm } from "./reset-password-form";
import { ResetPasswordLinkExpired } from "./reset-password-link-expired";
import { ResetPasswordLinkMissing } from "./reset-password-link-missing";

type ResetPasswordProps = {
	search: NewPasswordSearch; // the address the link from the email opened
};

// the form while the link works, then the saved password, or what to do about the link
export const ResetPassword = ({ search }: ResetPasswordProps) => {
	const { resetPasswordForm, formError, step } = useResetPasswordForm(search);

	if (step === "changed") {
		return <ResetPasswordChanged />;
	}

	if (step === "link-expired") {
		return <ResetPasswordLinkExpired />;
	}

	if (step === "link-missing") {
		return <ResetPasswordLinkMissing />;
	}

	return <ResetPasswordForm form={resetPasswordForm} error={formError} />;
};
