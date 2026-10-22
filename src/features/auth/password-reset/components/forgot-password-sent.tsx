import { Button } from "#/components/button";

type ForgotPasswordSentProps = {
	email: string; // the address as typed, so a typo can be seen
	onRetry: () => void;
};

/**
 * Shown after the request, worded the same whether the account exists or not. The
 * typed address stands out, a wrong one is fixed by going back to the form
 */
export const ForgotPasswordSent = ({
	email,
	onRetry,
}: ForgotPasswordSentProps) => (
	<div role="status" className="flex flex-col gap-5">
		<p>
			Poveznicu za novu lozinku poslali smo na:
			<strong className="block font-bold wrap-anywhere">{email}</strong>
			ako s njom postoji račun. Poveznica vrijedi sat vremena.
		</p>
		<p className="text-muted-foreground">
			Ne vidite e-poštu? Provjerite je li adresa točna i pogledajte mapu
			neželjene pošte.
		</p>
		<p className="text-muted-foreground">
			Poveznicu šaljemo samo za račun s potvrđenom e-poštom. Ako je još niste
			potvrdili, ponovno se registrirajte istom adresom, potvrdite e-poštu pa
			zatražite novu lozinku.
		</p>
		<Button variant="outline" onClick={onRetry}>
			Upiši drugu adresu
		</Button>
	</div>
);
