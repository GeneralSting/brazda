import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/features/landing";
import { loadSessionUser } from "#/utils/session";

// the public page, open to everyone - a signed-in visitor only gets other links
const HomePage = () => {
	const user = Route.useLoaderData();

	return <LandingPage signedIn={user !== null} />;
};

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [{ title: "Brazda · evidencija poljoprivrednog gospodarstva" }],
	}),
	loader: loadSessionUser,
	component: HomePage,
});
