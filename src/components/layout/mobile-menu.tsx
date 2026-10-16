import { Link } from "@tanstack/react-router";
import { ChevronRight, Lock, LogOut } from "lucide-react";
import { Avatar } from "#/components/display/avatar";
import { Card } from "#/components/display/card";
import {
	MOBILE_ACCOUNT_NAV,
	MOBILE_MENU_NAV,
	PROFILE_PATH,
	UPCOMING_NAV,
} from "#/config/navigation";
import type { NavItem } from "#/types/navigation";
import type { ShellUser } from "#/types/user";
import { cn } from "#/utils/cn";

const ROW_CLASSES =
	"type-body flex h-14 items-center gap-3.5 border-border-subtle border-t px-4 font-semibold first:border-t-0";

const MenuLink = ({ item }: { item: NavItem }) => (
	<Link
		to={item.to}
		className={cn(ROW_CLASSES, "text-foreground hover:text-foreground")}
	>
		<item.icon className="size-5.5 shrink-0 text-primary" aria-hidden="true" />
		<span className="flex-1">{item.label}</span>
		<ChevronRight
			className="size-5 shrink-0 text-muted-foreground"
			aria-hidden="true"
		/>
	</Link>
);

type MobileMenuProps = {
	user: ShellUser;
	onSignOut: () => void;
};

// everything the mobile tab bar has no room for, the content of the menu page
export const MobileMenu = ({ user, onSignOut }: MobileMenuProps) => (
	<>
		<Card>
			<Link
				to={PROFILE_PATH}
				className="flex items-center gap-3 px-4 py-3.5 text-foreground hover:text-foreground"
			>
				<Avatar name={user.name} size="lg" />
				<span className="flex min-w-0 flex-1 flex-col">
					<span className="type-body truncate font-bold">{user.name}</span>
					<span className="truncate text-muted-foreground text-sm">
						{user.holdingName}
					</span>
				</span>
				<ChevronRight
					className="size-5 shrink-0 text-muted-foreground"
					aria-hidden="true"
				/>
			</Link>
		</Card>

		<Card className="flex flex-col">
			{MOBILE_MENU_NAV.map((item) => (
				<MenuLink key={item.to} item={item} />
			))}
		</Card>

		<h2 className="type-overline mt-1 text-muted-foreground">Uskoro</h2>
		<ul className="flex flex-col rounded-xl bg-muted text-muted-foreground">
			{UPCOMING_NAV.map((item) => (
				<li
					key={item.label}
					className="type-body flex h-13 items-center gap-3.5 border-border border-t px-4 first:border-t-0"
				>
					<item.icon className="size-5 shrink-0" aria-hidden="true" />
					<span className="flex-1">{item.label}</span>
					<Lock className="size-4 shrink-0" aria-hidden="true" />
				</li>
			))}
		</ul>

		{/* same two parts as the user menu of the sidebar: pages, then signing out */}
		<Card className="flex flex-col">
			{MOBILE_ACCOUNT_NAV.map((item) => (
				<MenuLink key={item.to} item={item} />
			))}
			<button
				type="button"
				onClick={onSignOut}
				className={cn(ROW_CLASSES, "cursor-pointer text-destructive")}
			>
				<LogOut className="size-5.5 shrink-0" aria-hidden="true" />
				Odjava
			</button>
		</Card>
	</>
);
