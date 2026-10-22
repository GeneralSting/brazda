import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import { cn } from "#/utils/cn";

type SignUpDoneProps = {
	email: string; // the address as typed, on a line of its own so a typo can be seen
};

/**
 * Worded to be true for a new address and for one that already has an account - the
 * same for both, so it tells no one which addresses have one, and the email says the rest
 */
export const SignUpDone = ({ email }: SignUpDoneProps) => (
	<div className="flex flex-col gap-5">
		<Alert tone="success" title="Još samo jedan korak: provjerite e-poštu">
			Poslali smo e-mail na:
			<strong className="block font-bold wrap-anywhere">{email}</strong>U njemu
			je poveznica za postavljanje lozinke, nakon koje se možete prijaviti.
			Poveznica vrijedi 24 sata. Ako već imate račun s ovom adresom, u e-mailu
			piše kako se prijaviti.
		</Alert>
		<Link
			to="/prijava"
			className={cn(buttonVariants({ size: "lg" }), "w-full")}
		>
			Prijavi se
		</Link>
	</div>
);
