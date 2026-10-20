import { FormBuilder } from "#/components/form/form-builder";
import type { useResetPasswordForm } from "../hooks/use-reset-password-form";

type ResetPasswordFormProps = {
	form: ReturnType<typeof useResetPasswordForm>["resetPasswordForm"];
	error: string | null;
};

export const ResetPasswordForm = ({ form, error }: ResetPasswordFormProps) => (
	<div className="flex flex-col gap-5">
		<p className="text-muted-foreground">
			Upišite novu lozinku za svoj račun. Kad je spremite, bit ćete odjavljeni
			sa svih uređaja.
		</p>
		<FormBuilder form={form} submitText="Spremi lozinku" error={error}>
			<form.AppField name="password">
				{(field) => (
					<field.TextField
						label="Nova lozinka"
						type="password"
						autoComplete="new-password"
						placeholder="••••••••"
						hint="Najmanje 8 znakova."
					/>
				)}
			</form.AppField>
		</FormBuilder>
	</div>
);
