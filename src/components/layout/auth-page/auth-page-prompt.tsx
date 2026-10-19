import { Link, type LinkProps } from "@tanstack/react-router";

type AuthPagePromptProps = {
	question: string;
	to: NonNullable<LinkProps["to"]>;
	children: string; // the link text
};

/**
 * The way to the other auth screen, under the form. On a phone the question and the
 * link are stacked and the link gets a large touch area, from lg they share one line
 */
export const AuthPagePrompt = ({
	question,
	to,
	children,
}: AuthPagePromptProps) => (
	<p className="flex flex-col items-center gap-1 lg:flex-row lg:justify-center lg:gap-1.5">
		<span className="text-muted-foreground">{question}</span>
		<Link
			to={to}
			className="px-4 py-2.5 font-bold text-primary hover:text-primary-hover lg:p-0"
		>
			{children}
		</Link>
	</p>
);
