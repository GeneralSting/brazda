import type { ActionEmail, Email } from "#/types/email";

// --primary, --foreground and --muted-foreground of styles.css, email clients read no tokens
const COLORS = { primary: "#1e5a3c", text: "#1d1c19", muted: "#55524a" };

// our own fixed texts only, nothing typed by a user goes in, so nothing needs escaping
const toParagraphs = (lines: string[]) =>
	lines.map((line) => `<p>${line}</p>`).join("\n\t");

/**
 * Written by hand with inline styles, since email clients read no stylesheet. The link
 * is written out under the button for a client that blocks it
 */
const buildHtml = ({ intro, action, outro }: ActionEmail) => `
<div style="font-family: system-ui, sans-serif; color: ${COLORS.text}; font-size: 16px; line-height: 24px">
	${toParagraphs(intro)}
	<p>
		<a href="${action.url}" style="display: inline-block; padding: 12px 20px; border-radius: 10px; background: ${COLORS.primary}; color: #ffffff; text-decoration: none; font-weight: 600">${action.label}</a>
	</p>
	${toParagraphs(outro)}
	<p style="color: ${COLORS.muted}; font-size: 14px; line-height: 20px">Ako gumb ne radi, kopirajte cijelu poveznicu u preglednik:<br><a href="${action.url}" style="color: ${COLORS.primary}; word-break: break-all">${action.url}</a></p>
</div>`;

const buildText = ({ intro, action, outro }: ActionEmail) =>
	[...intro, `${action.label}: ${action.url}`, ...outro].join("\n\n");

// one email of Brazda: the texts around a button, as HTML and as plain text
export const buildActionEmail = (email: ActionEmail): Email => ({
	to: email.to,
	subject: email.subject,
	html: buildHtml(email),
	text: buildText(email),
});
