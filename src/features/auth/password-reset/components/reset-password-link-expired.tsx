import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import { cn } from "#/utils/cn";

// an expired or used link, the only way on is to ask for a new one
export const ResetPasswordLinkExpired = () => (
	<div className="flex flex-col gap-5">
		<Alert title="Poveznica više ne vrijedi">
			Poveznica za novu lozinku vrijedi sat vremena i može se iskoristiti samo
			jednom. Zatražite novu.
		</Alert>
		<Link
			to="/zaboravljena-lozinka"
			className={cn(buttonVariants({ size: "lg" }), "w-full")}
		>
			Zatraži novu poveznicu
		</Link>
	</div>
);
