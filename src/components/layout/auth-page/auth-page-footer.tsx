import type { ReactNode } from "react";

type AuthPageFooterProps = {
	children: ReactNode; // the line under the form, e.g. the way to sign up instead
};

// at the bottom of the screen on a phone, right under the form from lg
export const AuthPageFooter = ({ children }: AuthPageFooterProps) => (
	<div className="mt-auto pt-4 text-center lg:mt-0 lg:pt-0">{children}</div>
);
