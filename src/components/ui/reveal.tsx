import type { ReactNode } from "react";
import { useLastDefined } from "#/hooks/use-last-defined";
import { cn } from "#/lib/utils";

type RevealProps = {
	open: boolean;
	children?: ReactNode;
	className?: string;
};

/**
 * Opens and closes its content by growing and shrinking its height while fading, so
 * the content under it slides instead of jumping. The content stays until it is closed
 */
export const Reveal = ({ open, children, className }: RevealProps) => {
	const content = useLastDefined(open ? children : undefined);

	return (
		<div
			className={cn(
				"grid transition-[grid-template-rows,opacity] duration-200 ease-out",
				open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
				className,
			)}
		>
			<div className="min-h-0 overflow-hidden">{content}</div>
		</div>
	);
};
