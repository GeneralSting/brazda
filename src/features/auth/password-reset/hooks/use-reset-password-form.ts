import { revalidateLogic } from "@tanstack/react-form";
import { useState } from "react";
import { BETTER_AUTH_ERROR_CODES } from "#/config/auth";
import { useAppForm } from "#/hooks/use-app-form";
import { authClient } from "#/services/auth-client";
import type { NewPasswordSearch, ResetPasswordStep } from "#/types/auth";
import {
	getRequestErrorMessage,
	parseResponse,
	REQUEST_MESSAGES,
} from "#/utils/request";
import { PASSWORD_RESET_RESPONSE_SCHEMA } from "../config/password-reset-config";
import {
	RESET_PASSWORD_FORM,
	type ResetPasswordValues,
} from "../config/reset-password-form-config";

/**
 * Where the link opens the page: the form with a token, the expired link when Better
 * Auth refused it, and with neither the page was not opened from the email. The token
 * stays in the address, so a refreshed page opens where it was
 */
const getLinkStep = ({
	token,
	error,
}: NewPasswordSearch): ResetPasswordStep => {
	if (token) {
		return "form";
	}

	return error ? "link-expired" : "link-missing";
};

/**
 * Saves the new password and turns every outcome into the step to show and the error
 * of the whole form. A link that expired while the form was open shows the same as
 * one that never worked
 */
const resetPassword = async (
	{ password }: ResetPasswordValues,
	token: string,
): Promise<{ step: ResetPasswordStep; message: string | null }> => {
	try {
		const { data, error } = await authClient.resetPassword({
			newPassword: password,
			token,
		});

		if (error) {
			return error.code === BETTER_AUTH_ERROR_CODES.invalidToken
				? { step: "link-expired", message: null }
				: { step: "form", message: getRequestErrorMessage(error) };
		}

		return parseResponse(PASSWORD_RESET_RESPONSE_SCHEMA, data)
			? { step: "changed", message: null }
			: { step: "form", message: REQUEST_MESSAGES.unexpected };
	} catch {
		return { step: "form", message: REQUEST_MESSAGES.noResponse }; // the request never reached the server or got no answer
	}
};

/**
 * The form of a new password and the step the page is at, which starts where the
 * link opened it
 */
export const useResetPasswordForm = ({ token, error }: NewPasswordSearch) => {
	const [step, setStep] = useState(() => getLinkStep({ token, error }));
	const [formError, setFormError] = useState<string | null>(null);

	const handleValidSubmit = async ({
		value,
	}: {
		value: ResetPasswordValues;
	}) => {
		setFormError(null);
		if (!token) {
			setStep("link-missing");
			return;
		}

		// already valid, parsing only gives the typed values
		const outcome = await resetPassword(
			RESET_PASSWORD_FORM.schema.parse(value),
			token,
		);

		setFormError(outcome.message);
		setStep(outcome.step);
	};

	const handleInvalidSubmit = () => {
		setFormError(null);
	};

	const resetPasswordForm = useAppForm({
		defaultValues: RESET_PASSWORD_FORM.defaultValues,
		validators: { onDynamic: RESET_PASSWORD_FORM.schema },
		validationLogic: revalidateLogic(),
		onSubmit: handleValidSubmit,
		onSubmitInvalid: handleInvalidSubmit,
	});

	return { resetPasswordForm, formError, step };
};
