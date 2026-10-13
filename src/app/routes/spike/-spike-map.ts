import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Point from "ol/geom/Point";
import { circular } from "ol/geom/Polygon";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OlMap from "ol/Map";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import { fromLonLat, toLonLat } from "ol/proj";
import ImageWMS from "ol/source/ImageWMS";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import View from "ol/View";
import {
	ARKOD_WMS,
	type ArkodFeatureCollection,
	CADASTRE_WMS,
	MAP_PROJECTION,
	ORTHOPHOTO_WMS,
	SATELLITE_TILES,
} from "./-map-services";

// fields near Čepin, the area the services were measured on
const START_CENTER = [18.5562, 45.5049];
const START_ZOOM = 16;

/* tiled: official orthophoto as 256px tiles - loaded in parallel and kept by the browser,
          so moving the map is fast, but the watermark repeats on every tile
   single: official orthophoto as one image per view - one watermark, but every move
           waits ~2s for a new image
   satellite: commercial satellite tiles, for comparing the speed */
export type BaseMode = "tiled" | "single" | "satellite";

export type QueryUrls = {
	// queried point as [longitude, latitude]
	lonLat: [number, number];
	arkodUrl: string;
	cadastreUrl: string;
};

export type SpikeMapEvents = {
	onClick: (coordinate: number[]) => void;
	onZoomChange: (zoom: number) => void;
	// null while the image is loading, -1 when it failed, else the load time
	onOrthophotoLoad: (durationMs: number | null) => void;
};

export type SpikeMap = ReturnType<typeof createSpikeMap>;

// reads a colour token from styles.css, the canvas cannot use the CSS classes
const readColorToken = (token: string, alpha = 1) => {
	const hex = getComputedStyle(document.documentElement)
		.getPropertyValue(token)
		.trim()
		.replace("#", "");
	const channels = [0, 2, 4].map((start) =>
		Number.parseInt(hex.slice(start, start + 2), 16),
	);
	return [...channels, alpha];
};

