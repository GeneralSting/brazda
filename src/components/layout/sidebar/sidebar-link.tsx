import { Link } from "@tanstack/react-router";
import { LABEL_CLASSES, ROW_CLASSES } from "#/config/sidebar";
import type { NavItem } from "#/types/navigation";
import { cn } from "#/utils/cn";

type SidebarLinkProps = {
	item: NavItem;
	active: boolean;
};

// one section of the main navigation
export const SidebarLink = ({ item, active }: SidebarLinkProps) => (
	<Link
		to={item.to}
		activeOptions={{ exact: item.exact }} // the router marks the same link as current as the active prop does
		// as a rail the label is not visible, so the browser shows it on hover
		title={item.label}
		aria-current={active ? "page" : undefined}
		className={cn(
			ROW_CLASSES,
			"h-11 gap-3 px-3.5 text-base",
			active
				? "bg-accent font-bold text-accent-foreground hover:text-accent-foreground"
				: "font-medium text-foreground-soft hover:bg-secondary hover:text-foreground-soft",
		)}
	>
		<item.icon
			className={cn("size-5 shrink-0", !active && "text-muted-foreground")}
			aria-hidden="true"
		/>
		<span className={LABEL_CLASSES}>{item.label}</span>
	</Link>
);
