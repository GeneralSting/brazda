import { describe, expect, it } from "vitest";
import { sendEmail, sendEmailInBackground } from "#/server/email.server";
import type { Email } from "#/types/email";
import { readOutbox } from "../../support/email-outbox";

const EMAIL: Email = {
	to: "ana@example.com",
	subject: "Test",
	html: "<p>Test</p>",
	text: "Test",
};

/**
 * Guards the replacement of setup.ts - if it stops reaching the module (a renamed
 * file, a removed setup), the tests would start sending real emails, and this fails first
 */
describe("the replacement of sending in setup.ts", () => {
	it("keeps every email in the outbox instead of sending it", async () => {
		await sendEmail(EMAIL);
		sendEmailInBackground(EMAIL);

		expect(readOutbox()).toEqual([EMAIL, EMAIL]);
	});

	it("starts every test with an empty outbox", () => {
		expect(readOutbox()).toEqual([]);
	});
});
