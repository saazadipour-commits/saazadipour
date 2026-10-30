/* =====================================================
   AZADIPOUR — WORLD MAP ENGINE
   REAL GEOGRAPHIC DATA / NATURAL EARTH / SILVER RELIEF
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  const svgElement = document.getElementById("azadipourWorldMap");
  if (!svgElement || svgElement.dataset.initialized === "true") return;

  svgElement.dataset.initialized = "true";

  if (!window.d3 || !window.topojson) {
    showMapError("MAP LIBRARIES COULD NOT BE LOADED");
    return;
  }

  const svg = d3.select(svgElement);

  const countriesLayer = svg.select("#mapCountries");
  const bordersLayer = svg.select("#mapBorders");
  const graticuleLayer = svg.select("#mapGraticule");
  const connectionsLayer = svg.select("#mapConnections");
  const markersLayer = svg.select("#mapMarkers");
  const labelsLayer = svg.select("#mapLabels");

  const width = 1440;
  const height = 650;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  const mapLocations = {
    azadipour: {
      name: "AZADIPOUR",
      sub: "MUSCAT · OMAN",
      coordinates: [58.3829, 23.5880],
      type: "main"
    },

    wemed: {
      name: "WEMED",
      sub: "BEIJING · CHINA",
      coordinates: [116.4074, 39.9042],
      type: "partner"
    },

    qatar: {
      name: "QATAR",
      sub: "DOHA · QATAR",
      coordinates: [51.1839, 25.3548],
      type: "partner"
    },

    saudi: {
      name: "SAUDI ARABIA",
      sub: "REGIONAL MARKET",
      coordinates: [45.0792, 23.8859],
      type: "market"
    }
  };

  // ISO numeric country identifiers used by world-atlas.
  const countryStyles = {
    "512": "region-oman",
    "156": "region-china",
    "634": "region-qatar",
    "682": "region-saudi"
  };

  function showMapError(message) {
    const loading = document.getElementById("mapLoading");
    const error = document.getElementById("mapError");

    if (loading) loading.classList.add("is-hidden");

    if (error) {
      error.textContent = message;
      error.hidden = false;
    }

    console.error("AZADIPOUR WORLD MAP:", message);
  }

  function hideMapLoading() {
    const loading = document.getElementById("mapLoading");
    if (loading) loading.classList.add("is-hidden");
  }

  function addLabel(text, position, className, dx = 0, dy = 0, anchor = "start") {
    if (!position) return;

    labelsLayer
      .append("text")
      .attr("class", className)
      .attr("x", position.x + dx)
      .attr("y", position.y + dy)
      .attr("text-anchor", anchor)
      .text(text);
  }

  function addMarker(location, key, projection) {
    const point = projection(location.coordinates);
    if (!point) return null;

    const [x, y] = point;

    const marker = markersLayer
      .append("g")
      .attr("class", `map-marker marker-${key}`)
      .attr("transform", `translate(${x},${y})`);

    marker
      .append("circle")
      .attr("class", "map-marker-halo")
      .attr("r", key === "azadipour" || key === "wemed" ? 19 : 14);

    if (!reduceMotion) {
      marker
        .append("circle")
        .attr("class", "map-marker-ring")
        .attr("r", key === "azadipour" || key === "wemed" ? 10 : 7);
    }

    marker
      .append("circle")
      .attr("class", location.type === "market"
        ? "map-marker-soft"
        : "map-marker-core")
      .attr("r", key === "azadipour" || key === "wemed" ? 5.5 : 4.5);

    marker
      .append("title")
      .text(`${location.name}${location.sub ? " — " + location.sub : ""}`);

    return { x, y };
  }

  try {
    const world = await d3.json(geoUrl);

    if (!world || !world.objects || !world.objects.countries) {
      throw new Error("World geographic data is incomplete.");
    }

    const countries = topojson.feature(
      world,
      world.objects.countries
    );

    const borders = topojson.mesh(
      world,
      world.objects.countries,
      (a, b) => a !== b
    );

    const projection = d3.geoNaturalEarth1()
      .fitExtent(
        [[28, 32], [1412, 618]],
        { type: "Sphere" }
      );

    const path = d3.geoPath(projection);

    /* GEOGRAPHIC GRID */

    const graticule = d3.geoGraticule()
      .step([30, 20])();

    graticuleLayer
      .append("path")
      .datum(graticule)
      .attr("class", "map-graticule-line")
      .attr("d", path);

    /* COUNTRIES */

    countriesLayer
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("class", d => {
        const id = String(d.id);
        const regionClass = countryStyles[id] || "";
        return `map-country ${regionClass}`;
      })
      .attr("d", path)
      .append("title")
      .text(d => d.properties?.name || "Country");

    /* COUNTRY BORDERS */

    bordersLayer
      .append("path")
      .datum(borders)
      .attr("class", "map-country-borders")
      .attr("d", path);

    /* OMAN TO CHINA ROUTE */

    const start = mapLocations.azadipour.coordinates;
    const end = mapLocations.wemed.coordinates;

    const interpolate = d3.geoInterpolate(start, end);

    const routeCoordinates = d3.range(0, 1.001, 0.01)
      .map(t => interpolate(t));

    const route = {
      type: "LineString",
      coordinates: routeCoordinates
    };

    const routePath = path(route);

    connectionsLayer
      .append("path")
      .attr("class", "route-shadow")
      .attr("d", routePath);

    connectionsLayer
      .append("path")
      .attr("class", "route-line")
      .attr("d", routePath);

    /* MARKERS */

    const markerPositions = {};

    Object.entries(mapLocations).forEach(([key, location]) => {
      markerPositions[key] = addMarker(location, key, projection);
    });

    /* LABELS */

    addLabel(
      "AZADIPOUR",
      markerPositions.azadipour,
      "map-label map-label-main",
      17,
      -13
    );

    addLabel(
      "MUSCAT · OMAN",
      markerPositions.azadipour,
      "map-label-sub",
      17,
      8
    );

    addLabel(
      "WEMED",
      markerPositions.wemed,
      "map-label map-label-partner",
      17,
      -12
    );

    addLabel(
      "BEIJING · CHINA",
      markerPositions.wemed,
      "map-label-sub",
      17,
      9
    );

    addLabel(
      "QATAR",
      markerPositions.qatar,
      "map-country-label",
      0,
      -17,
      "middle"
    );

    addLabel(
      "SAUDI ARABIA",
      markerPositions.saudi,
      "map-country-label soft",
      0,
      23,
      "middle"
    );

    /* MAP READY */

    hideMapLoading();

    const section = document.getElementById("global-network");
    if (section) section.classList.add("map-ready");

    console.info("AZADIPOUR WORLD MAP: SUCCESSFULLY INITIALIZED");

  } catch (error) {
    showMapError("GLOBAL MAP TEMPORARILY UNAVAILABLE");
    console.error(error);
  }
});
