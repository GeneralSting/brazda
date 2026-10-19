import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AUTH_ERROR_CODES, BETTER_AUTH_ERROR_CODES } from "#/config/auth";
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
	TERMS_REFUSED,
} from "./sign-up-form-config";

// our own reasons for a failed sign-up, by the code of the error, anything else is a request error
const SIGN_UP_ERRORS: Record<string, string> = {
	[BETTER_AUTH_ERROR_CODES.emailTaken]: EMAIL_TAKEN,
	[AUTH_ERROR_CODES.termsNotAccepted]: TERMS_REFUSED,
};

/**
 * Creates the account and turns every outcome into null (signed up and signed in)
 * or the error of the whole form. The accepted terms go along, the server checks
 * them again and records the moment of the consent
 */
const signUp = async ({ name, email, password, acceptTerms }: SignUpValues) => {
	// acceptTerms is no field of the account (Better Auth), so the typed body of the client does not list it
	const body = { name, email, password, acceptTerms };

	try {
		const { data, error } = await authClient.signUp.email(body);

		if (error) {
			return (
				(error.code && SIGN_UP_ERRORS[error.code]) ??
				getRequestErrorMessage(error)
			);
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
