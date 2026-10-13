import "ol/ol.css";
import { LocateFixed } from "lucide-react";
import {
	type MouseEvent,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
} from "react";
import { Alert } from "#/components/ui/alert";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import {
	ARKOD_WMS,
	type ArkodProperties,
	CADASTRE_WMS,
	type CadastreParcel,
	fetchArkodParcels,
	fetchCadastreParcel,
	type ServiceResult,
} from "./-map-services";
import { type BaseMode, createSpikeMap, type SpikeMap } from "./-spike-map";

type QueryState =
	| { status: "idle" }
	| {
			status: "active";
			// tells whether the point came from a click or from the device location
			origin: QueryOrigin;
			lonLat: [number, number];
			// null while the service has not answered yet, each one answers on its own
			arkod: ServiceResult<ArkodProperties | null> | null;
			cadastre: ServiceResult<CadastreParcel | null> | null;
	  };

type QueryOrigin = "click" | "location";

type LocationState =
	| { status: "idle" }
	| { status: "locating" }
	| { status: "found"; accuracyMeters: number }
	| { status: "error"; message: string };

const hectaresFormat = new Intl.NumberFormat("hr-HR", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});
const secondsFormat = new Intl.NumberFormat("hr-HR", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});
const coordinateFormat = new Intl.NumberFormat("hr-HR", {
	minimumFractionDigits: 5,
	maximumFractionDigits: 5,
});

const formatHectares = (squareMeters: number) =>
	`${hectaresFormat.format(squareMeters / 10_000)} ha`;
const formatSeconds = (milliseconds: number) =>
	`${secondsFormat.format(milliseconds / 1000)} s`;

// base layers offered for comparison, with what to expect from each
const BASE_MODES: Array<{ value: BaseMode; label: string; note: string }> = [
	{
		value: "tiled",
		label: "DGU pločice",
		note: "Službeni ortofoto u pločicama. Brzo kretanje, ali vodeni žig na svakoj pločici.",
	},
	{
		value: "single",
		label: "DGU jedna slika",
		note: "Službeni ortofoto kao jedna slika. Jedan vodeni žig, ali svaki pomak čeka oko 2 s.",
	},
	{
		value: "satellite",
		label: "Satelit",
		note: "Komercijalna satelitska snimka. Najbrža, bez žiga, ali manje oštra i bez detalja u krupnom mjerilu.",
	},
];

// messages for the error codes of the browser Geolocation API
const LOCATION_ERRORS: Record<number, string> = {
	1: "Pristup lokaciji nije dopušten. Odaberite parcelu klikom na kartu.",
	2: "Lokacija trenutno nije dostupna. Odaberite parcelu klikom na kartu.",
	3: "Određivanje lokacije traje predugo. Pokušajte ponovno ili kliknite na kartu.",
};

type InfoRowProps = {
	label: string;
	value: string;
};

const InfoRow = ({ label, value }: InfoRowProps) => (
	<div className="flex items-baseline justify-between gap-4 border-border-subtle border-t py-2 first:border-t-0">
		<dt className="type-small text-muted-foreground">{label}</dt>
		<dd className="type-small text-right font-semibold">{value}</dd>
	</div>
);

type ResponseTimeProps = {
	result: ServiceResult<unknown>;
};

// how long the service needed, the main thing this spike measures
const ResponseTime = ({ result }: ResponseTimeProps) => (
	<Badge tone={result.status === "ok" ? "neutral" : "destructive"} size="sm">
		{formatSeconds(result.durationMs)}
	</Badge>
);

const LoadingCard = ({ title }: { title: string }) => (
	<Card className="flex flex-col gap-2 p-4">
		<h3 className="type-label">{title}</h3>
		<p className="type-small text-muted-foreground">Dohvaćam podatke…</p>
	</Card>
);

type ArkodCardProps = {
	result: ServiceResult<ArkodProperties | null> | null;
};

const ArkodCard = ({ result }: ArkodCardProps) => {
	if (!result) {
		return <LoadingCard title="ARKOD parcela" />;
	}
	if (result.status === "error") {
		return <Alert title="ARKOD nije odgovorio">{result.message}</Alert>;
	}

	const parcel = result.data;
	return (
		<Card className="flex flex-col gap-2 p-4">
			<div className="flex items-center justify-between gap-2">
				<h3 className="type-label">ARKOD parcela</h3>
				<ResponseTime result={result} />
			</div>
			{parcel ? (
				<>
					<p className="type-body font-bold">
						{parcel.area === null
							? "Bez površine"
							: formatHectares(parcel.area)}
						{" · "}ID {parcel.id}
					</p>
					{/* every attribute as the service returns it, names are not translated yet */}
					<dl>
						{Object.entries(parcel).map(([name, value]) => (
							<InfoRow
								key={name}
								label={name}
								value={value === null ? "—" : String(value)}
							/>
						))}
					</dl>
				</>
			) : (
				<p className="type-small text-muted-foreground">
					Na ovoj točki nema ARKOD parcele.
				</p>
			)}
		</Card>
	);
};

