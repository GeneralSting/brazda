import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

type FieldProps = {
	label: string;
	// id of the control, connects the label with it
	htmlFor: string;
	// shown next to the label, e.g. a "Provjerite" badge
	labelAddon?: ReactNode;
	// helper text under the control
	hint?: ReactNode;
	// error text under the control, replaces the hint
	error?: ReactNode;
	// renders the hint in the warning colour
	warning?: boolean;
	className?: string;
	children: ReactNode;
};

// label, control and the message under it
export const Field = ({
	label,
	htmlFor,
	labelAddon,
	hint,
	error,
	warning = false,
	className,
	children,
}: FieldProps) => (
	<div className={cn("flex flex-col gap-2", className)}>
		<div className="flex items-center gap-2">
			<label htmlFor={htmlFor} className="type-label">
				{label}
			</label>
			{labelAddon}
		</div>
		{children}
		{error ? (
			<p
				id={`${htmlFor}-message`}
				className="type-small flex items-center gap-1.5 font-semibold text-destructive"
			>
				<CircleAlert className="size-4 shrink-0" aria-hidden="true" />
				{error}
			</p>
		) : hint ? (
			<p
				id={`${htmlFor}-message`}
				className={cn(
					"type-small",
					warning ? "text-warning" : "text-muted-foreground",
				)}
			>
				{hint}
			</p>
		) : null}
	</div>
);
