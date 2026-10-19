import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

// opened from the user menu of the sidebar and from the mobile menu
const ProfilePage = () => (
	<Page title="Profil">
		<PagePlaceholder
			icon={UserRound}
			description="Ovdje će biti Vaši podaci, gospodarstvo i postavke aplikacije."
		/>
	</Page>
);

export const Route = createFileRoute("/aplikacija/profil")({
	head: () => ({ meta: [{ title: "Profil · Brazda" }] }),
	component: ProfilePage,
});
