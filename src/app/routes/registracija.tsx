import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { AuthPagePrompt } from "#/components/layout/auth-page/auth-page-prompt";
import { SignUp } from "#/features/auth/sign-up";
import { GOOGLE_SIGN_IN_SEARCH_SCHEMA } from "#/schemas/google-sign-in";
import { skipWhenSignedIn } from "#/utils/session";

// the first step of a new account, the holding is added in a later step
const SignUpPage = () => {
	const { error } = Route.useSearch();

	return (
		<AuthPage title="Novi račun">
			<SignUp
				googleError={error}
				footer={
					<AuthPagePrompt question="Već imate račun?" to="/prijava">
						Prijavite se
					</AuthPagePrompt>
				}
			/>
		</AuthPage>
	);
};

export const Route = createFileRoute("/registracija")({
	validateSearch: GOOGLE_SIGN_IN_SEARCH_SCHEMA,
	head: () => ({ meta: [{ title: "Novi račun · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: SignUpPage,
});
