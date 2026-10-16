import { createFormHookContexts } from "@tanstack/react-form";

// contexts that connect the field and form components with the form they are placed in
export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();
