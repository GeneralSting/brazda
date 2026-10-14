import type { ReactNode } from "react";
import { MobileTabs } from "./mobile-tabs";
import { Sidebar } from "./sidebar/sidebar";
import { useSidebarMode } from "./sidebar/use-sidebar-mode";
import type { ShellUser } from "./types";

type AppShellProps = {
	user: ShellUser;
	onSignOut: () => void;
	children: ReactNode;
};

/* Frame around every screen of the application: tab bar at the bottom on phones,
   sidebar from the md breakpoint. The sidebar mode is set on the root, where the
   rail variant of styles.css reads it. */
export const AppShell = ({ user, onSignOut, children }: AppShellProps) => {
	const { sidebarMode, toggleSidebar } = useSidebarMode();

	return (
		<div data-sidebar={sidebarMode} className="flex min-h-dvh">
			<Sidebar
				user={user}
				onToggle={toggleSidebar}
				onSignOut={onSignOut}
				className="hidden md:flex"
			/>
			{/* bottom padding keeps the last content above the fixed tab bar */}
			<div className="flex min-w-0 flex-1 flex-col pb-21 md:pb-0">
				{children}
			</div>
			<MobileTabs className="md:hidden" />
		</div>
	);
};
