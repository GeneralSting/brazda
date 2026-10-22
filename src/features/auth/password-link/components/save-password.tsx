import type { NewPasswordSearch, PasswordLinkPurpose } from "#/types/auth";
import { PASSWORD_LINK_TEXTS } from "../config/password-link-config";
import { useSavePasswordForm } from "../hooks/use-save-password-form";
import { SavePasswordDone } from "./save-password-done";
import { SavePasswordForm } from "./save-password-form";
import { SavePasswordLinkExpired } from "./save-password-link-expired";
import { SavePasswordLinkMissing } from "./save-password-link-missing";

type SavePasswordProps = {
	search: NewPasswordSearch; // the address the link from the email opened
	purpose: PasswordLinkPurpose; // a new password for an account, or the first one of a new account
};

// the form while the link works, then the saved password, or what to do about the link
export const SavePassword = ({ search, purpose }: SavePasswordProps) => {
	const { savePasswordForm, formError, step } = useSavePasswordForm(search);
	const texts = PASSWORD_LINK_TEXTS[purpose];

	if (step === "saved") {
		return <SavePasswordDone texts={texts} />;
	}

	if (step === "link-expired") {
		return <SavePasswordLinkExpired texts={texts} />;
	}

	if (step === "link-missing") {
		return <SavePasswordLinkMissing texts={texts} />;
	}

	return (
		<SavePasswordForm form={savePasswordForm} error={formError} texts={texts} />
	);
};
