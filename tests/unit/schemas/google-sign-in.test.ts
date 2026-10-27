import { describe, expect, it } from "vitest";
import { GOOGLE_SIGN_IN_SEARCH_SCHEMA } from "#/schemas/google-sign-in";

describe("GOOGLE_SIGN_IN_SEARCH_SCHEMA", () => {
	it("keeps the error code Google returned with", () => {
		expect(
			GOOGLE_SIGN_IN_SEARCH_SCHEMA.parse({ error: "access_denied" }),
		).toEqual({ error: "access_denied" });
	});

	it("opens the page without an error when there is none", () => {
		expect(GOOGLE_SIGN_IN_SEARCH_SCHEMA.parse({})).toEqual({});
	});

	it("reads a damaged value as no error instead of breaking the page", () => {
		expect(GOOGLE_SIGN_IN_SEARCH_SCHEMA.parse({ error: ["a", "b"] })).toEqual({
			error: undefined,
		});
	});
});
