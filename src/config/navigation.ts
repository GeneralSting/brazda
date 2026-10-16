import {
	CalendarClock,
	ClipboardList,
	CreditCard,
	FileText,
	House,
	Landmark,
	MapIcon,
	Package,
	TrendingUp,
	UserRound,
	Users,
	Wallet,
} from "lucide-react";
import type { NavItem, UpcomingNavItem } from "#/types/navigation";

const HOME: NavItem = { to: "/", label: "Početna", icon: House, exact: true };
const PARCELS: NavItem = { to: "/parcele", label: "Parcele", icon: MapIcon };
const WORK_RECORDS: NavItem = {
	to: "/radovi",
	label: "Evidencija radova",
	icon: ClipboardList,
};
const DEADLINES: NavItem = {
	to: "/rokovi",
	label: "Rokovi i obveze",
	shortLabel: "Rokovi",
	icon: CalendarClock,
};
const DOCUMENTS: NavItem = {
	to: "/dokumenti",
	label: "Dokumenti",
	icon: FileText,
};
const HOLDING: NavItem = {
	to: "/gospodarstvo",
	label: "Gospodarstvo",
	icon: Users,
};
const PROFILE: NavItem = { to: "/profil", label: "Profil", icon: UserRound };
const SUBSCRIPTION: NavItem = {
	to: "/pretplata",
	label: "Pretplata",
	icon: CreditCard,
};

// every section of the application, in the order of the desktop sidebar
export const MAIN_NAV: NavItem[] = [
	HOME,
	PARCELS,
	WORK_RECORDS,
	DEADLINES,
	DOCUMENTS,
	HOLDING,
];

// the mobile tab bar holds two tabs on each side of the "Upiši rad" button
export const MOBILE_TABS_BEFORE_ACTION: NavItem[] = [HOME, PARCELS];
export const MOBILE_TAB_AFTER_ACTION: NavItem = DEADLINES;

// sections that do not fit in the tab bar, reached on mobile through the menu page
export const MOBILE_MENU_NAV: NavItem[] = [WORK_RECORDS, DOCUMENTS, HOLDING];

/* pages about the signed-in person, opened from the user row of the sidebar
   and from the mobile menu, where signing out sits below them */
export const USER_MENU_NAV: NavItem[] = [PROFILE, SUBSCRIPTION];
// on mobile the profile is opened from the user card, the rest from a list
export const MOBILE_ACCOUNT_NAV: NavItem[] = [SUBSCRIPTION];

// modules that are planned but not built, shown locked
export const UPCOMING_NAV: UpcomingNavItem[] = [
	{ label: "Zalihe", icon: Package },
	{ label: "Troškovi i prihodi", icon: Wallet },
	{ label: "Potpore i natječaji", icon: Landmark },
	{ label: "Cijene", icon: TrendingUp },
];

export const PROFILE_PATH = PROFILE.to;
export const MOBILE_MENU_PATH = "/izbornik" satisfies NavItem["to"];
// the work entry flow, the main action of the application
export const NEW_WORK_PATH = "/unos-rada" satisfies NavItem["to"];
