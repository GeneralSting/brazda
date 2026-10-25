import type { ReactNode } from "react";

type LegalLinkProps = {
	href: string;
	children: ReactNode;
};

// a link to the terms or the privacy policy, in a new tab so a filled form stays
export const LegalLink = ({ href, children }: LegalLinkProps) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="font-semibold underline underline-offset-2"
	>
		{children}
	</a>
);
