import { PRIVACY_PATH, TERMS_PATH } from "#/config/legal";

const LINK_CLASSES = "font-semibold underline underline-offset-2";

// the consent sentence, both documents open in a new tab so the filled form stays
export const SignUpFormTerms = () => (
	<>
		Prihvaćam{" "}
		<a
			href={TERMS_PATH}
			target="_blank"
			rel="noopener noreferrer"
			className={LINK_CLASSES}
		>
			Uvjete korištenja
		</a>{" "}
		i{" "}
		<a
			href={PRIVACY_PATH}
			target="_blank"
			rel="noopener noreferrer"
			className={LINK_CLASSES}
		>
			Politiku privatnosti
		</a>
		.
	</>
);
