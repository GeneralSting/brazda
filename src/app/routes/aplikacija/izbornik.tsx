import { createFileRoute } from "@tanstack/react-router";
import { MobileMenu } from "#/components/layout/mobile-menu/mobile-menu";
import { Page } from "#/components/layout/page";
import { useSignOut } from "#/features/auth/sign-out";

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

export const Route = createFileRoute("/aplikacija/izbornik")({
	head: () => ({ meta: [{ title: "Izbornik · Brazda" }] }),
	component: MenuPage,
});
