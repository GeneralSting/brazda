import { createFileRoute } from "@tanstack/react-router";
import { MapIcon } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

const ParcelsPage = () => (
	<Page title="Parcele">
		<PagePlaceholder
			icon={MapIcon}
			description="Ovdje će biti karta s ortofotom, popis parcela i detalj parcele."
		/>
	</Page>
);

export const Route = createFileRoute("/aplikacija/parcele")({
	head: () => ({ meta: [{ title: "Parcele · Brazda" }] }),
	component: ParcelsPage,
});
