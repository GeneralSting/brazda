import type { BetterAuthRateLimitStorage } from "better-auth";
import { lt, sql } from "drizzle-orm";
import {
	RATE_LIMIT_DEFAULT,
	RATE_LIMIT_RULES,
	SIGN_IN_PER_ADDRESS,
} from "#/config/rate-limit";
import { getDb } from "#/server/db/client.server";
import { rateLimit } from "#/server/db/schema/rate-limit";

// a row whose window started longer ago than this is of no use to any rule
const LONGEST_WINDOW = Math.max(
	RATE_LIMIT_DEFAULT.window,
	SIGN_IN_PER_ADDRESS.window,
	...Object.values(RATE_LIMIT_RULES).map((rule) => rule.window),
);

const deleteEndedWindows = () =>
	getDb()
		.delete(rateLimit)
		.where(
			lt(
				rateLimit.windowStart,
				sql`now() - make_interval(secs => ${LONGEST_WINDOW})`,
			),
		);

/**
 * Counts one request and tells whether it may pass. A window starts with the first
 * request and the count goes back to zero only when the whole window has passed, not
 * after a pause. One statement reads and writes the row, so requests sent at the same
 * moment cannot all pass, and the clock of the database decides for every instance
 */
const consume: BetterAuthRateLimitStorage["consume"] = async (
	key,
	{ window, max },
) => {
	const windowEnded = sql`${rateLimit.windowStart} <= now() - make_interval(secs => ${window})`;

	const [row] = await getDb()
		.insert(rateLimit)
		.values({ key, count: 1, windowStart: sql`now()` })
		.onConflictDoUpdate({
			target: rateLimit.key,
			set: {
				count: sql`case when ${windowEnded} then 1 else ${rateLimit.count} + 1 end`,
				windowStart: sql`case when ${windowEnded} then now() else ${rateLimit.windowStart} end`,
			},
		})
		.returning({
			count: rateLimit.count,
			secondsLeft: sql<number>`ceil(extract(epoch from ${rateLimit.windowStart} + make_interval(secs => ${window}) - now()))::int`,
		});

	if (row?.count === 1) {
		await deleteEndedWindows(); // a new window started, the moment to drop the old ones
	}

	if (!row || row.count <= max) {
		return { allowed: true, retryAfter: null };
	}

	return { allowed: false, retryAfter: row.secondsLeft };
};

export const rateLimitStorage: BetterAuthRateLimitStorage = { consume };
