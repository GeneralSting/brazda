import { useEffect, useState } from "react";

/* auto follows the screen: a rail between md and lg, the full sidebar from lg.
   The other two are the user's own choice and override the screen. */
export type SidebarMode = "auto" | "expanded" | "collapsed";

const SIDEBAR_STORAGE_KEY = "brazda.sidebar";
// same width as the lg breakpoint, below it the automatic mode shows the rail
const FULL_SIDEBAR_QUERY = "(min-width: 64rem)";

const readStoredMode = (): SidebarMode => {
	try {
		const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
		return stored === "expanded" || stored === "collapsed" ? stored : "auto";
	} catch {
		// storage can be blocked, e.g. in a private window
		return "auto";
	}
};

const storeMode = (mode: SidebarMode) => {
	try {
		window.localStorage.setItem(SIDEBAR_STORAGE_KEY, mode);
	} catch {
		// the choice then lasts only until the page is reloaded
	}
};

// width of the sidebar the user chose, remembered on the device
export const useSidebarMode = () => {
	const [sidebarMode, setSidebarMode] = useState<SidebarMode>("auto");

	// the stored choice is read after the first render, the server cannot know it
	useEffect(() => {
		setSidebarMode(readStoredMode());
	}, []);

	const toggleSidebar = () => {
		const showsRail =
			sidebarMode === "auto"
				? !window.matchMedia(FULL_SIDEBAR_QUERY).matches
				: sidebarMode === "collapsed";
		const nextMode: SidebarMode = showsRail ? "expanded" : "collapsed";
		setSidebarMode(nextMode);
		storeMode(nextMode);
	};

	return { sidebarMode, toggleSidebar };
};
