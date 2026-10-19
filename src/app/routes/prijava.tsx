import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { AuthPagePrompt } from "#/components/layout/auth-page/auth-page-prompt";
import { SignInForm } from "#/features/auth/sign-in";
import { skipWhenSignedIn } from "#/utils/session";

// outside the shell, the sidebar means nothing before the user is signed in
const SignInPage = () => (
	<AuthPage
		title="Prijava"
		footer={
			<AuthPagePrompt question="Prvi put ste ovdje?" to="/registracija">
				Napravite račun
			</AuthPagePrompt>
		}
	>
		<SignInForm />
	</AuthPage>
);

export const Route = createFileRoute("/prijava")({
	head: () => ({ meta: [{ title: "Prijava · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: SignInPage,
});
