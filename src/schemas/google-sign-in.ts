import { z } from "zod";

// the address of an auth page after Google failed, a damaged value reads as none
export const GOOGLE_SIGN_IN_SEARCH_SCHEMA = z.object({
	error: z.string().optional().catch(undefined),
});
