import { LegalLink } from "#/components/auth/legal-link";
import { PRIVACY_PATH, TERMS_PATH } from "#/config/legal";

// the click on the button is the consent of an account Google makes, on sign-in as on sign-up
export const GoogleSignInConsent = () => (
	<p className="type-small text-muted-foreground">
		Klikom na „Nastavi s Google računom” prihvaćate{" "}
		<LegalLink href={TERMS_PATH}>Uvjete korištenja</LegalLink> i potvrđujete da
		ste pročitali{" "}
		<LegalLink href={PRIVACY_PATH}>Politiku privatnosti</LegalLink>.
	</p>
);
