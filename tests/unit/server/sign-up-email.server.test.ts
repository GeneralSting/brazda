import { describe, expect, it } from "vitest";
import {
	sendAccountExists,
	sendSetPasswordLink,
} from "#/server/sign-up-email.server";
import { readOutbox } from "../../support/email-outbox";

const TO = "ana+farma@example.com";

describe("sendSetPasswordLink", () => {
	it("sends the link that sets the first password to the new address", () => {
		sendSetPasswordLink(TO, "http://localhost:3000/postavi-lozinku?token=abc");

		const [email] = readOutbox();

		expect(email?.to).toBe(TO);
		expect(email?.subject).toBe("Dovršite registraciju u Brazdi");
		expect(email?.text).toContain(
			"Postavi lozinku: http://localhost:3000/postavi-lozinku?token=abc",
		);
	});
});

describe("sendAccountExists", () => {
	it("leads an account with a password to sign in and to a new password", () => {
		sendAccountExists(TO, true);

		const [email] = readOutbox();

		expect(email?.subject).toBe("Već imate račun u Brazdi");
		expect(email?.text).toContain("Prijavi se: http://localhost:3000/prijava");
		expect(email?.text).toContain(
			"http://localhost:3000/zaboravljena-lozinka?email=ana%2Bfarma%40example.com",
		);
	});

	it("leads an account of Google only to its button, with no password link", () => {
		sendAccountExists(TO, false);

		const [email] = readOutbox();

		expect(email?.text).toContain("Nastavi s Google računom");
		expect(email?.text).not.toContain("zaboravljena-lozinka");
	});
});
