import type { LucideIcon } from "lucide-react";
import { EmptyState } from "#/components/feedback/empty-state";

type PagePlaceholderProps = {
	icon: LucideIcon;
	description: string; // what the screen will offer once it is built
};

// stands in for a screen that has its place in the navigation but is not built yet
export const PagePlaceholder = ({
	icon: Icon,
	description,
}: PagePlaceholderProps) => (
	<EmptyState
		icon={<Icon aria-hidden="true" />}
		title="Ovaj dio je u izradi"
		description={description}
	/>
);
