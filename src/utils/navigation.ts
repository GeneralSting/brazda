import type { ParsedLocation } from "@tanstack/react-router";
import {
	MOBILE_MENU_NAV,
	MOBILE_MENU_PATH,
	USER_MENU_NAV,
} from "#/config/navigation";
import type { NavItem } from "#/types/navigation";

// for useLocation, so a component re-renders only when the path changes
export const selectPathname = (location: ParsedLocation) => location.pathname;

// true when the current path is the given one or a page under it
export const isPathActive = (pathname: string, path: string) =>
	pathname === path || pathname.startsWith(`${path}/`);

export const isNavItemActive = (pathname: string, item: NavItem) =>
	item.exact ? pathname === item.to : isPathActive(pathname, item.to);

// true on any page that is opened from the user menu
export const isUserMenuActive = (pathname: string) =>
	USER_MENU_NAV.some((item) => isNavItemActive(pathname, item));

// the menu tab is lit on the menu page and on everything reached through it
export const isMobileMenuActive = (pathname: string) =>
	pathname === MOBILE_MENU_PATH ||
	isUserMenuActive(pathname) ||
	MOBILE_MENU_NAV.some((item) => isNavItemActive(pathname, item));
