import { createFormHook } from "@tanstack/react-form";
import { SubmitButton } from "#/components/form/submit-button";
import { TextField } from "#/components/form/text-field";
import { fieldContext, formContext } from "#/hooks/use-form-context";

/**
 * The form engine of the application. Every form is made with useAppForm, its fields
 * are picked from fieldComponents (field.TextField...) and placed with form.AppField,
 * whose name is checked against the form's fields
 */
export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: { TextField },
	formComponents: { SubmitButton },
});
