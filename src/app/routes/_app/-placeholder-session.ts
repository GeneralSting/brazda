import type { ShellUser } from "#/components/layout/types";

/* Sample user from the design, shown until sign-in and holdings exist.
   It is replaced by the data of the signed-in session. */
export const PLACEHOLDER_USER: ShellUser = {
	name: "Marko Horvat",
	holdingName: "OPG Horvat",
};

// signing out does nothing until sign-in exists, the shell only needs something to call
export const placeholderSignOut = () => {
	// replaced by the sign-out of the real session
};
