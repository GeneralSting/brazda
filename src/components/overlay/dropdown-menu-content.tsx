import { Menu } from "@base-ui/react/menu";
import { cn } from "#/utils/cn";

type DropdownMenuContentProps = Omit<Menu.Popup.Props, "className"> &
	Pick<Menu.Positioner.Props, "side" | "align" | "sideOffset"> & {
		className?: string;
	};

// the panel with the items, placed on the screen next to the trigger
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
