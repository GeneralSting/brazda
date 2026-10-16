import { useSelector } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { useFormContext } from "#/hooks/use-form-context";
import { cn } from "#/lib/utils";

type SubmitButtonProps = {
	children: ReactNode;
	className?: string;
};

const selectIsSubmitting = (state: { isSubmitting: boolean }) =>
	state.isSubmitting;

// main button of a form, blocked while the form is being sent so it is not sent twice
export const SubmitButton = ({ children, className }: SubmitButtonProps) => {
	const formContext = useFormContext();
	const isSubmitting = useSelector(formContext.store, selectIsSubmitting);

	return (
		<Button
			type="submit"
			size="lg"
			disabled={isSubmitting}
			aria-busy={isSubmitting}
			className={cn("w-full", className)}
		>
			{isSubmitting ? "Šaljem..." : children}
		</Button>
	);
};
