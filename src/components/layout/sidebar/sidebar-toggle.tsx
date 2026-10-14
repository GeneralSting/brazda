import { ChevronsLeft } from "lucide-react";
import { cn } from "#/lib/utils";
import { LABEL_CLASSES, ROW_CLASSES } from "./constants";

type SidebarToggleProps = {
	onToggle: () => void;
	className?: string;
};

// row that switches between the full sidebar and the rail of icons
export const SidebarToggle = ({ onToggle, className }: SidebarToggleProps) => (
	<div className={cn("px-3 pb-3", className)}>
		<button
			type="button"
			onClick={onToggle}
			title="Skupi ili proširi izbornik"
			className={cn(
				ROW_CLASSES,
				"h-11 w-full cursor-pointer gap-3 px-3.5 font-medium text-base text-foreground-soft hover:bg-secondary",
			)}
		>
			{/* points left to collapse, turns around in the rail to point right */}
			<ChevronsLeft
				className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 rail:rotate-180"
				aria-hidden="true"
			/>
			<span className={LABEL_CLASSES}>Skupi izbornik</span>
		</button>
	</div>
);
