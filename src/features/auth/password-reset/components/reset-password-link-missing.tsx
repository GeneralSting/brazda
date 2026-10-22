import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/button";
import { Alert } from "#/components/feedback/alert";
import { cn } from "#/utils/cn";

// the page was opened without the link from the email, opened from it the link still works
export const ResetPasswordLinkMissing = () => (
	<div className="flex flex-col gap-5">
		<Alert tone="warning" title="Otvorite poveznicu iz e-maila">
			Nova lozinka postavlja se samo preko poveznice iz e-maila koji ste dobili.
		</Alert>
		<Link
			to="/zaboravljena-lozinka"
			className={cn(
				buttonVariants({ variant: "outline", size: "lg" }),
				"w-full",
			)}
		>
			Zatraži novu poveznicu
		</Link>
	</div>
);
