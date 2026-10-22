import type { NewPasswordSearch, PasswordLinkPurpose } from "#/types/auth";
import { PASSWORD_LINK_TEXTS } from "../config/password-reset-config";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";
import { ResetPasswordChanged } from "./reset-password-changed";
import { ResetPasswordForm } from "./reset-password-form";
import { ResetPasswordLinkExpired } from "./reset-password-link-expired";
import { ResetPasswordLinkMissing } from "./reset-password-link-missing";

type ResetPasswordProps = {
	search: NewPasswordSearch; // the address the link from the email opened
	purpose: PasswordLinkPurpose; // a new password for an account, or the first one of a new account
};

// the form while the link works, then the saved password, or what to do about the link
export const ResetPassword = ({ search, purpose }: ResetPasswordProps) => {
	const { resetPasswordForm, formError, step } = useResetPasswordForm(search);
	const texts = PASSWORD_LINK_TEXTS[purpose];

	if (step === "changed") {
		return <ResetPasswordChanged texts={texts} />;
	}

	if (step === "link-expired") {
		return <ResetPasswordLinkExpired texts={texts} />;
	}

	if (step === "link-missing") {
		return <ResetPasswordLinkMissing texts={texts} />;
	}

	return (
		<ResetPasswordForm
			form={resetPasswordForm}
			error={formError}
			texts={texts}
		/>
	);
};
