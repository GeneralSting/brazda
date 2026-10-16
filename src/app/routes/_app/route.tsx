import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "#/components/layout/app-shell";
import { getSessionUser } from "#/server/session";
import { PLACEHOLDER_USER, placeholderSignOut } from "./-placeholder-session";

// no screen of the shell opens without a session, the visitor is sent to sign in
const requireSignIn = async () => {
	const user = await getSessionUser();

	if (!user) {
		throw redirect({ to: "/prijava" });
	}
	return { user };
};

// every route in this folder is rendered inside the application shell
const AppLayout = () => (
	<AppShell user={PLACEHOLDER_USER} onSignOut={placeholderSignOut}>
		<Outlet />
	</AppShell>
);

export const Route = createFileRoute("/_app")({
	beforeLoad: requireSignIn,
	component: AppLayout,
});
