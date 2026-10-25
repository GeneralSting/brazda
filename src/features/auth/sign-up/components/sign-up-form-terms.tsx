import { LegalLink } from "#/components/auth/legal-link";
import { PRIVACY_PATH, TERMS_PATH } from "#/config/legal";

// the consent sentence, both documents open in a new tab so the filled form stays
export const SignUpFormTerms = () => (
	<>
		Prihvaćam <LegalLink href={TERMS_PATH}>Uvjete korištenja</LegalLink> i{" "}
		<LegalLink href={PRIVACY_PATH}>Politiku privatnosti</LegalLink>.
	</>
);
