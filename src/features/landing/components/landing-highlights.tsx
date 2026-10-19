import { PRODUCT_HIGHLIGHTS } from "#/config/product";

// the main things the application does, one per row with its icon
export const LandingHighlights = () => (
	<ul className="flex flex-col gap-3">
		{PRODUCT_HIGHLIGHTS.map((highlight) => (
			<li key={highlight.label} className="flex items-center gap-3">
				<highlight.icon
					className="size-5 shrink-0 text-primary"
					aria-hidden="true"
				/>
				{highlight.label}
			</li>
		))}
	</ul>
);
