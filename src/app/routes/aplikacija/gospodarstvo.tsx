import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

const HoldingPage = () => (
	<Page title="Gospodarstvo">
		<PagePlaceholder
			icon={Users}
			description="Ovdje će biti podaci gospodarstva i članovi s ulogama."
		/>
	</Page>
);

export const Route = createFileRoute("/aplikacija/gospodarstvo")({
	head: () => ({ meta: [{ title: "Gospodarstvo · Brazda" }] }),
	component: HoldingPage,
});
