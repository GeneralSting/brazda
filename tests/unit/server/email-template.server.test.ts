import { describe, expect, it } from "vitest";
import { buildActionEmail } from "#/server/email-template.server";
import type { ActionEmail } from "#/types/email";

describe("buildActionEmail", () => {
	const actionEmail: ActionEmail = {
		to: "ana@example.com",
		subject: "Dovršite registraciju",
		intro: ["Zatražena je registracija."],
		action: {
			label: "Postavi lozinku",
			url: "https://brazda.hr/postavi-lozinku?token=abc",
		},
		outro: [
			{
				text: "Nova lozinka se traži ovdje:",
				link: {
					label: "Zatraži novu lozinku",
					url: "https://brazda.hr/zaboravljena",
				},
			},
		],
	};

	const { action } = actionEmail;
	const email = buildActionEmail(actionEmail);

	it("keeps the receiver and the subject", () => {
		expect(email).toMatchObject({
			to: actionEmail.to,
			subject: actionEmail.subject,
		});
	});

	it("writes the button and, for a client that blocks it, the link itself", () => {
		expect(email.html).toContain(`<a href="${action.url}"`);
		expect(email.html).toContain(`>${action.label}</a>`);
		expect(email.html).toContain(`${action.url}</a></p>`);
	});

	it("ends a paragraph with its own link under its label", () => {
		expect(email.html).toContain(
			'Nova lozinka se traži ovdje: <a href="https://brazda.hr/zaboravljena"',
		);
		expect(email.html).toContain(">Zatraži novu lozinku</a></p>");
	});

	it("writes the plain text in the order of the HTML, every link as its address", () => {
		expect(email.text).toBe(
			[
				"Zatražena je registracija.",
				`Postavi lozinku: ${action.url}`,
				"Nova lozinka se traži ovdje: https://brazda.hr/zaboravljena",
			].join("\n\n"),
		);
	});
});
