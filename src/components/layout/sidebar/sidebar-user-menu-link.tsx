import { Link } from "@tanstack/react-router";
import { DropdownMenuLinkItem } from "#/components/overlay/dropdown-menu";
import type { NavItem } from "#/types/navigation";

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
