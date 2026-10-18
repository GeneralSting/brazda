import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAppForm } from "#/hooks/use-app-form";
import { authClient } from "#/services/auth-client";
import {
	getRequestErrorMessage,
	parseResponse,
	REQUEST_MESSAGES,
} from "#/utils/request";
import {
	EMAIL_TAKEN,
	SIGN_UP_FORM,
	SIGN_UP_RESPONSE_SCHEMA,
	type SignUpValues,
} from "./sign-up-form-config";

/**
 * Creates the account and turns every outcome into null (signed up and signed in)
 * or the error of the whole form. The accepted terms stay in the form, the server
 * gets only what the account is made of
 */
const signUp = async ({ name, email, password }: SignUpValues) => {
	try {
		const { data, error } = await authClient.signUp.email({
			name,
			email,
			password,
		});

		if (error) {
			return error.code ===
				authClient.$ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL.code
				? EMAIL_TAKEN
				: getRequestErrorMessage(error);
		}

		return parseResponse(SIGN_UP_RESPONSE_SCHEMA, data)
			? null
			: REQUEST_MESSAGES.unexpected;
	} catch {
		return REQUEST_MESSAGES.noResponse; // the request never reached the server or got no answer
	}
};

/**
 * The sign-up form: its fields, its validation and what happens on submit. Field
 * errors show after the first failed submit and then follow the typing
 */
export const useSignUpForm = () => {
	const navigate = useNavigate();
	const [formError, setFormError] = useState<string | null>(null);

	const handleValidSubmit = async ({ value }: { value: SignUpValues }) => {
		setFormError(null);
		// already valid, parsing only gives the trimmed, typed values
		const message = await signUp(SIGN_UP_FORM.schema.parse(value));

		if (message) {
			setFormError(message);
			return;
		}
		await navigate({ to: "/aplikacija", replace: true }); // the back button does not return to the sign-up page
	};

	const handleInvalidSubmit = () => {
		setFormError(null);
	};

	const signUpForm = useAppForm({
		defaultValues: SIGN_UP_FORM.defaultValues,
		validators: { onDynamic: SIGN_UP_FORM.schema },
		validationLogic: revalidateLogic(),
		onSubmit: handleValidSubmit,
		onSubmitInvalid: handleInvalidSubmit,
	});

	return { signUpForm, formError };
};
