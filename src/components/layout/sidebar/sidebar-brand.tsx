import { Link } from "@tanstack/react-router";
import { Logo } from "#/components/logo";
import { LABEL_CLASSES } from "#/config/sidebar";

// logo at the top that leads home, in the rail only the sign stays
export const SidebarBrand = () => (
	// the sign is 32px and the rail 72px, so 20px of padding centres it in the rail
	<Link
		to="/aplikacija"
		activeOptions={{ exact: true }} // current only on the home page, not on every page under it
		className="flex h-18 shrink-0 items-center px-5"
	>
		<Logo size={32} wordmarkClassName={LABEL_CLASSES} />
	</Link>
);
