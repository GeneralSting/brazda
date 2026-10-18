import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import { cn } from "#/utils/cn";

type CheckboxProps = Omit<BaseCheckbox.Root.Props, "className"> & {
	className?: string;
};

/**
 * The box alone, 22px, green with a white tick when checked. Base UI carries the
 * behaviour and a hidden native input, which gets the id, so a label with htmlFor
 * checks it. The error state is driven by aria-invalid, like the text fields
 */
export const Checkbox = ({ className, ...props }: CheckboxProps) => (
	<BaseCheckbox.Root
		className={cn(
			"flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-input bg-card text-primary-foreground transition-colors duration-200",
			"data-checked:border-primary data-checked:bg-primary",
			"aria-invalid:border-destructive aria-invalid:inset-ring-1 aria-invalid:inset-ring-destructive",
			className,
		)}
		{...props}
	>
		<BaseCheckbox.Indicator className="flex">
			<Check className="size-4" strokeWidth={3} aria-hidden="true" />
		</BaseCheckbox.Indicator>
	</BaseCheckbox.Root>
);
