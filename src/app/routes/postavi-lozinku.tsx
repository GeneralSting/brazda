import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import {
	NEW_PASSWORD_SEARCH_SCHEMA,
	ResetPassword,
} from "#/features/auth/password-reset";

/**
 * Opened from the link a sign-up sends, the first password of a new account, which
 * also confirms its address. Not closed to a signed-in user, like the page of a new password
 */
const SetPasswordPage = () => {
	const search = Route.useSearch();

	return (
		<AuthPage title="Postavite lozinku">
			<ResetPassword search={search} purpose="set" />
		</AuthPage>
	);
};

export const Route = createFileRoute("/postavi-lozinku")({
	validateSearch: NEW_PASSWORD_SEARCH_SCHEMA,
	head: () => ({ meta: [{ title: "Postavite lozinku · Brazda" }] }),
	component: SetPasswordPage,
});
