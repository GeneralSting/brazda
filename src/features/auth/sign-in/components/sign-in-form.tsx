import { Link } from "@tanstack/react-router";
import { EmailDivider } from "#/components/auth/email-divider";
import { GoogleSignIn } from "#/components/auth/google-sign-in/google-sign-in";
import { FormBuilder } from "#/components/form/form-builder";
import { useSignInForm } from "../use-sign-in-form";

type SignInFormProps = {
	googleError?: string; // the code Google returned with, when the sign-in through it failed
};

// Google first, then email and password, put together from the form engine's pieces
export const SignInForm = ({ googleError }: SignInFormProps) => {
	const { signInForm, formError } = useSignInForm();

	return (
		<div className="flex flex-col gap-5">
			<GoogleSignIn page="/prijava" error={googleError} />
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
								<Link
									to="/zaboravljena-lozinka"
									className="py-1.5 text-primary hover:text-primary-hover"
								>
									Zaboravili ste?
								</Link>
							}
						/>
					)}
				</signInForm.AppField>
			</FormBuilder>
		</div>
	);
};
