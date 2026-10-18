import { EmailDivider } from "#/components/auth/email-divider";
import { GoogleButton } from "#/components/auth/google-button";
import { FormBuilder } from "#/components/form/form-builder";
import { useSignInForm } from "../use-sign-in-form";

// Google first, then email and password, put together from the form engine's pieces
export const SignInForm = () => {
	const { signInForm, formError } = useSignInForm();

	return (
		<div className="flex flex-col gap-5">
			<GoogleButton />
			<EmailDivider />
			<FormBuilder form={signInForm} submitText="Prijavi se" error={formError}>
				<signInForm.AppField name="email">
					{(field) => (
						<field.TextField
							label="E-pošta"
							type="email"
							autoComplete="email"
							inputMode="email"
							placeholder="ime@primjer.hr"
						/>
					)}
				</signInForm.AppField>
				<signInForm.AppField name="password">
					{(field) => (
						<field.TextField
							label="Lozinka"
							type="password"
							autoComplete="current-password"
							placeholder="••••••••"
							labelAction={
								<button
									type="button"
									className="cursor-pointer py-1.5 text-primary hover:text-primary-hover"
								>
									Zaboravili ste?
								</button>
							}
						/>
					)}
				</signInForm.AppField>
			</FormBuilder>
		</div>
	);
};
