import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

const DeadlinesPage = () => (
	<Page title="Rokovi i obveze">
		<PagePlaceholder
			icon={CalendarClock}
			description="Ovdje će biti popis i kalendar rokova: hitno, uskoro i riješeno."
		/>
	</Page>
);

export const Route = createFileRoute("/aplikacija/rokovi")({
	head: () => ({ meta: [{ title: "Rokovi i obveze · Brazda" }] }),
	component: DeadlinesPage,
});
