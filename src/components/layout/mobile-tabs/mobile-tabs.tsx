import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Plus } from "lucide-react";
import {
	MOBILE_MENU_PATH,
	MOBILE_TAB_AFTER_ACTION,
	MOBILE_TABS_BEFORE_ACTION,
	NEW_WORK_PATH,
} from "#/config/navigation";
import { cn } from "#/utils/cn";
import {
	isMobileMenuActive,
	isNavItemActive,
	selectPathname,
} from "#/utils/navigation";
import { MobileTab } from "./mobile-tab";

type MobileTabsProps = {
	className?: string;
};

// mobile navigation, fixed to the bottom, with the main action raised in the middle
export const MobileTabs = ({ className }: MobileTabsProps) => {
	const pathname = useLocation({ select: selectPathname });

	return (
		<nav
			aria-label="Glavna navigacija"
			className={cn(
				"pb-safe fixed inset-x-0 bottom-0 z-10 border-border border-t bg-card",
				className,
			)}
		>
			<div className="grid h-21 grid-cols-5 items-start px-1.5 pt-2">
				{MOBILE_TABS_BEFORE_ACTION.map((item) => (
					<MobileTab
						key={item.to}
						to={item.to}
						label={item.shortLabel ?? item.label}
						icon={item.icon}
						active={isNavItemActive(pathname, item)}
						exact={item.exact}
					/>
				))}

				{/* the round button sticks out above the bar, so it is the first thing a thumb finds */}
				<Link
					to={NEW_WORK_PATH}
					className="-mt-5.5 flex flex-col items-center gap-1 font-bold text-primary text-sm hover:text-primary"
				>
					<span className="flex size-15 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-action">
						<Plus className="size-7" aria-hidden="true" />
					</span>
					Upiši rad
				</Link>

				<MobileTab
					to={MOBILE_TAB_AFTER_ACTION.to}
					label={
						MOBILE_TAB_AFTER_ACTION.shortLabel ?? MOBILE_TAB_AFTER_ACTION.label
					}
					icon={MOBILE_TAB_AFTER_ACTION.icon}
					active={isNavItemActive(pathname, MOBILE_TAB_AFTER_ACTION)}
				/>
				<MobileTab
					to={MOBILE_MENU_PATH}
					label="Izbornik"
					icon={Menu}
					active={isMobileMenuActive(pathname)}
				/>
			</div>
		</nav>
	);
};
