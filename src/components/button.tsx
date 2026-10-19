import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "#/utils/cn";

export const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-control transition-colors disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:font-bold disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary font-bold text-primary-foreground hover:bg-primary-hover",
				outline:
					"border border-input bg-card font-semibold text-foreground hover:bg-secondary",
				ghost: "font-semibold text-primary hover:bg-accent",
				destructive:
					"bg-destructive font-bold text-destructive-foreground hover:bg-destructive/90",
				"destructive-outline":
					"border border-destructive bg-card font-bold text-destructive hover:bg-destructive-soft",
			},
			size: {
				lg: "h-14 gap-2.5 px-6 text-lg [&_svg]:size-5.5", // main action of a screen, 56px
				default: "h-12 gap-2 px-5 text-base [&_svg]:size-4.5", // every other button, 48px
				sm: "h-10 gap-2 px-3.5 text-sm [&_svg]:size-4", // only inside alerts and other dense spots, 40px
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = ComponentProps<"button"> &
	VariantProps<typeof buttonVariants>;

export const Button = ({
	className,
	variant,
	size,
	type = "button",
	...props
}: ButtonProps) => (
	<button
		type={type}
		className={cn(buttonVariants({ variant, size }), className)}
		{...props}
	/>
);
