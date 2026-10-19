const MINUTE = 60;

/**
 * How often one IP address may call the auth endpoints, a window in seconds and the
 * most requests in it. The paths are those of Better Auth under /api/auth, a rule
 * here replaces its own default for that path
 */
export const RATE_LIMIT_RULES = {
	"/sign-in/*": { window: MINUTE, max: 5 },
	"/sign-up/*": { window: MINUTE, max: 5 },
	// both send an email, so they are kept rare
	"/request-password-reset": { window: 5 * MINUTE, max: 5 },
	"/send-verification-email": { window: 5 * MINUTE, max: 5 },
};

// every other auth endpoint (session, sign-out...), one request a second on average
export const RATE_LIMIT_DEFAULT = { window: MINUTE, max: 60 };
