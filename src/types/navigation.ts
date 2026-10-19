import type { LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

// one destination of the navigation, the sidebar, the tab bar and the menus all draw it
export type NavItem = {
	to: NonNullable<LinkProps["to"]>;
	label: string;
	icon: LucideIcon;
	shortLabel?: string; // shorter label for the mobile tab bar, where the full one does not fit
	exact?: boolean; // active only on this exact path, needed for the home page at "/aplikacija"
};

// a module that is planned but not built, shown locked and leading nowhere
export type UpcomingNavItem = {
	label: string;
	icon: LucideIcon;
};
