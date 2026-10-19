import type { ComponentType, ReactNode, SubmitEvent } from "react";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";

// the parts of a form made with useAppForm that the frame needs
type FormHandle = {
	handleSubmit: () => Promise<unknown>;
	AppForm: ComponentType<{ children?: ReactNode }>;
};

type FormBuilderProps = {
	form: FormHandle;
	submitText?: string;
	error?: string | null; // error of the whole form, shown above the submit button
	children: ReactNode; // the fields
};

// after a failed submit the user lands on the first field to fix
const focusFirstInvalidField = (formElement: HTMLFormElement) => {
	requestAnimationFrame(() => {
		formElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
	});
};

/**
 * Frame of every form: the fields, the error of the whole form and the submit button,
 * always in that order and at the same distances. The browser's own validation
 * bubbles are switched off, our messages under the fields replace them
 */
export const FormBuilder = ({
	form,
	error,
	submitText = "Spremi",
	children,
}: FormBuilderProps) => {
	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formElement = event.currentTarget;
		await form.handleSubmit();
		focusFirstInvalidField(formElement);
	};

	return (
		<form.AppForm>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col">
				<div className="flex flex-col gap-5">{children}</div>
				<FormError message={error} />
				<SubmitButton className="mt-5">{submitText}</SubmitButton>
			</form>
		</form.AppForm>
	);
};
