import { FormBuilder } from "#/components/form/form-builder";
import type { useForgotPasswordForm } from "../hooks/use-forgot-password-form";

type ForgotPasswordFormProps = {
	form: ReturnType<typeof useForgotPasswordForm>["forgotPasswordForm"];
	error: string | null;
};

// what the page is for in one line, then the address to send the link to
export const ForgotPasswordForm = ({
	form,
	error,
}: ForgotPasswordFormProps) => (
	<div className="flex flex-col gap-5">
		<p className="text-muted-foreground">
			Upišite e-poštu svog računa i poslat ćemo vam poveznicu za novu lozinku.
		</p>
		<FormBuilder form={form} submitText="Pošalji poveznicu" error={error}>
			<form.AppField name="email">
				{(field) => (
					<field.TextField
						label="E-pošta"
						type="email"
						autoComplete="email"
						inputMode="email"
						placeholder="ime@primjer.hr"
					/>
				)}
			</form.AppField>
		</FormBuilder>
	</div>
);
