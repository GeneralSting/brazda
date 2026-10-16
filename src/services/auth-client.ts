import { createAuthClient } from "better-auth/react";

// sign-in from the browser, the server answers on the same address, so no base URL is set
export const authClient = createAuthClient();
