import { revalidateLogic } from "@tanstack/react-form";
import { useState } from "react";
import { useAppForm } from "#/hooks/use-app-form";
import { authClient } from "#/services/auth-client";
import {
	getRequestErrorMessage,
	parseResponse,
	REQUEST_MESSAGES,
} from "#/utils/request";
import {
	FORGOT_PASSWORD_FORM,
	FORGOT_PASSWORD_RESPONSE_SCHEMA,
	type ForgotPasswordValues,
	NEW_PASSWORD_PATH,
	TOO_MANY_REQUESTS,
} from "./forgot-password-form-config";

/**
 * Asks for the link and turns every outcome into null (asked) or the error of the
 * whole form. The server answers the same for every address, so null never means
 * that the account exists
 */
const requestReset = async ({ email }: ForgotPasswordValues) => {
	try {
		const { data, error } = await authClient.requestPasswordReset({
			email,
			redirectTo: NEW_PASSWORD_PATH,
		});

		if (error) {
			return error.status === 429
				? TOO_MANY_REQUESTS
				: getRequestErrorMessage(error);
		}
		return parseResponse(FORGOT_PASSWORD_RESPONSE_SCHEMA, data)
			? null
			: REQUEST_MESSAGES.unexpected;
	} catch {
		return REQUEST_MESSAGES.noResponse; // the request never reached the server or got no answer
	}
};

/**
 * The form that asks for a new password and the address it was sent to. The form
 * keeps its value while the sent message is shown, so going back shows the typed
 * address to fix
 */
export const useForgotPasswordForm = () => {
	const [formError, setFormError] = useState<string | null>(null);
	const [sentTo, setSentTo] = useState<string | null>(null);

	const handleValidSubmit = async ({
		value,
	}: {
		value: ForgotPasswordValues;
	}) => {
		setFormError(null);
		// already valid, parsing only gives the trimmed, typed values
		const values = FORGOT_PASSWORD_FORM.schema.parse(value);
		const message = await requestReset(values);

		if (message) {
			setFormError(message);
			return;
		}
		setSentTo(values.email);
	};

	const handleInvalidSubmit = () => {
		setFormError(null);
	};

	const showForm = () => {
		setSentTo(null);
	};

	const forgotPasswordForm = useAppForm({
		defaultValues: FORGOT_PASSWORD_FORM.defaultValues,
		validators: { onDynamic: FORGOT_PASSWORD_FORM.schema },
		validationLogic: revalidateLogic(),
		onSubmit: handleValidSubmit,
		onSubmitInvalid: handleInvalidSubmit,
	});

	return { forgotPasswordForm, formError, sentTo, showForm };
};
