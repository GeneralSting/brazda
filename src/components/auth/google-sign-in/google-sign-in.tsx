import { Badge } from "#/components/feedback/badge";
import type { GoogleSignInPage } from "#/types/auth";
import { GoogleSignInButton } from "./google-sign-in-button";
import { GoogleSignInConsent } from "./google-sign-in-consent";
import { GoogleSignInError } from "./google-sign-in-error";

type GoogleSignInProps = {
	page: GoogleSignInPage; // the page it stands on, Google returns there when it fails
	error?: string; // the code Google returned with, shown above the block
};

// the recommended way in, first on the sign-in and the sign-up page, with its consent under it
export const GoogleSignIn = ({ page, error }: GoogleSignInProps) => (
	<>
		<GoogleSignInError code={error} />
		<div className="flex flex-col gap-2">
			<Badge tone="success" size="sm" className="self-end">
				Preporučeno
			</Badge>
			<GoogleSignInButton page={page} />
			<GoogleSignInConsent />
		</div>
	</>
);
