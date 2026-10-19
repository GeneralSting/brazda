import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { PRODUCT_AUDIENCE, PRODUCT_TAGLINE } from "#/config/product";
import { cn } from "#/utils/cn";

type LandingHeroProps = {
	signedIn: boolean;
};

const ACTION_CLASSES = "w-full sm:w-auto";

/**
 * What Brazda is and the first step: a new account, or signing in for someone who
 * has one. A signed-in visitor gets only the way into the application
 */
export const LandingHero = ({ signedIn }: LandingHeroProps) => (
	<div className="flex flex-col gap-6">
		<div className="flex flex-col gap-3">
			<h1 className="type-page-title text-pretty">{PRODUCT_TAGLINE}</h1>
			<p className="text-muted-foreground">{PRODUCT_AUDIENCE}</p>
		</div>
		<div className="flex flex-col gap-3 sm:flex-row">
			{signedIn ? (
				<Link
					to="/aplikacija"
					className={cn(buttonVariants({ size: "lg" }), ACTION_CLASSES)}
				>
					Otvori aplikaciju
				</Link>
			) : (
				<>
					<Link
						to="/registracija"
						className={cn(buttonVariants({ size: "lg" }), ACTION_CLASSES)}
					>
						Napravite račun
					</Link>
					<Link
						to="/prijava"
						className={cn(
							buttonVariants({ variant: "outline", size: "lg" }),
							ACTION_CLASSES,
						)}
					>
						Prijava
					</Link>
				</>
			)}
		</div>
	</div>
);
