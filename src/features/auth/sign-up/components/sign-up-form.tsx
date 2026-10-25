import { EmailDivider } from "#/components/auth/email-divider";
import { GoogleSignIn } from "#/components/auth/google-sign-in/google-sign-in";
import { FormBuilder } from "#/components/form/form-builder";
import type { useSignUpForm } from "../use-sign-up-form";
import { SignUpFormTerms } from "./sign-up-form-terms";

type SignUpFormProps = {
	signUpForm: ReturnType<typeof useSignUpForm>["signUpForm"];
	formError: string | null;
	googleError?: string; // the code Google returned with, when the sign-up through it failed
};

// Google first, then the email and the consent - the password comes through the link in the email
export const SignUpForm = ({
	signUpForm,
	formError,
	googleError,
}: SignUpFormProps) => {
	return (
		<div className="flex flex-col gap-5">
			<GoogleSignIn page="/registracija" error={googleError} />
			<EmailDivider />
			<FormBuilder
				form={signUpForm}
				submitText="Napravi račun"
				error={formError}
			>
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
