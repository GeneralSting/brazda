// one email to one person, the text part is for clients that do not show HTML
export type Email = {
	to: string;
	subject: string;
	html: string;
	text: string;
};

// an email built around one button, its link also written out for a client that blocks the button
export type ActionEmail = {
	to: string;
	subject: string;
	intro: string[]; // paragraphs above the button
	action: { label: string; url: string };
	outro: string[]; // paragraphs under the button
};
