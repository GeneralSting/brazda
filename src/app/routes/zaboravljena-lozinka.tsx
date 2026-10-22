import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { AuthPagePrompt } from "#/components/layout/auth-page/auth-page-prompt";
import {
	FORGOT_PASSWORD_SEARCH_SCHEMA,
	ForgotPassword,
} from "#/features/auth/password-link";
import { skipWhenSignedIn } from "#/utils/session";

/**
 * Reached from the sign-in page, or from an email with the address typed in - the
 * link in the email it sends leads on to the new password
 */
const ForgotPasswordPage = () => {
	const search = Route.useSearch();

	return (
		<AuthPage
			title="Zaboravljena lozinka"
			footer={
				<AuthPagePrompt question="Sjetili ste se lozinke?" to="/prijava">
					Prijavite se
				</AuthPagePrompt>
			}
		>
			<ForgotPassword search={search} />
		</AuthPage>
	);
};

export const Route = createFileRoute("/zaboravljena-lozinka")({
	validateSearch: FORGOT_PASSWORD_SEARCH_SCHEMA,
	head: () => ({ meta: [{ title: "Zaboravljena lozinka · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: ForgotPasswordPage,
});
