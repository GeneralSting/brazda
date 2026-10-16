import { Menu } from "@base-ui/react/menu";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/utils/cn";

/* Menu that opens next to the element that was clicked. Base UI carries the
   behaviour (keyboard, focus, closing on outside click, position on the screen),
   this file only gives it the look of the design system. */

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;

type DropdownMenuContentProps = Omit<Menu.Popup.Props, "className"> &
	Pick<Menu.Positioner.Props, "side" | "align" | "sideOffset"> & {
		className?: string;
	};

export const DropdownMenuContent = ({
	side = "bottom",
	align = "start",
	sideOffset = 8,
	className,
	...props
}: DropdownMenuContentProps) => (
	<Menu.Portal>
		<Menu.Positioner
			side={side}
			align={align}
			sideOffset={sideOffset}
			className="z-50 outline-none"
		>
			{/* fades and grows from the side it is attached to, both on open and on close */}
			<Menu.Popup
				className={cn(
					"min-w-60 origin-(--transform-origin) rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-popover outline-none transition-[opacity,scale] duration-200 ease-out data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0",
					className,
				)}
				{...props}
			/>
		</Menu.Positioner>
	</Menu.Portal>
);

// the highlighted item is the one under the pointer or reached with the arrow keys
const dropdownMenuItemVariants = cva(
	"flex h-11 cursor-pointer select-none items-center gap-3 rounded-lg px-3 text-base outline-none transition-colors duration-200 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
	{
		variants: {
			tone: {
				default:
					"font-medium text-foreground-soft hover:text-foreground-soft data-highlighted:bg-secondary [&_svg]:text-muted-foreground",
				// the page that is open right now
				active:
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

// an item that does something on the spot, e.g. signs the user out
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

/* An item that opens a page. The router link is passed through the render prop,
   and the menu closes on click because the page behind it is replaced. */
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

// line between two groups of items, reaches both edges of the menu
export const DropdownMenuSeparator = ({
	className,
	...props
}: Omit<Menu.Separator.Props, "className"> & { className?: string }) => (
	<Menu.Separator
		className={cn("-mx-1.5 my-1.5 h-px bg-border-subtle", className)}
		{...props}
	/>
);
