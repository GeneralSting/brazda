import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Input } from "./input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type" | "suffix">;

// password field with an eye button, so the user can check what was typed
export const PasswordInput = (props: PasswordInputProps) => {
	const [visible, setVisible] = useState(false);

	const handleVisibilityToggle = () => {
		setVisible(!visible);
	};

	return (
		<Input
			{...props}
			type={visible ? "text" : "password"}
			suffix={
				<button
					type="button"
					onClick={handleVisibilityToggle}
					aria-pressed={visible}
					aria-label={visible ? "Sakrij lozinku" : "Prikaži lozinku"}
					title={visible ? "Sakrij lozinku" : "Prikaži lozinku"}
					className="-mr-2 flex size-10 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground"
				>
					{visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
				</button>
			}
		/>
	);
};
