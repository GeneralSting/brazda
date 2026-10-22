import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Requests counted per IP address and path, our own table and not the one of Better
 * Auth. A window starts with the first request and lasts its whole length, then the
 * next request starts a new one
 */
export const rateLimit = pgTable("rate_limit", {
	key: text("key").primaryKey(), // IP address and path, "198.162.3.4|/sign-in/email"
	count: integer("count").notNull(), // requests since the window started, refused ones too
	windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
});
