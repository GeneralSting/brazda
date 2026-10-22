import { revalidateLogic } from "@tanstack/react-form";
import { useState } from "react";
import { AUTH_ERROR_CODES } from "#/config/auth";
import { useAppForm } from "#/hooks/use-app-form";
import { authClient } from "#/services/auth-client";
import type { AuthRequestError } from "#/types/auth";
import {
	getRequestErrorMessage,
	parseResponse,
	REQUEST_MESSAGES,
} from "#/utils/request";
import {
	SIGN_UP_FORM,
	SIGN_UP_RESPONSE_SCHEMA,
	type SignUpValues,
	TERMS_REFUSED,
} from "./sign-up-form-config";

// our own reasons for a failed sign-up, by the code of the error, anything else is a request error
const SIGN_UP_ERRORS: Record<string, string> = {
	[AUTH_ERROR_CODES.termsNotAccepted]: TERMS_REFUSED,
};

// our own endpoint, the client of Better Auth has no method for it
const SIGN_UP_PATH = "/sign-up/request";

/**
 * Asks for the account and turns every outcome into null (the link to set the
 * password on its way) or the error of the whole form. The accepted terms go along,
 * the server checks them again and records the moment of the consent
 */
const signUp = async (body: SignUpValues) => {
	try {
		const { data, error } = await authClient.$fetch<unknown, AuthRequestError>(
			SIGN_UP_PATH,
			{
				method: "POST",
				body,
			},
		);

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
 * The sign-up form and the address it signed up, which the confirmation message
 * shows. Field errors show after the first failed submit and then follow the typing
 */
export const useSignUpForm = () => {
	const [formError, setFormError] = useState<string | null>(null);
	const [signedUpAs, setSignedUpAs] = useState<string | null>(null);

	const handleValidSubmit = async ({ value }: { value: SignUpValues }) => {
		setFormError(null);
		// already valid, parsing only gives the trimmed, typed values
		const values = SIGN_UP_FORM.schema.parse(value);
		const message = await signUp(values);

		if (message) {
			setFormError(message);
			return;
		}
		setSignedUpAs(values.email);
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

	return { signUpForm, formError, signedUpAs };
};
