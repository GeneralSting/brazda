import type { ReactNode } from "react";
import { cn } from "#/utils/cn";

type PageProps = {
	title: string;
	// line above the title, e.g. the date on the home page
	eyebrow?: ReactNode;
	// buttons at the end of the title row
	actions?: ReactNode;
	className?: string;
	children: ReactNode;
};

// content area of one screen: page gutter, title row and the spacing between blocks
export const Page = ({
	title,
	eyebrow,
	actions,
	className,
	children,
}: PageProps) => (
	<main
		className={cn(
			"page-gutter flex flex-1 flex-col gap-5 pt-4 pb-5 lg:gap-6 lg:py-8",
			className,
		)}
	>
		{/* as high as the main button on desktop, so the title sits at the same
		    height on every screen, with or without an action next to it */}
		<header className="flex items-center justify-between gap-6 lg:min-h-14">
			<div className="flex min-w-0 flex-col gap-0.5 lg:gap-1">
				{eyebrow ? (
					<span className="type-small text-muted-foreground">{eyebrow}</span>
				) : null}
				<h1 className="type-page-title">{title}</h1>
			</div>
			{actions}
		</header>
		{children}
	</main>
);
