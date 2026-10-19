import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { AuthPagePrompt } from "#/components/layout/auth-page/auth-page-prompt";
import { ForgotPassword } from "#/features/auth/forgot-password";
import { skipWhenSignedIn } from "#/utils/session";

// reached from the sign-in page, the link in the email leads on to the new password
const ForgotPasswordPage = () => (
	<AuthPage
		title="Zaboravljena lozinka"
		footer={
			<AuthPagePrompt question="Sjetili ste se lozinke?" to="/prijava">
				Prijavite se
			</AuthPagePrompt>
		}
	>
		<ForgotPassword />
	</AuthPage>
);

export const Route = createFileRoute("/zaboravljena-lozinka")({
	head: () => ({ meta: [{ title: "Zaboravljena lozinka · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: ForgotPasswordPage,
});
