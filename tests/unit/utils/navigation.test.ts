import { describe, expect, it } from "vitest";
import { MAIN_NAV, MOBILE_MENU_PATH, PROFILE_PATH } from "#/config/navigation";
import {
	isMobileMenuActive,
	isNavItemActive,
	isPathActive,
	isUserMenuActive,
} from "#/utils/navigation";

const [HOME, PARCELS] = MAIN_NAV;

describe("isPathActive", () => {
	it("is active on the path itself and on a page under it", () => {
		expect(isPathActive("/aplikacija/parcele", "/aplikacija/parcele")).toBe(
			true,
		);
		expect(isPathActive("/aplikacija/parcele/12", "/aplikacija/parcele")).toBe(
			true,
		);
	});

	it("is not active on a path that only starts with the same letters", () => {
		expect(
			isPathActive("/aplikacija/parcele-stare", "/aplikacija/parcele"),
		).toBe(false);
	});
});

describe("isNavItemActive", () => {
	it("lights the home item only on its exact path", () => {
		expect(isNavItemActive("/aplikacija", HOME)).toBe(true);
		expect(isNavItemActive("/aplikacija/parcele", HOME)).toBe(false);
	});

	it("lights any other item on the pages under it too", () => {
		expect(isNavItemActive("/aplikacija/parcele/12", PARCELS)).toBe(true);
	});
});

describe("isUserMenuActive", () => {
	it("is active on a page of the user menu", () => {
		expect(isUserMenuActive(PROFILE_PATH)).toBe(true);
		expect(isUserMenuActive("/aplikacija/parcele")).toBe(false);
	});
});

describe("isMobileMenuActive", () => {
	it("is active on the menu page and on every page reached through it", () => {
		expect(isMobileMenuActive(MOBILE_MENU_PATH)).toBe(true);
		expect(isMobileMenuActive(PROFILE_PATH)).toBe(true);
		expect(isMobileMenuActive("/aplikacija/dokumenti")).toBe(true);
	});

	it("is not active on a page that has its own tab", () => {
		expect(isMobileMenuActive("/aplikacija/parcele")).toBe(false);
		expect(isMobileMenuActive("/aplikacija")).toBe(false);
	});
});
