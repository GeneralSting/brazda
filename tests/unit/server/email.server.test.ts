import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail, sendEmailInBackground } from "#/server/email.server";
import type { Email } from "#/types/email";

// the sending itself is tested here, so the replacement of setup.ts is lifted for this file
vi.unmock("#/server/email.server");

const EMAIL: Email = {
	to: "ana@example.com",
	subject: "Test",
	html: "<p>Test</p>",
	text: "Test",
};

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});

describe("sendEmail", () => {
	it("sends through Resend with the key, from our sender, to the address as a list", async () => {
		vi.stubEnv("RESEND_API_KEY", "re_test");
		const request = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(new Response("{}"));

		await sendEmail(EMAIL);

		const [url, init] = request.mock.calls[0] ?? [];

		expect(url).toBe("https://api.resend.com/emails");
		expect(new Headers(init?.headers).get("Authorization")).toBe(
			"Bearer re_test",
		);
		expect(JSON.parse(String(init?.body))).toMatchObject({
			from: "Brazda <onboarding@resend.dev>",
			to: ["ana@example.com"],
			subject: "Test",
		});
	});

	it("fails with the status when Resend refuses the email", async () => {
		vi.stubEnv("RESEND_API_KEY", "re_test");
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("invalid sender", { status: 422 }),
		);

		await expect(sendEmail(EMAIL)).rejects.toThrow("422: invalid sender");
	});

	it("prints the email in development without a key", async () => {
		const print = vi.spyOn(console, "info").mockImplementation(() => {});
		const request = vi.spyOn(globalThis, "fetch");

		await sendEmail(EMAIL);

		expect(print).toHaveBeenCalledWith(expect.stringContaining("Test"));
		expect(request).not.toHaveBeenCalled();
	});

	it("refuses to go on in production without a key, so no email is lost unseen", async () => {
		vi.stubEnv("DEV", false);

		await expect(sendEmail(EMAIL)).rejects.toThrow("RESEND_API_KEY is not set");
	});
});

describe("sendEmailInBackground", () => {
	it("logs a failed email instead of throwing", async () => {
		vi.stubEnv("RESEND_API_KEY", "re_test");
		vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
		const log = vi.spyOn(console, "error").mockImplementation(() => {});

		sendEmailInBackground(EMAIL);

		await vi.waitFor(() =>
			expect(log).toHaveBeenCalledWith(
				'"Test" was not sent',
				expect.any(Error),
			),
		);
	});
});
