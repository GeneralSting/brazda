import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingHighlights } from "./landing-highlights";

type LandingPageProps = {
	signedIn: boolean; // the links lead into the application instead of to sign in
};

/**
 * The public page about Brazda at the root path, outside the shell. For now it says
 * in a sentence what the application is and leads to sign-up and sign-in, the full
 * presentation comes later
 */
export const LandingPage = ({ signedIn }: LandingPageProps) => (
	<div className="flex min-h-dvh flex-col">
		<LandingHeader signedIn={signedIn} />
		<main className="page-gutter flex flex-1 flex-col justify-center py-8">
			<div className="flex w-full max-w-160 flex-col gap-8 self-center">
				<LandingHero signedIn={signedIn} />
				<LandingHighlights />
			</div>
		</main>
	</div>
);
