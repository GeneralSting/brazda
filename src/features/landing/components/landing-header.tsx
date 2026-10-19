import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Logo } from "#/components/logo";

type LandingHeaderProps = {
	signedIn: boolean;
};

// logo on the left, the way in on the right - into the application or to sign in
export const LandingHeader = ({ signedIn }: LandingHeaderProps) => (
	<header className="page-gutter flex h-18 items-center justify-between">
		<Logo size={32} />
		<Link
			to={signedIn ? "/aplikacija" : "/prijava"}
			className={buttonVariants({ variant: "ghost" })}
		>
			{signedIn ? "Otvori aplikaciju" : "Prijava"}
		</Link>
	</header>
);
