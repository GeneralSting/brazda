import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { getDb } from "#/server/db/client.server";
import { user, verification } from "#/server/db/schema/auth";
import { postToAuth } from "../../support/auth-request";
import { readOutbox } from "../../support/email-outbox";

const SIGN_UP = "/sign-up/request";
const EMAIL = "ana@example.com";

const findUsers = (email: string) =>
	getDb().select().from(user).where(eq(user.email, email));

// the token at the end of the path of the link that sets the password
const readLinkToken = (text: string | undefined) =>
	text?.match(/\/reset-password\/(\w+)\?/)?.[1];

describe("POST /sign-up/request", () => {
	it("makes an unconfirmed account without a name and sends the link that sets its password", async () => {
		const answer = await postToAuth(SIGN_UP, {
			email: "Ana@Example.com",
			acceptTerms: true,
		});

		expect(answer).toEqual({ status: 200, body: { status: true } });

		const [createdUser] = await findUsers(EMAIL);

		expect(createdUser).toMatchObject({ name: "", emailVerified: false });
		expect(createdUser?.termsAcceptedAt).toBeInstanceOf(Date);

		const [email] = readOutbox();

		expect(email?.to).toBe(EMAIL);
		expect(email?.text).toContain(
			"http://localhost:3000/api/auth/reset-password/",
		);
		expect(email?.text).toContain("?callbackURL=%2Fpostavi-lozinku");
	});

	it("refuses a sign-up without the consent, nothing is saved or sent", async () => {
		const answer = await postToAuth(SIGN_UP, {
			email: EMAIL,
			acceptTerms: false,
		});

		expect(answer.status).toBe(400);
		expect(answer.body.code).toBe("TERMS_NOT_ACCEPTED");

		expect(await findUsers(EMAIL)).toEqual([]);
		expect(readOutbox()).toEqual([]);
	});

	it("sends a new link to an address that never set its password, without a second account", async () => {
		await postToAuth(SIGN_UP, { email: EMAIL, acceptTerms: true });
		await postToAuth(SIGN_UP, { email: EMAIL, acceptTerms: true });

		const [first, second] = readOutbox().map((email) =>
			readLinkToken(email.text),
		);

		expect(await findUsers(EMAIL)).toHaveLength(1);

		expect(first).toBeDefined();
		expect(second).toBeDefined();

		expect(first).not.toBe(second);
	});

	it("keeps the token of the link only as its hash", async () => {
		await postToAuth(SIGN_UP, { email: EMAIL, acceptTerms: true });

		const token = readLinkToken(readOutbox()[0]?.text);
		const stored = await getDb().select().from(verification);

		expect(token).toBeDefined();
		expect(stored).toHaveLength(1);
		expect(stored[0]?.identifier).not.toContain(token);
	});
});
