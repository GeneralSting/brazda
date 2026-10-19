import type { ComponentProps, ReactNode } from "react";
import { cn } from "#/utils/cn";

type InputProps = ComponentProps<"input"> & {
	suffix?: ReactNode; // unit or icon shown at the end of the field (e.g. "kg/ha")
	warning?: boolean; // amber state for a value the user should double check (e.g. uncertain OCR result)
};

/**
 * The border lives on the wrapper so the suffix sits inside the field.
 * Error state is driven by aria-invalid, the same attribute screen readers use
 */
export const Input = ({
	className,
	suffix,
	warning = false,
	type = "text",
	...props
}: InputProps) => (
	<div
		data-warning={warning || undefined}
		className={cn(
			"flex h-12 items-center gap-2 rounded-control border border-input bg-card px-3.5 text-lg transition-[border-color,box-shadow] duration-200",
			"focus-within:border-primary focus-within:inset-ring-1 focus-within:inset-ring-primary",
			"has-aria-invalid:border-destructive has-aria-invalid:inset-ring-1 has-aria-invalid:inset-ring-destructive",
			"data-warning:border-warning-strong data-warning:bg-warning-field data-warning:inset-ring-1 data-warning:inset-ring-warning-strong",
			"has-disabled:bg-muted has-disabled:text-disabled-foreground",
			className,
		)}
	>
		<input
			type={type}
			className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-disabled-foreground disabled:cursor-not-allowed"
			{...props}
		/>
		{suffix ? (
			<span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-5">
				{suffix}
			</span>
		) : null}
	</div>
);
