import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

type FieldMessageProps = {
	tone: "error" | "warning" | "hint";
	id?: string;
	children: ReactNode;
};

// one line under a field, or between the last field and the submit button for the whole form
export const FieldMessage = ({ tone, id, children }: FieldMessageProps) =>
	tone === "error" ? (
		<p
			id={id}
			className="type-small flex items-start gap-1.5 font-semibold text-destructive"
		>
			{/* as high as one line of text, so the icon sits on the first line */}
			<span className="flex h-6 shrink-0 items-center lg:h-5">
				<CircleAlert className="size-4" aria-hidden="true" />
			</span>
			<span>{children}</span>
		</p>
	) : (
		<p
			id={id}
			className={cn(
				"type-small",
				tone === "warning" ? "text-warning" : "text-muted-foreground",
			)}
		>
			{children}
		</p>
	);
