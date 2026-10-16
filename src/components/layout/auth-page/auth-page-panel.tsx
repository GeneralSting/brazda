import { CalendarClock, ClipboardList, MapIcon } from "lucide-react";
import { cn } from "#/utils/cn";

const FEATURES = [
	{ icon: MapIcon, label: "Parcele iz ARKOD-a na karti" },
	{ icon: ClipboardList, label: "Evidencija gnojidbe i zaštite bilja" },
	{ icon: CalendarClock, label: "Podsjetnik za rokove i uplate" },
];

// green panel on the right of a wide screen, says in a few words what the application is for
export const AuthPagePanel = ({ className }: { className?: string }) => (
	<aside
		className={cn(
			"flex-col justify-end gap-6 bg-primary p-10 text-primary-foreground",
			className,
		)}
	>
		<p className="type-page-title text-pretty">
			Parcele, radovi, rokovi i dokumenti gospodarstva na jednom mjestu.
		</p>
		<ul className="flex flex-col gap-3 text-accent">
			{FEATURES.map((feature) => (
				<li key={feature.label} className="flex items-center gap-3">
					<feature.icon className="size-5 shrink-0" aria-hidden="true" />
					{feature.label}
				</li>
			))}
		</ul>
	</aside>
);
