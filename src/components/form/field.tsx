import type { ReactNode } from "react";
import { Reveal } from "#/components/reveal";
import { cn } from "#/utils/cn";
import { FieldMessage } from "./field-message";

type FieldProps = {
	label: string;
	// id of the control, connects the label with it
	htmlFor: string;
	// shown next to the label, e.g. a "Provjerite" badge
	labelAddon?: ReactNode;
	// at the right end of the label row, e.g. a "Zaboravili ste?" link
	labelAction?: ReactNode;
	// helper text under the control
	hint?: ReactNode;
	// error text under the control, replaces the hint
	error?: ReactNode;
	// renders the hint in the warning colour
	warning?: boolean;
	className?: string;
	children: ReactNode;
};

// label, control and the message under it, the message slides in instead of jumping
export const Field = ({
	label,
	htmlFor,
	labelAddon,
	labelAction,
	hint,
	error,
	warning = false,
	className,
	children,
}: FieldProps) => (
	<div className={cn("flex flex-col", className)}>
		{/* fixed at one line, so a taller addon or action never moves the control down */}
		<div className="mb-2 flex h-6 items-center gap-2">
			<label htmlFor={htmlFor} className="type-label">
				{label}
			</label>
			{labelAddon}
			{/* same type as the label, whatever is put there */}
			{labelAction ? (
				<div className="type-label ml-auto">{labelAction}</div>
			) : null}
		</div>
		{children}
		{/* the space above the message belongs to it, so a closed message leaves no gap */}
		<Reveal open={Boolean(error || hint)}>
			<div className="pt-2">
				<FieldMessage
					id={`${htmlFor}-message`}
					tone={error ? "error" : warning ? "warning" : "hint"}
				>
					{error ?? hint}
				</FieldMessage>
			</div>
		</Reveal>
	</div>
);
