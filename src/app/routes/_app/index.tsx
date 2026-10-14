import { createFileRoute, Link } from "@tanstack/react-router";
import { House, Plus } from "lucide-react";
import { NEW_WORK_PATH } from "#/components/layout/navigation/constants";
import { Page } from "#/components/layout/page";
import { PagePlaceholder } from "#/components/layout/page-placeholder";
import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

const HomePage = () => (
	<Page
		title="Početna"
		actions={
			// on mobile the same action is the round button in the tab bar
			<Link
				to={NEW_WORK_PATH}
				className={cn(
					buttonVariants({ size: "lg" }),
					"hidden hover:text-primary-foreground md:inline-flex",
				)}
			>
				<Plus aria-hidden="true" />
				Upiši rad
			</Link>
		}
	>
		<PagePlaceholder
			icon={House}
			description="Ovdje će biti nadolazeći rokovi, zadnji radovi i stanje sezone."
		/>
	</Page>
);

export const Route = createFileRoute("/_app/")({ component: HomePage });
