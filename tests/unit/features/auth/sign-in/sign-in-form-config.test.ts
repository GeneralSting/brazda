import { describe, expect, it } from "vitest";
import { buildTooManySignIns } from "#/features/auth/sign-in/sign-in-form-config";

// the wait as the user reads it, "5 minuta" out of the whole message
const readWait = (seconds: number) =>
	buildTooManySignIns(seconds).match(/Pričekajte (.+) pa/)?.[1];

describe("buildTooManySignIns", () => {
	it.each([
		[60, "1 minutu"],
		[120, "2 minute"],
		[300, "5 minuta"],
		[21 * 60, "21 minutu"],
		[24 * 60, "24 minute"],
		[25 * 60, "25 minuta"],
	])("waits %i seconds as %s", (seconds, wait) => {
		expect(readWait(seconds)).toBe(wait);
	});

	it("rounds up, so the wait is never shorter than the real one", () => {
		expect(readWait(1)).toBe("1 minutu");
		expect(readWait(61)).toBe("2 minute");
	});
});
