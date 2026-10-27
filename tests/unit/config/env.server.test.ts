import { afterEach, describe, expect, it, vi } from "vitest";
import { getServerEnv } from "#/config/env.server";

afterEach(() => {
	vi.unstubAllEnvs();
});

describe("getServerEnv", () => {
	it("reads the variables of the server", () => {
		expect(getServerEnv().BETTER_AUTH_URL).toBe("http://localhost:3000");
	});

	it("sends from the test address of Resend until our domain is set", () => {
		vi.stubEnv("EMAIL_FROM", undefined);

		expect(getServerEnv().EMAIL_FROM).toBe("Brazda <onboarding@resend.dev>");
	});

	it("reads the IP headers as a clean lowercase list", () => {
		vi.stubEnv("AUTH_IP_HEADERS", " CF-Connecting-IP , x-real-ip,, ");

		expect(getServerEnv().AUTH_IP_HEADERS).toEqual([
			"cf-connecting-ip",
			"x-real-ip",
		]);
	});

	it("keeps the default IP header when the list holds no name", () => {
		vi.stubEnv("AUTH_IP_HEADERS", " , ");

		expect(getServerEnv().AUTH_IP_HEADERS).toBeUndefined();
	});

	it.each([
		["BETTER_AUTH_SECRET", "too-short"],
		["BETTER_AUTH_URL", "localhost"],
		["GOOGLE_CLIENT_ID", "000000000000-unit-tests"],
		["GOOGLE_CLIENT_SECRET", "unit-tests"],
	])(
		"fails with the name of %s when its value has the wrong shape",
		(name, value) => {
			vi.stubEnv(name, value);

			expect(() => getServerEnv()).toThrow(name);
		},
	);

	it("fails with the name of a variable that is missing", () => {
		const wrongEnvName = "DATABASE_URL_POOLED";
		vi.stubEnv(wrongEnvName, undefined);

		expect(() => getServerEnv()).toThrow(wrongEnvName);
	});
});
