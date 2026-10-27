import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	getRequestErrorMessage,
	parseResponse,
	REQUEST_MESSAGES,
} from "#/utils/request";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("getRequestErrorMessage", () => {
	it("tells the user to check the connection when no answer came", () => {
		expect(getRequestErrorMessage({ status: 0 })).toBe(
			REQUEST_MESSAGES.noResponse,
		);
	});

	it("asks the user to wait after too many attempts", () => {
		expect(getRequestErrorMessage({ status: 429 })).toBe(
			REQUEST_MESSAGES.tooManyAttempts,
		);
	});

	it.each([500, 503])("blames the server for status %i", (status) => {
		expect(getRequestErrorMessage({ status })).toBe(
			REQUEST_MESSAGES.serverError,
		);
	});

	it.each([400, 404])("calls status %i unexpected", (status) => {
		expect(getRequestErrorMessage({ status })).toBe(
			REQUEST_MESSAGES.unexpected,
		);
	});
});

describe("parseResponse", () => {
	const schema = z.object({ token: z.string() });

	it("returns an answer of the expected shape", () => {
		expect(parseResponse(schema, { token: "abc" })).toEqual({ token: "abc" });
	});

	it("logs an answer of another shape and never trusts it", () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(parseResponse(schema, { token: 1 })).toBeNull();
		expect(log).toHaveBeenCalledWith(expect.stringContaining("token"));
	});
});
