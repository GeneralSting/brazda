import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

// opened from the user menu of the sidebar and from the mobile menu
const SubscriptionPage = () => (
	<Page title="Pretplata">
		<PagePlaceholder
			icon={CreditCard}
			description="Ovdje će biti probno razdoblje, odabrani paket i računi."
		/>
	</Page>
);

export const Route = createFileRoute("/_app/pretplata")({
	head: () => ({ meta: [{ title: "Pretplata · Brazda" }] }),
	component: SubscriptionPage,
});
