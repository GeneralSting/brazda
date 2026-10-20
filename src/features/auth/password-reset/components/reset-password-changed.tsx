import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import { cn } from "#/utils/cn";

// the new password is saved and every session is gone, this device included
export const ResetPasswordChanged = () => (
	<div className="flex flex-col gap-5">
		<Alert tone="success" title="Lozinka je promijenjena">
			Odjavljeni ste sa svih uređaja na kojima ste bili prijavljeni. Prijavite
			se novom lozinkom.
		</Alert>
		<Link
			to="/prijava"
			className={cn(buttonVariants({ size: "lg" }), "w-full")}
		>
			Prijavi se
		</Link>
	</div>
);
