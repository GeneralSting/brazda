import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SIDEBAR_COOKIE, SIDEBAR_COOKIE_MAX_AGE } from "#/config/sidebar";
import type { SidebarMode } from "#/types/sidebar";

// anything else than a stored choice, also a missing or edited cookie, means auto
const toSidebarMode = (value: string | undefined): SidebarMode =>
	value === "expanded" || value === "collapsed" ? value : "auto";

const readBrowserCookie = () =>
	document.cookie
		.split("; ")
		.find((cookie) => cookie.startsWith(`${SIDEBAR_COOKIE}=`))
		?.split("=")[1];

/**
 * The stored width of the sidebar, read from the request on the server and
 * from document.cookie in the browser, so no request is made from it.
 */
export const readSidebarMode = createIsomorphicFn()
	.server(() => toSidebarMode(getCookie(SIDEBAR_COOKIE)))
	.client(() => toSidebarMode(readBrowserCookie()));

export const storeSidebarMode = (mode: SidebarMode) => {
	// biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is not in every browser yet
	document.cookie = `${SIDEBAR_COOKIE}=${mode}; Path=/; Max-Age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
};
