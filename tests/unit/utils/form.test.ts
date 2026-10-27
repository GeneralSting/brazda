import { describe, expect, it } from "vitest";
import { EMAIL_FIELD, PASSWORD_FIELD } from "#/config/form-fields";
import { createFormConfig, getErrorMessage } from "#/utils/form";

describe("createFormConfig", () => {
	const form = createFormConfig({
		email: EMAIL_FIELD,
		password: PASSWORD_FIELD,
	});

	it("starts every field at its own default value", () => {
		expect(form.defaultValues).toEqual({ email: "", password: "" });
	});

	it("validates every field with its own schema", () => {
		const result = form.schema.safeParse({
			email: "ana@example.com",
			password: "short",
		});

		expect(result.error?.issues.map((issue) => issue.path)).toEqual([
			["password"],
		]);
	});
});

describe("getErrorMessage", () => {
	it("returns a plain string as it is", () => {
		expect(getErrorMessage(["Upišite e-poštu."])).toBe("Upišite e-poštu.");
	});

	it("reads the message of a schema issue", () => {
		expect(getErrorMessage([{ message: "Upišite lozinku." }])).toBe(
			"Upišite lozinku.",
		);
	});

	it("returns only the first of several errors", () => {
		expect(getErrorMessage(["first", "second"])).toBe("first");
	});

	it("returns nothing for no error or one without a message", () => {
		expect(getErrorMessage([])).toBeUndefined();
		expect(getErrorMessage([{ code: "custom" }])).toBeUndefined();
	});
});
