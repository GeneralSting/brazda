import { describe, expect, it } from "vitest";
import { GOOGLE_EXPIRED_CODES } from "#/config/google-sign-in";
import { getGoogleSignInProblem } from "#/utils/google-sign-in";

describe("getGoogleSignInProblem", () => {
	it("finds no problem without a code", () => {
		expect(getGoogleSignInProblem(undefined)).toBeNull();
		expect(getGoogleSignInProblem("")).toBeNull();
	});

	it("reads a press of Cancel at Google as cancelled", () => {
		expect(getGoogleSignInProblem("access_denied")).toBe("cancelled");
	});

	it.each(GOOGLE_EXPIRED_CODES)("reads %s as an expired attempt", (code) => {
		expect(getGoogleSignInProblem(code)).toBe("expired");
	});

	it("reads every unknown code as a failure", () => {
		expect(getGoogleSignInProblem("internal_server_error")).toBe("failed");
	});
});
