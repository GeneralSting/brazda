import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "#/components/layout/app-shell";
import { useSignOut } from "#/features/auth/sign-out";
import { requireSignIn } from "#/utils/session";
import { readSidebarMode } from "#/utils/sidebar-mode";

// the signed-in user and the stored sidebar width, both ready before anything renders
const loadShellContext = async () => ({
	user: await requireSignIn(),
	sidebarMode: readSidebarMode(),
});

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
	beforeLoad: loadShellContext,
	component: AppLayout,
});
