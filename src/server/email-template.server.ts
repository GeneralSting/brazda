import type { ActionEmail, Email, EmailParagraph } from "#/types/email";

// --primary, --foreground and --muted-foreground of styles.css, email clients read no tokens
const COLORS = { primary: "#1e5a3c", text: "#1d1c19", muted: "#55524a" };

/**
 * Our own fixed texts only, so nothing needs escaping - an address that goes into a
 * link is encoded by URL before it gets here
 */
const toHtmlParagraph = (paragraph: EmailParagraph) =>
	typeof paragraph === "string"
		? `<p>${paragraph}</p>`
		: `<p>${paragraph.text} <a href="${paragraph.link.url}" style="color: ${COLORS.primary}; font-weight: 600">${paragraph.link.label}</a></p>`;

const toParagraphs = (paragraphs: EmailParagraph[]) =>
	paragraphs.map(toHtmlParagraph).join("\n\t");

// in plain text the sentence leads straight into the address, the label is for HTML
const toTextParagraph = (paragraph: EmailParagraph) =>
	typeof paragraph === "string"
		? paragraph
		: `${paragraph.text} ${paragraph.link.url}`;

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
	[
		...intro.map(toTextParagraph),
		`${action.label}: ${action.url}`,
		...outro.map(toTextParagraph),
	].join("\n\n");

// one email of Brazda: the texts around a button, as HTML and as plain text
export const buildActionEmail = (email: ActionEmail): Email => ({
	to: email.to,
	subject: email.subject,
	html: buildHtml(email),
	text: buildText(email),
});
