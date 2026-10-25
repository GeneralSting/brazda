import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { AuthPagePrompt } from "#/components/layout/auth-page/auth-page-prompt";
import { SignInForm } from "#/features/auth/sign-in";
import { GOOGLE_SIGN_IN_SEARCH_SCHEMA } from "#/schemas/google-sign-in";
import { skipWhenSignedIn } from "#/utils/session";

// outside the shell, the sidebar means nothing before the user is signed in
const SignInPage = () => {
	const { error } = Route.useSearch();

	return (
		<AuthPage
			title="Prijava"
			footer={
				<AuthPagePrompt question="Prvi put ste ovdje?" to="/registracija">
					Napravite račun
				</AuthPagePrompt>
			}
		>
			<SignInForm googleError={error} />
		</AuthPage>
	);
};

export const Route = createFileRoute("/prijava")({
	validateSearch: GOOGLE_SIGN_IN_SEARCH_SCHEMA,
	head: () => ({ meta: [{ title: "Prijava · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: SignInPage,
});
