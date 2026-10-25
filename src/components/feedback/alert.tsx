import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "#/utils/cn";

const alertVariants = cva("flex items-start gap-3 rounded-xl border p-4", {
	variants: {
		tone: {
			destructive: "border-destructive-border bg-destructive-soft", // something failed, with what happened and what the user can do
			warning: "border-warning-border bg-warning-soft", // something waits for the user to check it
			success: "border-accent-border bg-accent", // something the user did went through, with what follows from it
		},
	},
	defaultVariants: {
		tone: "destructive",
	},
});

const TONE_STYLES = {
	destructive: {
		icon: "text-destructive",
		title: "text-destructive-title",
		text: "text-destructive-text",
	},
	warning: {
		icon: "text-warning",
		title: "text-warning-text",
		text: "text-warning-text",
	},
	success: {
		icon: "text-primary",
		title: "text-accent-foreground",
		text: "text-accent-foreground",
	},
};

const TONE_ICONS = {
	destructive: <CircleAlert aria-hidden="true" />,
	warning: <TriangleAlert aria-hidden="true" />,
	success: <CircleCheck aria-hidden="true" />,
};

type AlertProps = VariantProps<typeof alertVariants> & {
	title: string;
	children?: ReactNode;
	icon?: ReactNode; // replaces the default icon of the tone
	action?: ReactNode; // button offered next to the message (e.g. "Pokušaj ponovno")
	className?: string;
};

// message shown in place, the tone always comes with an icon and words
export const Alert = ({
	tone,
	title,
	children,
	icon,
	action,
	className,
}: AlertProps) => {
	const resolvedTone = tone ?? "destructive";
	const styles = TONE_STYLES[resolvedTone];

	return (
		<div
			// only errors interrupt a screen reader, a warning or a success is read in turn
			role={resolvedTone === "destructive" ? "alert" : "status"}
			className={cn(alertVariants({ tone }), className)}
		>
			{/* as high as the title line, so the icon sits centred on it */}
			<span
				className={cn(
					"flex h-6 shrink-0 items-center [&_svg]:size-5.5",
					styles.icon,
				)}
			>
				{icon ?? TONE_ICONS[resolvedTone]}
			</span>
			{/* the action drops under the text on narrow screens */}
			<div className="flex min-w-0 flex-1 flex-col items-start gap-3 sm:flex-row">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<p className={cn("type-label font-bold", styles.title)}>{title}</p>
					{children ? (
						<p className={cn("type-small", styles.text)}>{children}</p>
					) : null}
				</div>
				{action}
			</div>
		</div>
	);
};
