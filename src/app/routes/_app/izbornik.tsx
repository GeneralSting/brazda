import { createFileRoute } from "@tanstack/react-router";
import { MobileMenu } from "#/components/layout/mobile-menu";
import { Page } from "#/components/layout/page";
import { PLACEHOLDER_USER, placeholderSignOut } from "./-placeholder-session";

// the "Izbornik" tab of the mobile tab bar
const MenuPage = () => (
	<Page title="Izbornik">
		<MobileMenu user={PLACEHOLDER_USER} onSignOut={placeholderSignOut} />
	</Page>
);

export const Route = createFileRoute("/_app/izbornik")({
	head: () => ({ meta: [{ title: "Izbornik · Brazda" }] }),
	component: MenuPage,
});
