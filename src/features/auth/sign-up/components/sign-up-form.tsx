import { EmailDivider } from "#/components/auth/email-divider";
import { GoogleButton } from "#/components/auth/google-button";
import { FormBuilder } from "#/components/form/form-builder";
import { useSignUpForm } from "../use-sign-up-form";
import { SignUpFormTerms } from "./sign-up-form-terms";

// Google first, then name, email, password and the consent, as on the sign-in screen
export const SignUpForm = () => {
	const { signUpForm, formError } = useSignUpForm();

	return (
		<div className="flex flex-col gap-5">
			<GoogleButton />
			<EmailDivider />
			<FormBuilder
				form={signUpForm}
				submitText="Napravi račun"
				error={formError}
			>
				<signUpForm.AppField name="name">
					{(field) => (
						<field.TextField
							label="Ime i prezime"
							autoComplete="name"
							placeholder="Marko Horvat"
						/>
					)}
				</signUpForm.AppField>
				<signUpForm.AppField name="email">
					{(field) => (
						<field.TextField
							label="E-pošta"
							type="email"
							autoComplete="email"
							inputMode="email"
							placeholder="ime@primjer.hr"
						/>
					)}
				</signUpForm.AppField>
				<signUpForm.AppField name="password">
					{(field) => (
						<field.TextField
							label="Lozinka"
							type="password"
							autoComplete="new-password"
							placeholder="••••••••"
							hint="Najmanje 8 znakova."
						/>
					)}
				</signUpForm.AppField>
				<signUpForm.AppField name="acceptTerms">
					{(field) => (
						<field.CheckboxField>
							<SignUpFormTerms />
						</field.CheckboxField>
					)}
				</signUpForm.AppField>
			</FormBuilder>
		</div>
	);
};
