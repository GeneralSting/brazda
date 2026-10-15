import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState, useTransition } from "react";
import { authClient } from "#/lib/auth/auth-client";

type SignInError = {
	code?: string;
	status: number;
};

// what went wrong, in words the user can act on
const getErrorMessage = (error: SignInError) => {
	if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
		return "E-pošta ili lozinka nisu točni.";
	}
	if (error.status === 429) {
		return "Previše pokušaja prijave. Pričekajte minutu pa pokušajte ponovno.";
	}
	return "Provjerite vezu s internetom i pokušajte ponovno.";
};

// signs in with email and password, then opens the home page
export const useSignIn = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setError(null);

		startTransition(async () => {
			const result = await authClient.signIn.email({
				email: String(formData.get("email") ?? ""),
				password: String(formData.get("password") ?? ""),
			});

			if (result.error) {
				setError(getErrorMessage(result.error));
				return;
			}
			await navigate({ to: "/" });
		});
	};

	return { error, isPending, handleSubmit };
};
