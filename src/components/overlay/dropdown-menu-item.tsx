import { Menu } from "@base-ui/react/menu";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/utils/cn";

// the highlighted item is the one under the pointer or reached with the arrow keys
const dropdownMenuItemVariants = cva(
	"flex h-11 cursor-pointer select-none items-center gap-3 rounded-lg px-3 text-base outline-none transition-colors duration-200 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
	{
		variants: {
			tone: {
				default:
					"font-medium text-foreground-soft hover:text-foreground-soft data-highlighted:bg-secondary [&_svg]:text-muted-foreground",
				active: // the page that is open right now
					"bg-accent font-bold text-accent-foreground hover:text-accent-foreground",
				destructive:
					"font-semibold text-destructive data-highlighted:bg-destructive-soft",
			},
		},
		defaultVariants: {
			tone: "default",
		},
	},
);

type DropdownMenuItemTone = VariantProps<typeof dropdownMenuItemVariants>;

type DropdownMenuItemProps = Omit<Menu.Item.Props, "className"> &
	DropdownMenuItemTone & {
		className?: string;
	};

// an item that does something on the spot, (e.g. signs the user out)
export const DropdownMenuItem = ({
	tone,
	className,
	...props
}: DropdownMenuItemProps) => (
	<Menu.Item
		className={cn(dropdownMenuItemVariants({ tone }), className)}
		{...props}
	/>
);

type DropdownMenuLinkItemProps = Omit<Menu.LinkItem.Props, "className"> &
	DropdownMenuItemTone & {
		className?: string;
	};

/**
 * An item that opens a page, with the same look as DropMenuItem. The router link is passed
 * through the render prop, and the menu closes on click because the page behind it is replaced
 */
export const DropdownMenuLinkItem = ({
	tone,
	className,
	closeOnClick = true,
	...props
}: DropdownMenuLinkItemProps) => (
	<Menu.LinkItem
		closeOnClick={closeOnClick}
		className={cn(dropdownMenuItemVariants({ tone }), className)}
		{...props}
	/>
);
