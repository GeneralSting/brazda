import { Menu } from "@base-ui/react/menu";

/**
 * Menu that opens next to the element that was clicked. Base UI carries the
 * behavior (keyboard, focus, closing on outside click, position on the screen).
 * The root and trigger have no look of their own and are passed through as they are
 */
export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
