import type { ComponentProps } from "react";
import { cn } from "#/utils/cn";

// white surface with a border, shadows are kept for menus and dialogs
export const Card = ({ className, ...props }: ComponentProps<"div">) => (
	<div
		className={cn(
			"rounded-xl border border-border bg-card text-card-foreground",
			className,
		)}
		{...props}
	/>
);
