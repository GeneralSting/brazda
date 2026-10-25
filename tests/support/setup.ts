import { beforeEach, vi } from "vitest";
import type { Email } from "#/types/email";
import { clearOutbox, keepInOutbox } from "./email-outbox";

/**
 * Runs before every test file. No test sends a real email - sending is replaced and
 * every email lands in the outbox, where a test reads it. A test of the sending
 * itself lifts the replacement with `vi.unmock` at its top
 */
vi.mock("#/server/email.server", () => ({
	sendEmail: async (email: Email) => {
		keepInOutbox(email);
	},

	sendEmailInBackground: (email: Email) => {
		keepInOutbox(email);
	},
}));

beforeEach(() => {
	clearOutbox();
});
