import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import type { PasswordLinkTexts } from "#/types/auth";
import { cn } from "#/utils/cn";

type ResetPasswordLinkExpiredProps = {
	texts: PasswordLinkTexts;
};

// an expired or used link, the only way on is to ask for a new one
export const ResetPasswordLinkExpired = ({
	texts,
}: ResetPasswordLinkExpiredProps) => (
	<div className="flex flex-col gap-5">
		<Alert title="Poveznica više ne vrijedi">{texts.expiredText}</Alert>
		<Link
			to={texts.retry.to}
			className={cn(buttonVariants({ size: "lg" }), "w-full")}
		>
			{texts.retry.label}
		</Link>
	</div>
);
