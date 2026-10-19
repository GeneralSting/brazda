import { useState } from "react";
import type { SidebarMode } from "#/types/sidebar";
import { storeSidebarMode } from "#/utils/sidebar-mode";

// same width as the lg breakpoint, below it the automatic mode shows the rail
const FULL_SIDEBAR_QUERY = "(min-width: 64rem)";

/**
 * Width of the sidebar the user chose. It starts from the mode the route
 * read from the cookie, so the first render already has the chosen width
 */
export const useSidebarMode = (initialMode: SidebarMode) => {
	const [sidebarMode, setSidebarMode] = useState(initialMode);

	const toggleSidebar = () => {
		const showsRail =
			sidebarMode === "auto"
				? !window.matchMedia(FULL_SIDEBAR_QUERY).matches
				: sidebarMode === "collapsed";
		const nextMode: SidebarMode = showsRail ? "expanded" : "collapsed";

		setSidebarMode(nextMode);
		storeSidebarMode(nextMode);
	};

	return { sidebarMode, toggleSidebar };
};
