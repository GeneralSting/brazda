import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import type { EmailVerificationSearch } from "#/types/auth";
import { cn } from "#/utils/cn";
import { EMAIL_VERIFICATION_MESSAGES } from "../email-verification-config";
import { getEmailVerificationStep } from "../email-verification-step";

type EmailVerificationProps = {
	search: EmailVerificationSearch; // the address Better Auth returned to after the link
};

// how the confirmation went, and the sign-in as the only way on
export const EmailVerification = ({ search }: EmailVerificationProps) => {
	const message = EMAIL_VERIFICATION_MESSAGES[getEmailVerificationStep(search)];

	return (
		<div className="flex flex-col gap-5">
			<Alert tone={message.tone} title={message.title}>
				{message.text}
			</Alert>
			<Link
				to="/prijava"
				className={cn(buttonVariants({ size: "lg" }), "w-full")}
			>
				Prijavi se
			</Link>
		</div>
	);
};
