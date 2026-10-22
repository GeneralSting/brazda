import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import type { PasswordLinkTexts } from "#/types/auth";
import { cn } from "#/utils/cn";

type SavePasswordLinkMissingProps = {
	texts: PasswordLinkTexts;
};

// the page was opened without the link from the email, opened from it the link still works
export const SavePasswordLinkMissing = ({
	texts,
}: SavePasswordLinkMissingProps) => (
	<div className="flex flex-col gap-5">
		<Alert tone="warning" title="Otvorite poveznicu iz e-maila">
			{texts.missingText}
		</Alert>
		<Link
			to={texts.retry.to}
			className={cn(
				buttonVariants({ variant: "outline", size: "lg" }),
				"w-full",
			)}
		>
			{texts.retry.label}
		</Link>
	</div>
);
