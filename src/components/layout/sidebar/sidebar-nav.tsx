import { useLocation } from "@tanstack/react-router";
import { MAIN_NAV } from "#/config/navigation";
import { isNavItemActive, selectPathname } from "#/utils/navigation";
import { SidebarLink } from "./sidebar-link";

// every section of the application, the one that is open is marked
export const SidebarNav = () => {
	const pathname = useLocation({ select: selectPathname });

	return (
		<nav
			aria-label="Glavna navigacija"
			className="flex flex-col gap-0.5 px-3 pb-3"
		>
			{MAIN_NAV.map((item) => (
				<SidebarLink
					key={item.to}
					item={item}
					active={isNavItemActive(pathname, item)}
				/>
			))}
		</nav>
	);
};