type CadastreCardProps = {
	result: ServiceResult<CadastreParcel | null> | null;
};

const CadastreCard = ({ result }: CadastreCardProps) => {
	if (!result) {
		return <LoadingCard title="Katastarska čestica" />;
	}
	if (result.status === "error") {
		return <Alert title="Katastar nije odgovorio">{result.message}</Alert>;
	}

	const parcel = result.data;
	return (
		<Card className="flex flex-col gap-2 p-4">
			<div className="flex items-center justify-between gap-2">
				<h3 className="type-label">Katastarska čestica</h3>
				<ResponseTime result={result} />
			</div>
			{parcel ? (
				<dl>
					<InfoRow label="Broj čestice" value={parcel.parcelNumber} />
					<InfoRow
						label="Matični broj katastarske općine"
						value={parcel.municipalityId}
					/>
				</dl>
			) : (
				<p className="type-small text-muted-foreground">
					Na ovoj točki nema katastarske čestice ili je karta previše udaljena.
				</p>
			)}
		</Card>
	);
};

// throwaway page that tests the official map services in the browser
export const MapSpike = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<SpikeMap | null>(null);
	// number of the latest query, answers of older ones are ignored
	const queryNumberRef = useRef(0);

	const [zoom, setZoom] = useState<number | null>(null);
	// null while loading, -1 when the image failed, else the load time
	const [orthophotoMs, setOrthophotoMs] = useState<number | null>(null);
	const [arkodVisible, setArkodVisible] = useState(true);
	const [cadastreVisible, setCadastreVisible] = useState(false);
	const [baseMode, setBaseMode] = useState<BaseMode>("tiled");
	const [query, setQuery] = useState<QueryState>({ status: "idle" });
	const [location, setLocation] = useState<LocationState>({ status: "idle" });

	const loadArkod = async (url: string, queryNumber: number) => {
		const result = await fetchArkodParcels(url);
		// a newer query took over, this answer is dropped
		if (queryNumber !== queryNumberRef.current) {
			return;
		}
		if (result.status === "ok") {
			mapRef.current?.highlightParcels(result.data);
		}
		const arkod: ServiceResult<ArkodProperties | null> =
			result.status === "ok"
				? { ...result, data: result.data.features[0]?.properties ?? null }
				: result;
		setQuery((current) =>
			current.status === "active" ? { ...current, arkod } : current,
		);
	};

	const loadCadastre = async (url: string, queryNumber: number) => {
		const cadastre = await fetchCadastreParcel(url);
		if (queryNumber !== queryNumberRef.current) {
			return;
		}
		setQuery((current) =>
			current.status === "active" ? { ...current, cadastre } : current,
		);
	};

	/* Asks both services what lies under a point. They are asked separately,
	   so a slow cadastre never holds back the ARKOD answer. */
	const runQuery = (coordinate: number[], origin: QueryOrigin) => {
		const map = mapRef.current;
		const urls = map?.getQueryUrls(coordinate);
		if (!map || !urls) {
			return;
		}
		queryNumberRef.current += 1;
		map.highlightParcels(null);
		setQuery({
			status: "active",
			origin,
			lonLat: urls.lonLat,
			arkod: null,
			cadastre: null,
		});
		void loadArkod(urls.arkodUrl, queryNumberRef.current);
		void loadCadastre(urls.cadastreUrl, queryNumberRef.current);
	};

	const handleMapClick = useEffectEvent((coordinate: number[]) => {
		runQuery(coordinate, "click");
	});

	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const map = createSpikeMap(container, {
			onClick: handleMapClick,
			onZoomChange: setZoom,
			onOrthophotoLoad: setOrthophotoMs,
		});
		mapRef.current = map;

		return () => {
			map.destroy();
			mapRef.current = null;
		};
	}, []);

	const handleArkodToggle = () => {
		mapRef.current?.setArkodVisible(!arkodVisible);
		setArkodVisible(!arkodVisible);
	};

	const handleCadastreToggle = () => {
		mapRef.current?.setCadastreVisible(!cadastreVisible);
		setCadastreVisible(!cadastreVisible);
	};

	// each base button carries its mode in the value attribute
	const handleBaseModeClick = (event: MouseEvent<HTMLButtonElement>) => {
		const nextMode = event.currentTarget.value as BaseMode;
		mapRef.current?.setBaseMode(nextMode);
		setBaseMode(nextMode);
	};

	const handleLocationSuccess = (position: GeolocationPosition) => {
		const { longitude, latitude, accuracy } = position.coords;
		setLocation({ status: "found", accuracyMeters: Math.round(accuracy) });
		const coordinate = mapRef.current?.showLocation(
			longitude,
			latitude,
			accuracy,
		);
		if (coordinate) {
			runQuery(coordinate, "location");
		}
	};

	const handleLocationError = (error: GeolocationPositionError) => {
		setLocation({
			status: "error",
			message: LOCATION_ERRORS[error.code] ?? error.message,
		});
	};

	const handleLocateClick = () => {
		if (!("geolocation" in navigator)) {
			setLocation({
				status: "error",
				message: "Ovaj preglednik ne podržava određivanje lokacije.",
			});
			return;
		}
		setLocation({ status: "locating" });
		navigator.geolocation.getCurrentPosition(
			handleLocationSuccess,
			handleLocationError,
			{ enableHighAccuracy: true, timeout: 15_000 },
		);
	};

	const arkodHidden =
		arkodVisible && zoom !== null && zoom < ARKOD_WMS.minZoom - 1;
	const cadastreHidden =
		cadastreVisible && zoom !== null && zoom < CADASTRE_WMS.minZoom - 1;

	return (
		<main className="flex h-dvh flex-col lg:flex-row">
			<div ref={containerRef} className="h-1/2 bg-muted lg:h-auto lg:flex-1" />

			<aside className="flex flex-1 flex-col gap-4 overflow-y-auto border-border border-t p-5 lg:w-96 lg:flex-none lg:border-t-0 lg:border-l">
				<header className="flex flex-col gap-1">
					<h1 className="type-section-title">Karta · provjera servisa</h1>
					<p className="type-small text-muted-foreground">
						Probna stranica. Kliknite na parcelu ili upotrijebite svoju
						lokaciju.
					</p>
				</header>

				<Button size="lg" onClick={handleLocateClick}>
					<LocateFixed aria-hidden="true" />
					Moja lokacija
				</Button>
				{location.status === "locating" ? (
					<p className="type-small text-muted-foreground">
						Određujem lokaciju…
					</p>
				) : null}
				{location.status === "found" ? (
					<p className="type-small text-muted-foreground">
						Točnost lokacije: ± {location.accuracyMeters} m
					</p>
				) : null}
				{location.status === "error" ? (
					<Alert title="Lokacija nije određena">{location.message}</Alert>
				) : null}

				<section className="flex flex-col gap-2">
					<h2 className="type-overline text-muted-foreground">Slojevi</h2>
					<div className="flex flex-wrap gap-2">
						<Button
							variant={arkodVisible ? "default" : "outline"}
							aria-pressed={arkodVisible}
							onClick={handleArkodToggle}
						>
							ARKOD
						</Button>
						<Button
							variant={cadastreVisible ? "default" : "outline"}
							aria-pressed={cadastreVisible}
							onClick={handleCadastreToggle}
						>
							Katastar
						</Button>
					</div>
					{arkodHidden || cadastreHidden ? (
						<p className="type-small text-warning">
							Približite kartu, servisi parcele prikazuju tek u krupnijem
							mjerilu.
						</p>
					) : null}
				</section>

				<section className="flex flex-col gap-2">
					<h2 className="type-overline text-muted-foreground">Podloga</h2>
					<div className="flex flex-wrap gap-2">
						{BASE_MODES.map((mode) => (
							<Button
								key={mode.value}
								value={mode.value}
								variant={baseMode === mode.value ? "default" : "outline"}
								aria-pressed={baseMode === mode.value}
								onClick={handleBaseModeClick}
							>
								{mode.label}
							</Button>
						))}
					</div>
					<p className="type-small text-muted-foreground">
						{BASE_MODES.find((mode) => mode.value === baseMode)?.note}
					</p>
					<p className="type-small text-muted-foreground">
						Zum {zoom === null ? "—" : secondsFormat.format(zoom)}
						{baseMode === "single" ? (
							<>
								{" · "}ortofoto{" "}
								{orthophotoMs === null
									? "se učitava…"
									: orthophotoMs < 0
										? "nije učitan"
										: `učitan za ${formatSeconds(orthophotoMs)}`}
							</>
						) : null}
					</p>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="type-overline text-muted-foreground">
						{query.status === "active" && query.origin === "location"
							? "Nalazite se ovdje"
							: "Odabrana točka"}
					</h2>
					{query.status === "idle" ? (
						<p className="type-small text-muted-foreground">
							Još ništa nije odabrano.
						</p>
					) : null}
					{query.status === "active" ? (
						<>
							<p className="type-small text-muted-foreground">
								{coordinateFormat.format(query.lonLat[1])},{" "}
								{coordinateFormat.format(query.lonLat[0])}
							</p>
							<ArkodCard result={query.arkod} />
							<CadastreCard result={query.cadastre} />
						</>
					) : null}
				</section>
			</aside>
		</main>
	);
};
