import { Lock } from "lucide-react";
import { UPCOMING_NAV } from "#/config/navigation";
import type { UpcomingNavItem } from "#/types/navigation";

const UpcomingItem = ({ item }: { item: UpcomingNavItem }) => (
	<li className="flex h-10 items-center gap-3 px-3.5 text-muted-foreground text-sm">
		<item.icon className="size-5 shrink-0" aria-hidden="true" />
		<span className="flex-1">{item.label}</span>
		<Lock className="size-3.5 shrink-0" aria-hidden="true" />
	</li>
);

// locked modules, they fade out in the rail because as icons alone they say nothing
export const SidebarUpcoming = () => (
	<div className="flex flex-col gap-0.5 overflow-hidden whitespace-nowrap px-3 py-2 transition-[opacity,visibility] duration-200 rail:invisible rail:opacity-0">
		<h2 className="type-overline px-3.5 pt-2 pb-1.5 text-muted-foreground">
			Uskoro
		</h2>
		<ul>
			{UPCOMING_NAV.map((item) => (
				<UpcomingItem key={item.label} item={item} />
			))}
		</ul>
	</div>
);
