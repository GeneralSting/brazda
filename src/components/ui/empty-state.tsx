import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

type EmptyStateProps = {
	icon: ReactNode;
	title: string;
	description?: ReactNode;
	// the first step the user can take from here
	action?: ReactNode;
	className?: string;
};

// placeholder for a list that has no items yet
export const EmptyState = ({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) => (
	<div
		className={cn(
			"flex flex-col items-center gap-2.5 rounded-xl border border-input border-dashed bg-card p-7 text-center",
			className,
		)}
	>
		<div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6.5">
			{icon}
		</div>
		<p className="type-body font-bold">{title}</p>
		{description ? (
			<p className="type-small max-w-85 text-muted-foreground">{description}</p>
		) : null}
		{action ? <div className="mt-1.5">{action}</div> : null}
	</div>
);
