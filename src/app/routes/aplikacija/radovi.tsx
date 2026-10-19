import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

const WorkRecordsPage = () => (
	<Page title="Evidencija radova">
		<PagePlaceholder
			icon={ClipboardList}
			description="Ovdje će biti popis radova s filtrima po parceli, kulturi i razdoblju te izvoz."
		/>
	</Page>
);

export const Route = createFileRoute("/aplikacija/radovi")({
	head: () => ({ meta: [{ title: "Evidencija radova · Brazda" }] }),
	component: WorkRecordsPage,
});
