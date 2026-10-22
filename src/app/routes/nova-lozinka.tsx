import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import {
	NEW_PASSWORD_SEARCH_SCHEMA,
	ResetPassword,
} from "#/features/auth/password-reset";

/**
 * Opened from the link in the email. Not closed to a signed-in user, the link may be
 * opened in a browser that is still signed in, and saving signs it out anyway
 */
const NewPasswordPage = () => {
	const search = Route.useSearch();

	return (
		<AuthPage title="Nova lozinka">
			<ResetPassword search={search} purpose="reset" />
		</AuthPage>
	);
};

export const Route = createFileRoute("/nova-lozinka")({
	validateSearch: NEW_PASSWORD_SEARCH_SCHEMA,
	head: () => ({ meta: [{ title: "Nova lozinka · Brazda" }] }),
	component: NewPasswordPage,
});