// all OpenLayers code of the spike, kept apart from React
export const createSpikeMap = (target: HTMLElement, events: SpikeMapEvents) => {
	const view = new View({
		center: fromLonLat(START_CENTER),
		zoom: START_ZOOM,
		maxZoom: 21,
	});

	const orthophotoParams = {
		LAYERS: ORTHOPHOTO_WMS.layer,
		FORMAT: "image/jpeg",
	};
	// no crossOrigin on purpose, the orthophoto service sends no CORS header
	const orthophotoSingleSource = new ImageWMS({
		url: ORTHOPHOTO_WMS.url,
		params: orthophotoParams,
		ratio: 1,
		attributions: ORTHOPHOTO_WMS.attribution,
	});
	const orthophotoTiledSource = new TileWMS({
		url: ORTHOPHOTO_WMS.url,
		params: orthophotoParams,
		attributions: ORTHOPHOTO_WMS.attribution,
	});
	const satelliteSource = new XYZ({
		url: SATELLITE_TILES.url,
		maxZoom: SATELLITE_TILES.maxZoom,
		attributions: SATELLITE_TILES.attribution,
	});
	const arkodSource = new TileWMS({
		url: ARKOD_WMS.url,
		params: { LAYERS: ARKOD_WMS.layer, FORMAT: "image/png", TRANSPARENT: true },
		crossOrigin: "anonymous",
		attributions: ARKOD_WMS.attribution,
	});
	const cadastreSource = new TileWMS({
		url: CADASTRE_WMS.url,
		params: {
			LAYERS: CADASTRE_WMS.layer,
			FORMAT: "image/png",
			TRANSPARENT: true,
		},
		crossOrigin: "anonymous",
		attributions: CADASTRE_WMS.attribution,
	});

	const orthophotoSingleLayer = new ImageLayer({
		source: orthophotoSingleSource,
		visible: false,
	});
	/* preload keeps the coarser zoom levels loaded, so a move or a zoom shows
	   a blurry picture at once and sharpens it as the detailed tiles arrive */
	const orthophotoTiledLayer = new TileLayer({
		source: orthophotoTiledSource,
		preload: Number.POSITIVE_INFINITY,
	});
	const satelliteLayer = new TileLayer({
		source: satelliteSource,
		preload: Number.POSITIVE_INFINITY,
		visible: false,
	});
	const arkodLayer = new TileLayer({
		source: arkodSource,
		minZoom: ARKOD_WMS.minZoom - 1,
	});
	/* The cadastre is drawn as thin black lines that disappear on the photo.
	   A class of its own gives the layer a separate canvas, which is then inverted to white. */
	const cadastreLayer = new TileLayer({
		source: cadastreSource,
		minZoom: CADASTRE_WMS.minZoom - 1,
		className: "invert",
		visible: false,
	});

	const selectionSource = new VectorSource();
	const selectionLayer = new VectorLayer({
		source: selectionSource,
		style: new Style({
			stroke: new Stroke({ color: readColorToken("--card"), width: 3 }),
			fill: new Fill({ color: readColorToken("--primary", 0.4) }),
		}),
	});

	const locationSource = new VectorSource();
	const locationLayer = new VectorLayer({
		source: locationSource,
		style: new Style({
			// accuracy circle
			stroke: new Stroke({ color: readColorToken("--card"), width: 2 }),
			fill: new Fill({ color: readColorToken("--card", 0.25) }),
			// the position itself
			image: new CircleStyle({
				radius: 8,
				fill: new Fill({ color: readColorToken("--destructive") }),
				stroke: new Stroke({ color: readColorToken("--card"), width: 3 }),
			}),
		}),
	});

	const map = new OlMap({
		target,
		view,
		layers: [
			orthophotoSingleLayer,
			orthophotoTiledLayer,
			satelliteLayer,
			arkodLayer,
			cadastreLayer,
			selectionLayer,
			locationLayer,
		],
	});

	let orthophotoStartedAt = 0;
	const handleOrthophotoLoadStart = () => {
		orthophotoStartedAt = performance.now();
		events.onOrthophotoLoad(null);
	};
	const handleOrthophotoLoadEnd = () => {
		events.onOrthophotoLoad(
			Math.round(performance.now() - orthophotoStartedAt),
		);
	};
	const handleOrthophotoLoadError = () => {
		events.onOrthophotoLoad(-1);
	};
	orthophotoSingleSource.on("imageloadstart", handleOrthophotoLoadStart);
	orthophotoSingleSource.on("imageloadend", handleOrthophotoLoadEnd);
	orthophotoSingleSource.on("imageloaderror", handleOrthophotoLoadError);

	const handleSingleClick = (event: MapBrowserEvent) => {
		events.onClick(event.coordinate);
	};
	const handleMoveEnd = () => {
		events.onZoomChange(view.getZoom() ?? START_ZOOM);
	};
	map.on("singleclick", handleSingleClick);
	map.on("moveend", handleMoveEnd);

	// builds the GetFeatureInfo requests of both services for a point on the map
	const getQueryUrls = (coordinate: number[]): QueryUrls | null => {
		const resolution = view.getResolution() ?? 1;
		const arkodUrl = arkodSource.getFeatureInfoUrl(
			coordinate,
			resolution,
			MAP_PROJECTION,
			{ INFO_FORMAT: "application/json", FEATURE_COUNT: 1 },
		);
		const cadastreUrl = cadastreSource.getFeatureInfoUrl(
			coordinate,
			resolution,
			MAP_PROJECTION,
			{ INFO_FORMAT: "text/plain", FEATURE_COUNT: 1 },
		);
		if (!arkodUrl || !cadastreUrl) {
			return null;
		}
		const [longitude, latitude] = toLonLat(coordinate);
		return { lonLat: [longitude, latitude], arkodUrl, cadastreUrl };
	};

	// draws the parcels of an ARKOD answer, null removes the highlight
	const highlightParcels = (parcels: ArkodFeatureCollection | null) => {
		selectionSource.clear();
		if (!parcels) {
			return;
		}
		// the geometry arrives in the map projection, so it is drawn as it is
		const features = new GeoJSON().readFeatures(parcels, {
			dataProjection: MAP_PROJECTION,
			featureProjection: MAP_PROJECTION,
		});
		selectionSource.addFeatures(features);
	};

	// draws the position with its accuracy circle and moves the view there
	const showLocation = (
		longitude: number,
		latitude: number,
		accuracyMeters: number,
	) => {
		const coordinate = fromLonLat([longitude, latitude]);
		const accuracyCircle = circular([longitude, latitude], accuracyMeters);
		accuracyCircle.transform("EPSG:4326", MAP_PROJECTION);

		locationSource.clear();
		locationSource.addFeatures([
			new Feature(accuracyCircle),
			new Feature(new Point(coordinate)),
		]);
		view.animate({ center: coordinate, zoom: 17, duration: 400 });
		return coordinate;
	};

	return {
		getQueryUrls,
		highlightParcels,
		showLocation,
		setArkodVisible: (visible: boolean) => arkodLayer.setVisible(visible),
		setCadastreVisible: (visible: boolean) => cadastreLayer.setVisible(visible),
		setBaseMode: (mode: BaseMode) => {
			orthophotoTiledLayer.setVisible(mode === "tiled");
			orthophotoSingleLayer.setVisible(mode === "single");
			satelliteLayer.setVisible(mode === "satellite");
		},
		destroy: () => map.setTarget(undefined),
	};
};
