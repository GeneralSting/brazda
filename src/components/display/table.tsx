import type { ComponentProps } from "react";
import { cn } from "#/utils/cn";

// the wrapper carries the card look and scrolls sideways when the table is too wide
export const Table = ({ className, ...props }: ComponentProps<"table">) => (
	<div className="overflow-x-auto rounded-xl border border-border bg-card">
		<table
			className={cn("w-full border-collapse text-left text-base", className)}
			{...props}
		/>
	</div>
);

export const TableHeader = ({
	className,
	...props
}: ComponentProps<"thead">) => (
	<thead className={cn("bg-secondary", className)} {...props} />
);

export const TableBody = ({ className, ...props }: ComponentProps<"tbody">) => (
	<tbody className={className} {...props} />
);

export const TableRow = ({ className, ...props }: ComponentProps<"tr">) => (
	<tr
		className={cn("border-border-subtle border-t first:border-t-0", className)}
		{...props}
	/>
);

export const TableHead = ({ className, ...props }: ComponentProps<"th">) => (
	<th
		scope="col"
		className={cn(
			"h-11 whitespace-nowrap px-4 font-bold text-muted-foreground text-sm",
			className,
		)}
		{...props}
	/>
);

// rows are 52px high
export const TableCell = ({ className, ...props }: ComponentProps<"td">) => (
	<td className={cn("h-13 whitespace-nowrap px-4", className)} {...props} />
);
