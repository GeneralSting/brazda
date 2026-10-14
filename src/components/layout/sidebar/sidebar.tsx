import type { ShellUser } from "#/components/layout/types";
import { cn } from "#/lib/utils";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarToggle } from "./sidebar-toggle";
import { SidebarUpcoming } from "./sidebar-upcoming";
import { SidebarUserMenu } from "./sidebar-user-menu";

type SidebarProps = {
	user: ShellUser;
	// switches between the full sidebar and the rail of icons
	onToggle: () => void;
	onSignOut: () => void;
	className?: string;
};

/* Desktop navigation on the left edge. It has two widths, the full sidebar and
   a rail of icons; which one shows is decided in CSS by the rail variant, so the
   markup is the same in both and the server can render it without knowing the screen. */
export const Sidebar = ({
	user,
	onToggle,
	onSignOut,
	className,
}: SidebarProps) => (
	<aside
		className={cn(
			"sticky top-0 h-dvh w-64 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-border border-r bg-card transition-[width] duration-200 ease-out rail:w-18",
			className,
		)}
	>
		<SidebarBrand />
		<SidebarNav />
		<SidebarUpcoming />
		<SidebarToggle onToggle={onToggle} className="mt-auto" />
		<SidebarUserMenu user={user} onSignOut={onSignOut} />
	</aside>
);
