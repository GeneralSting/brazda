import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "#/components/logo";
import { AuthPagePanel } from "./auth-page-panel";

type AuthPageProps = {
	title: string;
	children: ReactNode;
	footer?: ReactNode; // line under the form, e.g. the way to sign up instead
};

/**
 * Frame of a screen shown without the shell (sign-in, sign-up). On a phone the form
 * fills the screen, the footer sits at the bottom. From lg the form stays in the
 * middle of the left side and the green panel takes the right side
 */
export const AuthPage = ({ title, children, footer }: AuthPageProps) => (
	<div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_32.5rem]">
		<main className="page-gutter flex flex-col gap-8 pt-10 pb-6 lg:py-10">
			{/* leads back to the public page */}
			<Link to="/" className="self-start">
				<Logo size={40} />
			</Link>
			<div className="flex w-full max-w-105 flex-1 flex-col gap-5 self-center lg:my-auto lg:flex-none">
				<h1 className="type-page-title">{title}</h1>
				{children}
				{footer ? (
					<div className="mt-auto pt-4 text-center lg:mt-0 lg:pt-0">
						{footer}
					</div>
				) : null}
			</div>
		</main>
		<AuthPagePanel className="hidden lg:flex" />
	</div>
);
