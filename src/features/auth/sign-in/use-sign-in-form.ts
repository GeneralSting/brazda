import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAppForm } from "#/hooks/use-app-form";
import { authClient } from "#/lib/auth/auth-client";
import {
	getRequestErrorMessage,
	parseResponse,
	REQUEST_MESSAGES,
} from "#/lib/form/utils";
import {
	CREDENTIALS_MISMATCH,
	SIGN_IN_FORM,
	SIGN_IN_RESPONSE_SCHEMA,
	type SignInValues,
} from "./sign-in-form-config";

/**
 * Sends the sign-in and turns every outcome into null (signed in) or the error of the
 * whole form. Whatever the server answers is checked before it is trusted
 */
const signIn = async (values: SignInValues) => {
	try {
		const { data, error } = await authClient.signIn.email(values);

		if (error) {
			return error.code === "INVALID_EMAIL_OR_PASSWORD"
				? CREDENTIALS_MISMATCH
				: getRequestErrorMessage(error);
		}
		return parseResponse(SIGN_IN_RESPONSE_SCHEMA, data)
			? null
			: REQUEST_MESSAGES.unexpected;
	} catch {
		return REQUEST_MESSAGES.noResponse; // the request never reached the server or got not answer
	}
};

/**
 * The sign-in form: its fields, its validation and what happens on submit. Field
 * errors show after the first failed submit and then follow the typing
 */
export const useSignInForm = () => {
	const navigate = useNavigate();
	const [formError, setFormError] = useState<string | null>(null);

	const handleValidSubmit = async ({ value }: { value: SignInValues }) => {
		setFormError(null);
		// already valid, parsing only gives the trimmed, typed values
		const message = await signIn(SIGN_IN_FORM.schema.parse(value));

		if (message) {
			setFormError(message);
			return;
		}
		await navigate({ to: "/" });
	};

	const handleInvalidSubmit = () => {
		setFormError(null);
	};

	const signInForm = useAppForm({
		defaultValues: SIGN_IN_FORM.defaultValues,
		validators: { onDynamic: SIGN_IN_FORM.schema },
		validationLogic: revalidateLogic(),
		onSubmit: handleValidSubmit,
		onSubmitInvalid: handleInvalidSubmit,
	});

	return { signInForm, formError };
};
