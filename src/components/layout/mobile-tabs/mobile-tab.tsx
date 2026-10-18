import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { NavItem } from "#/types/navigation";
import { cn } from "#/utils/cn";

type TabProps = {
	to: NavItem["to"];
	label: string;
	icon: LucideIcon;
	active: boolean;
	exact?: boolean; // the router marks the tab as current only on this exact path
};

export const MobileTab = ({
	to,
	label,
	icon: Icon,
	active,
	exact,
}: TabProps) => (
	<Link
		to={to}
		activeOptions={{ exact }}
		aria-current={active ? "page" : undefined}
		className={cn(
			"flex h-14 flex-col items-center justify-center gap-1 text-sm",
			active
				? "font-bold text-primary hover:text-primary"
				: "font-medium text-muted-foreground hover:text-muted-foreground",
		)}
	>
		<Icon className="size-6 shrink-0" aria-hidden="true" />
		{label}
	</Link>
);
