import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "#/components/layout/app-shell";
import { useSignOut } from "#/features/auth";
import { getSessionUser } from "#/server/session";

// no screen of the shell opens without a session, the visitor is sent to sign in
const requireSignIn = async () => {
	const user = await getSessionUser();

	if (!user) {
		throw redirect({ to: "/prijava" });
	}
	return { user };
};

// every route in this folder is rendered inside the application shell
const AppLayout = () => {
	const { user } = Route.useRouteContext();
	const signOut = useSignOut();

	return (
		<AppShell user={user} onSignOut={signOut}>
			<Outlet />
		</AppShell>
	);
};

export const Route = createFileRoute("/_app")({
	beforeLoad: requireSignIn,
	component: AppLayout,
});
