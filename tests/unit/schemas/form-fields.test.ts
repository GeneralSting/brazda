import { describe, expect, it } from "vitest";
import {
	emailSchema,
	PASSWORD_MIN_LENGTH,
	passwordSchema,
} from "#/schemas/form-fields";

// the message the user reads under the field, or null when the value passes
const readError = (result: { error?: { issues: { message: string }[] } }) =>
	result.error?.issues[0]?.message ?? null;

describe("emailSchema", () => {
	it("drops the spaces around the address", () => {
		expect(emailSchema.parse("  ana@example.com ")).toBe("ana@example.com");
	});

	it("asks for an address when the field is empty or only spaces", () => {
		expect(readError(emailSchema.safeParse("   "))).toBe("Upišite e-poštu.");
	});

	it("shows an example when the address is not valid", () => {
		expect(readError(emailSchema.safeParse("ana@"))).toBe(
			"E-pošta nije ispravna, npr. ime@primjer.hr.",
		);
	});
});

describe("passwordSchema", () => {
	it("asks for a password when the field is empty", () => {
		expect(readError(passwordSchema.safeParse(""))).toBe("Upišite lozinku.");
	});

	it("refuses a password shorter than the minimum", () => {
		const tooShortPassword = "a".repeat(PASSWORD_MIN_LENGTH - 1);

		expect(readError(passwordSchema.safeParse(tooShortPassword))).toBe(
			"Lozinka mora imati najmanje 8 znakova.",
		);
	});

	it("accepts a password of exactly the minimum length", () => {
		const exact = "a".repeat(PASSWORD_MIN_LENGTH);

		expect(readError(passwordSchema.safeParse(exact))).toBeNull();
	});
});
