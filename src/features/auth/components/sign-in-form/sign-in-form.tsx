import { Button } from "#/components/ui/button";
import { InputField } from "#/components/ui/input-field";
import { SignInFormDivider } from "./sign-in-form-divider";
import { SignInFormGoogle } from "./sign-in-form-google";
import { useSignIn } from "./use-sign-in";

// Google first, then email and password, a failed sign-in is explained under the password
export const SignInForm = () => {
	const { error, isPending, handleSubmit } = useSignIn();

	return (
		<div className="flex flex-col gap-5">
			<SignInFormGoogle />
			<SignInFormDivider />
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<InputField
					label="E-pošta"
					id="sign-in-email"
					name="email"
					type="email"
					autoComplete="email"
					inputMode="email"
					required
				/>
				<InputField
					label="Lozinka"
					id="sign-in-password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					error={error}
					labelAction={
						<button
							type="button"
							className="cursor-pointer py-1.5 text-primary hover:text-primary-hover"
						>
							Zaboravili ste?
						</button>
					}
				/>
				<Button type="submit" size="lg" disabled={isPending} className="w-full">
					{isPending ? "Prijava u tijeku..." : "Prijavi se"}
				</Button>
			</form>
		</div>
	);
};
