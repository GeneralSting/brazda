import { createFileRoute } from "@tanstack/react-router";
import { MapSpike } from "./-map-spike";

// the map needs the browser, so this route is not rendered on the server
export const Route = createFileRoute("/spike/map")({
	ssr: false,
	head: () => ({ meta: [{ title: "Karta · provjera servisa · Brazda" }] }),
	component: MapSpike,
});
