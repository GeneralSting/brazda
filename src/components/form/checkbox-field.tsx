import { type ReactNode, useId } from "react";
import { Reveal } from "#/components/reveal";
import { useFieldContext } from "#/hooks/use-form-context";
import { getErrorMessage } from "#/utils/form";
import { Checkbox } from "./checkbox";
import { FieldMessage } from "./field-message";

type CheckboxFieldProps = {
	children: ReactNode; // the label next to the box, may hold links
};

/**
 * Checkbox bound to its form, with its label on the right and its error under both.
 * Used as field.CheckboxField inside form.AppField, which gives it a boolean field.
 * A link inside the label opens without checking the box
 */
export const CheckboxField = ({ children }: CheckboxFieldProps) => {
	const field = useFieldContext<boolean>();
	const id = useId();
	const error = getErrorMessage(field.state.meta.errors);

	const handleCheckedChange = (checked: boolean) => {
		field.handleChange(checked);
	};

	return (
		<div className="flex flex-col">
			<div className="flex items-start gap-3">
				{/* 1px down, so the 22px box sits in the middle of the first 24px line */}
				<Checkbox
					id={id}
					name={field.name}
					checked={field.state.value}
					onCheckedChange={handleCheckedChange}
					onBlur={field.handleBlur}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? `${id}-message` : undefined}
					className="mt-px"
				/>
				<label htmlFor={id} className="cursor-pointer text-base">
					{children}
				</label>
			</div>
			<Reveal open={Boolean(error)}>
				<div className="pt-2">
					<FieldMessage id={`${id}-message`} tone="error">
						{error}
					</FieldMessage>
				</div>
			</Reveal>
		</div>
	);
};
