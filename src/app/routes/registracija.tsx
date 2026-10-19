import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { AuthPagePrompt } from "#/components/layout/auth-page/auth-page-prompt";
import { SignUpForm } from "#/features/auth/sign-up";
import { skipWhenSignedIn } from "#/utils/session";

// the first step of a new account, the holding is added in a later step
const SignUpPage = () => (
	<AuthPage
		title="Novi račun"
		footer={
			<AuthPagePrompt question="Već imate račun?" to="/prijava">
				Prijavite se
			</AuthPagePrompt>
		}
	>
		<SignUpForm />
	</AuthPage>
);

export const Route = createFileRoute("/registracija")({
	head: () => ({ meta: [{ title: "Novi račun · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: SignUpPage,
});
