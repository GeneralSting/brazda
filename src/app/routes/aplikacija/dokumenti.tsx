import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

const DocumentsPage = () => (
	<Page title="Dokumenti">
		<PagePlaceholder
			icon={FileText}
			description="Ovdje će biti učitavanje dokumenata i pregled prepoznatih podataka."
		/>
	</Page>
);

export const Route = createFileRoute("/aplikacija/dokumenti")({
	head: () => ({ meta: [{ title: "Dokumenti · Brazda" }] }),
	component: DocumentsPage,
});
