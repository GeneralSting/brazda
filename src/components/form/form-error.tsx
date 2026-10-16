import { Reveal } from "#/components/reveal";
import { FieldMessage } from "./field-message";

/**
 * Error of the whole form, not of one field (wrong email and password together, no
 * answer from the server...). It stands between the last field and the submit button,
 * as far from both, so it reads as the reason the form was not sent
 */
export const FormError = ({ message }: { message?: string | null }) => (
	<Reveal open={Boolean(message)}>
		<div className="pt-5" role="alert">
			<FieldMessage tone="error">{message}</FieldMessage>
		</div>
	</Reveal>
);
