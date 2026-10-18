import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthPage } from "#/components/layout/auth-page/auth-page";
import { SignInForm } from "#/features/auth";
import { getSessionUser } from "#/server/session";

/**
 * Someone already signed in has nothing to do here and goes to the start page.
 * Only a visit rendered by the server is checked - inside the application the one
 * way here with a session is signing out, whose request may still be on its way
 */
const skipWhenSignedIn = async () => {
	if (import.meta.env.SSR && (await getSessionUser())) {
		throw redirect({ to: "/aplikacija" });
	}
};

// the way to a new account, under the form
const SignUpPrompt = () => (
	<p className="flex flex-col items-center gap-1 lg:flex-row lg:justify-center lg:gap-1.5">
		<span className="text-muted-foreground">Prvi put ste ovdje?</span>
		<button
			type="button"
			className="cursor-pointer px-4 py-2.5 font-bold text-primary hover:text-primary-hover lg:p-0"
		>
			Napravite račun
		</button>
	</p>
);

// outside the shell, the sidebar means nothing before the user is signed in
const SignInPage = () => (
	<AuthPage title="Prijava" footer={<SignUpPrompt />}>
		<SignInForm />
	</AuthPage>
);

export const Route = createFileRoute("/prijava")({
	head: () => ({ meta: [{ title: "Prijava · Brazda" }] }),
	beforeLoad: skipWhenSignedIn,
	component: SignInPage,
});
