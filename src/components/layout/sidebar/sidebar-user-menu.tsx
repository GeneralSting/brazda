import { useLocation } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "#/components/overlay/dropdown-menu";
import { USER_MENU_NAV } from "#/config/navigation";
import type { SessionUser } from "#/types/user";
import {
	isNavItemActive,
	isUserMenuActive,
	selectPathname,
} from "#/utils/navigation";
import { SidebarUserMenuLink } from "./sidebar-user-menu-link";
import { SidebarUserTrigger } from "./sidebar-user-trigger";

type SidebarUserMenuProps = {
	user: SessionUser;
	onSignOut: () => void;
};

// bottom of the sidebar: the user's own pages first, signing out below a divider
export const SidebarUserMenu = ({ user, onSignOut }: SidebarUserMenuProps) => {
	const pathname = useLocation({ select: selectPathname });

	return (
		<div className="border-border-subtle border-t p-3">
			<DropdownMenu>
				<SidebarUserTrigger user={user} active={isUserMenuActive(pathname)} />
				{/* opens beside the sidebar, 12px of row inset plus 8px of air away from it */}
				<DropdownMenuContent side="right" align="end" sideOffset={20}>
					{USER_MENU_NAV.map((item) => (
						<SidebarUserMenuLink
							key={item.to}
							item={item}
							active={isNavItemActive(pathname, item)}
						/>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem tone="destructive" onClick={onSignOut}>
						<LogOut aria-hidden="true" />
						Odjava
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
