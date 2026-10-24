import { Badge } from "#/components/feedback/badge";
import { GoogleSignInButton } from "./google-sign-in-button";
import { GoogleSignInConsent } from "./google-sign-in-consent";

// the recommended way in, first on the sign-in and the sign-up page, with its consent under it
export const GoogleSignIn = () => (
	<div className="flex flex-col gap-2">
		<Badge tone="success" size="sm" className="self-end">
			Preporučeno
		</Badge>
		<GoogleSignInButton />
		<GoogleSignInConsent />
	</div>
);
