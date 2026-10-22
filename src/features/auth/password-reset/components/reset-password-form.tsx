import { FormBuilder } from "#/components/form/form-builder";
import type { PasswordLinkTexts } from "#/types/auth";
import type { useResetPasswordForm } from "../hooks/use-reset-password-form";

type ResetPasswordFormProps = {
	form: ReturnType<typeof useResetPasswordForm>["resetPasswordForm"];
	error: string | null;
	texts: PasswordLinkTexts;
};

export const ResetPasswordForm = ({
	form,
	error,
	texts,
}: ResetPasswordFormProps) => (
	<div className="flex flex-col gap-5">
		<p className="text-muted-foreground">{texts.intro}</p>
		<FormBuilder form={form} submitText="Spremi lozinku" error={error}>
			<form.AppField name="password">
				{(field) => (
					<field.TextField
						label={texts.label}
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
