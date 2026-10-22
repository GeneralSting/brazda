import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import type { PasswordLinkTexts } from "#/types/auth";
import { cn } from "#/utils/cn";

type ResetPasswordChangedProps = {
	texts: PasswordLinkTexts;
};

// the password is saved and the address confirmed, the user signs in with it
export const ResetPasswordChanged = ({ texts }: ResetPasswordChangedProps) => (
	<div className="flex flex-col gap-5">
		<Alert tone="success" title={texts.savedTitle}>
			{texts.savedText}
		</Alert>
		<Link
			to="/prijava"
			className={cn(buttonVariants({ size: "lg" }), "w-full")}
		>
			Prijavi se
		</Link>
	</div>
);
