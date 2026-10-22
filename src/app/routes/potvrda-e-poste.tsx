import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import {
	EMAIL_VERIFICATION_SEARCH_SCHEMA,
	EmailVerification,
} from "#/features/auth/email-verification";

// Better Auth returns here from the link in the email, once the address is checked
const EmailVerificationPage = () => {
	const search = Route.useSearch();

	return (
		<AuthPage title="Potvrda e-pošte">
			<EmailVerification search={search} />
		</AuthPage>
	);
};

export const Route = createFileRoute("/potvrda-e-poste")({
	validateSearch: EMAIL_VERIFICATION_SEARCH_SCHEMA,
	head: () => ({ meta: [{ title: "Potvrda e-pošte · Brazda" }] }),
	component: EmailVerificationPage,
});
