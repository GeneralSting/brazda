// one email to one person, the text part is for clients that do not show HTML
export type Email = {
	to: string;
	subject: string;
	html: string;
	text: string;
};

// a link in an email, the label is what the reader clicks
export type EmailLink = { label: string; url: string };

// a paragraph of an email, plain or ending in a link of its own
export type EmailParagraph = string | { text: string; link: EmailLink };

// an email built around one button, its link also written out for a client that blocks the button
export type ActionEmail = {
	to: string;
	subject: string;
	intro: EmailParagraph[]; // above the button
	action: EmailLink;
	outro: EmailParagraph[]; // under the button
};
