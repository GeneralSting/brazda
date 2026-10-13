import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<main className="p-8">
			<h1 className="text-4xl font-bold">Brazda</h1>
			<p className="mt-4 text-lg">
				Upravljanje poljoprivrednim gospodarstvom na jednom mjestu.
			</p>
		</main>
	);
}
