import { createFileRoute } from "@tanstack/react-router";
import { MobileMenu } from "#/components/layout/mobile-menu";
import { Page } from "#/components/layout/page";
import { useSignOut } from "#/features/auth";

// the "Izbornik" tab of the mobile tab bar, the user comes from the session of the shell
const MenuPage = () => {
	const { user } = Route.useRouteContext();
	const signOut = useSignOut();

	return (
		<Page title="Izbornik">
			<MobileMenu user={user} onSignOut={signOut} />
		</Page>
	);
};

export const Route = createFileRoute("/_app/izbornik")({
	head: () => ({ meta: [{ title: "Izbornik · Brazda" }] }),
	component: MenuPage,
});
