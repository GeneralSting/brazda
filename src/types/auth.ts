import type { authClient } from "#/services/auth-client";

// every error code Better Auth can answer with, read from the types of its client
export type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;
