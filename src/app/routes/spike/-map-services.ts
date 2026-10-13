/* Official map services used by the spike. Measured on 13.10.2026.:
   orthophoto ~1.6s per screen-sized image or ~0.4s per 256px tile (HTTP/2, so tiles
   load in parallel) and no CORS header, ARKOD ~0.4s, cadastre WMS ~0.3s.
   DGU also has a WMTS with pre-rendered tiles in EPSG:3765, for registered users only
   (authKey) - the likely long-term base layer, not tested yet for lack of a key.
   The cadastre WFS (parcel geometry) needs 45s+ per request, so it is not used here.
   The cadastre WMS answers fast most of the time but sometimes stalls for 30s+,
   which is why every request has a timeout and the services are asked separately. */

// a request that takes longer is given up on, so the page never waits on a stalled service
const REQUEST_TIMEOUT_MS = 10_000;

export const ORTHOPHOTO_WMS = {
	url: "https://geoportal.dgu.hr/services/inspire/orthophoto_2023_2024/wms",
	layer: "OI.OrthoimageCoverage",
	attribution: "Ortofoto 2023/24 © Državna geodetska uprava",
};

/* Commercial satellite tiles, here only to compare the speed with the official orthophoto.
   Pre-rendered tiles from a CDN, ~0.3s for a whole screen, but less sharp and in this
   area without data above zoom 17. Production use needs a licence from the provider. */
export const SATELLITE_TILES = {
	url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
	attribution: "Satelitska snimka © Esri, Maxar, Earthstar Geographics",
	maxZoom: 17,
};

export const ARKOD_WMS = {
	url: "https://servisi.apprrr.hr/NIPP/wms",
	layer: "hr.land_parcels",
	attribution: "ARKOD © APPRRR",
	// the service draws parcels only below the scale 1:50 000
	minZoom: 14,
};

export const CADASTRE_WMS = {
	url: "https://api.uredjenazemlja.hr/services/inspire/cp_wms/wms",
	layer: "CP.CadastralParcel",
	attribution: "Katastar © DGU, Uređena zemlja",
	// the service draws parcels only below the scale 1:20 000
	minZoom: 15,
};

// all three services answer in Web Mercator, so no reprojection is needed in the browser
export const MAP_PROJECTION = "EPSG:3857";

// attributes of an ARKOD parcel, named as the service returns them
export type ArkodProperties = {
	id: number;
	land_use_id: number | null;
	home_name: string | null;
	area: number | null;
	perim: number | null;
	slope: number | null;
	z_avg: number | null;
	mines_status: string | null;
	water_protect_zone: string | null;
	natura2000: number | null;
	anc: string | null;
	irrigation: number | null;
	jpaid: string | null;
};

// GeoJSON answer of the ARKOD GetFeatureInfo request, geometry included
export type ArkodFeatureCollection = {
	type: "FeatureCollection";
	features: Array<{
		type: "Feature";
		id: string;
		geometry: unknown;
		properties: ArkodProperties;
	}>;
};

export type CadastreParcel = {
	// e.g. "4898/1"
	parcelNumber: string;
	// registry number of the cadastral municipality
	municipalityId: string;
};

// result of one request to a service, with how long it took
export type ServiceResult<T> =
	| { status: "ok"; data: T; durationMs: number }
	| { status: "error"; message: string; durationMs: number };

const toErrorMessage = (error: unknown) => {
	// AbortSignal.timeout rejects with a DOMException named TimeoutError
	if (error instanceof DOMException && error.name === "TimeoutError") {
		return `Servis nije odgovorio u ${REQUEST_TIMEOUT_MS / 1000} s.`;
	}
	return error instanceof Error ? error.message : "Nepoznata greška";
};

// runs a request and measures it, a failure is returned instead of thrown
const measure = async <T>(
	request: () => Promise<T>,
): Promise<ServiceResult<T>> => {
	const startedAt = performance.now();
	try {
		const data = await request();
		return {
			status: "ok",
			data,
			durationMs: Math.round(performance.now() - startedAt),
		};
	} catch (error) {
		return {
			status: "error",
			message: toErrorMessage(error),
			durationMs: Math.round(performance.now() - startedAt),
		};
	}
};

const fetchOk = async (url: string) => {
	const response = await fetch(url, {
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	if (!response.ok) {
		throw new Error(`Servis je odgovorio s HTTP ${response.status}`);
	}
	return response;
};

// ARKOD parcels under a point, as GeoJSON in the map projection
export const fetchArkodParcels = (featureInfoUrl: string) =>
	measure(async () => {
		const response = await fetchOk(featureInfoUrl);
		return (await response.json()) as ArkodFeatureCollection;
	});

/* The cadastre WMS answers only as text or HTML, e.g.:
   BROJ_CESTICE = 4898/1
   MATICNI_BROJ_KO = 320528 */
const parseCadastreInfo = (text: string): CadastreParcel | null => {
	const parcelNumber = /BROJ_CESTICE = (.+)/.exec(text)?.[1]?.trim();
	const municipalityId = /MATICNI_BROJ_KO = (.+)/.exec(text)?.[1]?.trim();
	if (!parcelNumber || !municipalityId) {
		return null;
	}
	return { parcelNumber, municipalityId };
};

// cadastral parcel under a point, without geometry
export const fetchCadastreParcel = (featureInfoUrl: string) =>
	measure(async () => {
		const response = await fetchOk(featureInfoUrl);
		return parseCadastreInfo(await response.text());
	});
