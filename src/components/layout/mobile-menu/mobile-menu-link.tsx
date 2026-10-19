import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { MOBILE_MENU_ROW_CLASSES } from "#/config/mobile-menu";
import type { NavItem } from "#/types/navigation";
import { cn } from "#/utils/cn";

type MenuLinkProps = {
	item: NavItem;
};

export const MobileMenuLink = ({ item }: MenuLinkProps) => (
	<Link
		to={item.to}
		className={cn(
			MOBILE_MENU_ROW_CLASSES,
			"text-foreground hover:text-foreground",
		)}
	>
		<item.icon className="size-5.5 shrink-0 text-primary" aria-hidden="true" />
		<span className="flex-1">{item.label}</span>
		<ChevronRight
			className="size-5 shrink-0 text-muted-foreground"
			aria-hidden="true"
		/>
	</Link>
);
