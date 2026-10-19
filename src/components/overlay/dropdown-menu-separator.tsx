import { Menu } from "@base-ui/react/menu";
import { cn } from "#/utils/cn";

type DropdownMenuSeparatorProps = Omit<Menu.Separator.Props, "className"> & {
	className?: string;
};

// line between two groups of items, reaches both edges of the menu
export const DropdownMenuSeparator = ({
	className,
	...props
}: DropdownMenuSeparatorProps) => (
	<Menu.Separator
		className={cn("-mx-1.5 my-1.5 h-px bg-border-subtle", className)}
		{...props}
	/>
);
