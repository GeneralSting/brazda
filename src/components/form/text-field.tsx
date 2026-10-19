import type { ChangeEvent, ComponentProps } from "react";
import { useFieldContext } from "#/hooks/use-form-context";
import { getErrorMessage } from "#/utils/form";
import { InputField } from "./input-field";

type TextFieldProps = Omit<
	ComponentProps<typeof InputField>,
	"name" | "value" | "onChange" | "onBlur" | "error"
>;

/**
 * Text field bound to its form: value, changes and the error of this field only.
 * Used as field.TextField inside form.AppField, which gives it the field
 */
export const TextField = (props: TextFieldProps) => {
	const field = useFieldContext<string>();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		field.handleChange(event.target.value);
	};

	return (
		<InputField
			{...props}
			name={field.name}
			value={field.state.value}
			onChange={handleChange}
			onBlur={field.handleBlur}
			error={getErrorMessage(field.state.meta.errors)}
		/>
	);
};
