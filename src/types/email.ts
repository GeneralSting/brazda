// one email to one person, the text part is for clients that do not show HTML
export type Email = {
	to: string;
	subject: string;
	html: string;
	text: string;
};
