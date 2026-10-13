import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "#/components/logo";

const Home = () => (
	<main className="flex flex-col items-start gap-4 p-8">
		<Logo size={48} />
		<p>Upravljanje poljoprivrednim gospodarstvom na jednom mjestu.</p>
	</main>
);

export const Route = createFileRoute("/")({ component: Home });
