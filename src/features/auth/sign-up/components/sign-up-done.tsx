import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import { cn } from "#/utils/cn";

type SignUpDoneProps = {
	email: string; // the address as typed, so a typo can be seen
};

/**
 * The account is made but waits for its address. Worded the same for an address that
 * already had an account, whose owner gets an email instead
 */
export const SignUpDone = ({ email }: SignUpDoneProps) => (
	<div className="flex flex-col gap-5">
		<Alert tone="success" title="Registracija je uspješna">
			Poslali smo poveznicu za potvrdu na{" "}
			<strong className="break-all font-bold">{email}</strong>. Potvrdite
			e-poštu pa se prijavite. Poveznica vrijedi 24 sata, a ako je ne vidite,
			pogledajte mapu neželjene pošte.
		</Alert>
		<Link
			to="/prijava"
			className={cn(buttonVariants({ size: "lg" }), "w-full")}
		>
			Prijavi se
		</Link>
	</div>
);
