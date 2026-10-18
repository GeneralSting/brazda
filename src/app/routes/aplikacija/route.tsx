import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "#/components/layout/app-shell";
import { useSignOut } from "#/features/auth";
import { getSessionUser } from "#/server/session";
import { readSidebarMode } from "#/utils/sidebar-mode";

/**
 * No screen of the shell opens without a session, the visitor is sent to sign in.
 * The stored width of the sidebar is read here too, before anything renders
 */
const requireSignIn = async () => {
	const user = await getSessionUser();

	if (!user) {
		throw redirect({ to: "/prijava" });
	}
	return { user, sidebarMode: readSidebarMode() };
};

// every route in this folder is rendered inside the application shell
const AppLayout = () => {
	const { user, sidebarMode } = Route.useRouteContext();
	const signOut = useSignOut();

	return (
		<AppShell user={user} sidebarMode={sidebarMode} onSignOut={signOut}>
			<Outlet />
		</AppShell>
	);
};

export const Route = createFileRoute("/aplikacija")({
	beforeLoad: requireSignIn,
	component: AppLayout,
});
