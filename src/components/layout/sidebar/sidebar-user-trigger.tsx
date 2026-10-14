import { ChevronsUpDown } from "lucide-react";
import type { ShellUser } from "#/components/layout/types";
import { Avatar } from "#/components/ui/avatar";
import { DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { cn } from "#/lib/utils";
import { LABEL_CLASSES, ROW_CLASSES } from "./constants";

type SidebarUserTriggerProps = {
	user: ShellUser;
	// one of the user's own pages is open
	active: boolean;
};

// row with the signed-in person that opens the user menu
export const SidebarUserTrigger = ({
	user,
	active,
}: SidebarUserTriggerProps) => (
	<DropdownMenuTrigger
		title={`${user.name}, ${user.holdingName}`}
		className={cn(
			ROW_CLASSES,
			// 6px of padding centres the 36px circle in the 48px row of the rail
			"h-14 w-full cursor-pointer gap-2.5 px-1.5 text-left text-foreground",
			active ? "bg-accent" : "hover:bg-secondary data-popup-open:bg-secondary",
		)}
	>
		<Avatar name={user.name} tone={active ? "raised" : "default"} />
		<span className={cn("flex min-w-0 flex-1 flex-col", LABEL_CLASSES)}>
			<span className="truncate font-semibold text-base">{user.name}</span>
			<span className="truncate text-muted-foreground text-sm">
				{user.holdingName}
			</span>
		</span>
		<ChevronsUpDown
			className={cn(
				"mr-1.5 size-4 shrink-0 text-muted-foreground",
				LABEL_CLASSES,
			)}
			aria-hidden="true"
		/>
	</DropdownMenuTrigger>
);
