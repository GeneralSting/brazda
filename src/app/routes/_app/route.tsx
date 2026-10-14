import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "#/components/layout/app-shell";
import { PLACEHOLDER_USER, placeholderSignOut } from "./-placeholder-session";

// every route in this folder is rendered inside the application shell
const AppLayout = () => (
	<AppShell user={PLACEHOLDER_USER} onSignOut={placeholderSignOut}>
		<Outlet />
	</AppShell>
);

export const Route = createFileRoute("/_app")({ component: AppLayout });
