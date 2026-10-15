import { type ComponentProps, type ReactNode, useId } from "react";
import { Field } from "./field";
import { Input } from "./input";
import { PasswordInput } from "./password-input";

type InputFieldProps = ComponentProps<typeof Input> & {
	label: string;
	hint?: ReactNode; // helper text under the field
	error?: ReactNode; // replaces the hint and marks the field as invalid
	labelAddon?: ReactNode; // next to the label, e.g. a "Provjerite" badge
	labelAction?: ReactNode; // right end of the label row, e.g. "Zaboravili ste?"
};

/**
 * Label and text field as one piece, so every form has the same label, spacing and
 * message under the field. A password type gets the eye button. The label, the
 * message and the invalid state are connected for screen readers here, once
 */
export const InputField = ({
	label,
	hint,
	error,
	labelAddon,
	labelAction,
	warning,
	className,
	id,
	type,
	...props
}: InputFieldProps) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	const controlProps = {
		...props,
		id: inputId,
		warning,
		"aria-invalid": error ? true : undefined,
		"aria-describedby": error || hint ? `${inputId}-message` : undefined,
	};

	return (
		<Field
			label={label}
			htmlFor={inputId}
			labelAddon={labelAddon}
			labelAction={labelAction}
			hint={hint}
			error={error}
			warning={warning}
			className={className}
		>
			{type === "password" ? (
				<PasswordInput {...controlProps} />
			) : (
				<Input type={type} {...controlProps} />
			)}
		</Field>
	);
};
