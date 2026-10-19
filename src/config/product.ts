import { CalendarClock, ClipboardList, MapIcon } from "lucide-react";

// what Brazda is in one sentence, on the public page and on the green panel of the auth screens
export const PRODUCT_TAGLINE =
	"Parcele, radovi, rokovi i dokumenti gospodarstva na jednom mjestu.";

// who it is for, under the sentence on the public page
export const PRODUCT_AUDIENCE =
	"Za OPG-ove i druga poljoprivredna gospodarstva u Hrvatskoj.";

// the main things the application does, each with its icon
export const PRODUCT_HIGHLIGHTS = [
	{ icon: MapIcon, label: "Parcele iz ARKOD-a na karti" },
	{ icon: ClipboardList, label: "Evidencija gnojidbe i zaštite bilja" },
	{ icon: CalendarClock, label: "Podsjetnik za rokove i uplate" },
];
