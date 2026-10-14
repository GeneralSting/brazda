import { Link } from "@tanstack/react-router";
import type { NavItem } from "#/components/layout/navigation/types";
import { DropdownMenuLinkItem } from "#/components/ui/dropdown-menu";

type SidebarUserMenuLinkProps = {
	item: NavItem;
	active: boolean;
};

// a page of the user menu, marked when it is the one that is open
export const SidebarUserMenuLink = ({
	item,
	active,
}: SidebarUserMenuLinkProps) => (
	<DropdownMenuLinkItem
		render={<Link to={item.to} />}
		tone={active ? "active" : "default"}
		aria-current={active ? "page" : undefined}
	>
		<item.icon aria-hidden="true" />
		{item.label}
	</DropdownMenuLinkItem>
);
