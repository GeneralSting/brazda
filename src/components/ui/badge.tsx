import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "#/lib/utils";

/* Status badge. Colour is never the only signal, so a badge always carries
   a word and, at the default size, an icon passed as a child. */
export const badgeVariants = cva(
	"inline-flex shrink-0 items-center whitespace-nowrap rounded-full border font-bold [&_svg]:shrink-0",
	{
		variants: {
			tone: {
				// urgent: deadline in 7 days or less, or already passed
				destructive:
					"border-destructive-border bg-destructive-soft text-destructive",
				// soon (8 to 30 days) and values waiting for a check
				warning: "border-warning-border bg-warning-soft text-warning",
				// resolved or inactive, grey on purpose so it does not draw attention
				neutral: "border-border bg-muted text-muted-foreground",
				// saved, confirmed
				success: "border-accent-border bg-accent text-accent-foreground",
			},
			size: {
				default: "h-7 gap-1.5 px-3 text-sm [&_svg]:size-4",
				sm: "h-6 px-2 text-sm",
			},
		},
		defaultVariants: {
			tone: "neutral",
			size: "default",
		},
	},
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export const Badge = ({ className, tone, size, ...props }: BadgeProps) => (
	<span className={cn(badgeVariants({ tone, size }), className)} {...props} />
);
