import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";

const NewWorkPage = () => (
	<div className="flex min-h-dvh flex-col">
		<Link
			to="/"
			className="page-gutter flex h-13 items-center gap-2 font-semibold text-foreground hover:text-foreground"
		>
			<ArrowLeft className="size-6" aria-hidden="true" />
			Odustani
		</Link>
		<Page title="Unos rada" className="pt-0 lg:pt-0">
			<PagePlaceholder
				icon={ClipboardList}
				description="Ovdje će biti unos rada u pet koraka: parcela, vrsta rada, datum i površina, sredstvo i količina, provjera."
			/>
		</Page>
	</div>
);

export const Route = createFileRoute("/_app/unos-rada")({
	head: () => ({ meta: [{ title: "Unos rada · Brazda" }] }),
	component: NewWorkPage,
});
