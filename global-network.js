/* =====================================================
   AZADIPOUR — WORLD MAP ENGINE
   Natural Earth / SVG / Silver Relief
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  "use strict";

  const svg = d3.select("#azadipourWorldMap");

  if (svg.empty()) return;

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
      coordinates: [51.1839, 25.3548],
      type: "partner"
    },

    saudi: {
      name: "SAUDI ARABIA",
      coordinates: [45.0792, 23.8859],
      type: "market"
    }
  };

  const countryStyles = {
    "512": "region-oman",
    "156": "region-china",
    "634": "region-qatar",
    "682": "region-saudi"
  };

  const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  try {

    /* -----------------------------------------------
       01. LOAD REAL WORLD GEOGRAPHIC DATA
    ----------------------------------------------- */

    const world = await d3.json(geoUrl);

    if (!world) {
      throw new Error("World geographic data unavailable.");
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

    /* -----------------------------------------------
       02. MAP PROJECTION
    ----------------------------------------------- */

    const projection = d3.geoNaturalEarth1()
      .fitExtent(
        [[28, 35], [1412, 615]],
        {
          type: "Sphere"
        }
      );

    // Adjust scale to fill the complete horizontal map.
    const path = d3.geoPath(projection);

    /* -----------------------------------------------
       03. GEOGRAPHIC GRID
    ----------------------------------------------- */

    const graticule = d3.geoGraticule()
      .step([30, 20])();

    graticuleLayer
      .append("path")
      .datum(graticule)
      .attr("d", path);

    /* -----------------------------------------------
       04. DRAW COUNTRIES
    ----------------------------------------------- */

    countriesLayer
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("class", d => {
        return countryStyles[String(d.id)] || "";
      })
      .append("title")
      .text(d => d.properties.name || "Country");

    /* -----------------------------------------------
       05. COUNTRY BORDERS
    ----------------------------------------------- */

    bordersLayer
      .append("path")
      .datum(borders)
      .attr("d", path);

    /* -----------------------------------------------
       06. OMAN TO CHINA CONNECTION
    ----------------------------------------------- */

    const start = mapLocations.azadipour.coordinates;
    const end = mapLocations.wemed.coordinates;

    const interpolate = d3.geoInterpolate(start, end);

    const routeCoordinates = d3.range(0, 101).map(i => {
      return interpolate(i / 100);
    });

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

    /* -----------------------------------------------
       07. LOCATION MARKERS
    ----------------------------------------------- */

    function addMarker(location, key) {

      const point = projection(location.coordinates);

      if (!point) return;

      const [x, y] = point;

      const marker = markersLayer
        .append("g")
        .attr("class", "map-marker")
        .attr("transform", `translate(${x},${y})`);

      marker
        .append("circle")
        .attr("class", "map-marker-halo")
        .attr("r", key === "wemed" ? 15 : 12);

      if (!reduceMotion) {
        marker
          .append("circle")
          .attr("class", "map-marker-ring")
          .attr("r", 7);
      }

      marker
        .append("circle")
        .attr("class",
          location.type === "market"
            ? "map-marker-soft"
            : "map-marker-core"
        )
        .attr("r",
          key === "wemed" ? 5 :
          key === "azadipour" ? 5 :
          key === "qatar" ? 4 : 4
        );

      return { x, y };
    }

    const markerPositions = {};

    Object.entries(mapLocations).forEach(([key, location]) => {
      markerPositions[key] = addMarker(location, key);
    });

    /* -----------------------------------------------
       08. LABEL HELPERS
    ----------------------------------------------- */

    function addLabel(
      text,
      position,
      className,
      dx = 0,
      dy = 0,
      anchor = "start"
    ) {

      if (!position) return;

      labelsLayer
        .append("text")
        .attr("class", className)
        .attr("x", position.x + dx)
        .attr("y", position.y + dy)
        .attr("text-anchor", anchor)
        .text(text);

    }

    /* -----------------------------------------------
       09. AZADIPOUR LABEL
    ----------------------------------------------- */

    addLabel(
      "AZADIPOUR",
      markerPositions.azadipour,
      "map-label",
      15,
      -12
    );

    addLabel(
      "MUSCAT · OMAN",
      markerPositions.azadipour,
      "map-label-sub",
      15,
      8
    );

    /* -----------------------------------------------
       10. WEMED LABEL
    ----------------------------------------------- */

    addLabel(
      "WEMED",
      markerPositions.wemed,
      "map-label",
      16,
      -10
    );

    addLabel(
      "BEIJING · CHINA",
      markerPositions.wemed,
      "map-label-sub",
      16,
      12
    );

    /* -----------------------------------------------
       11. QATAR LABEL
    ----------------------------------------------- */

    addLabel(
      "QATAR",
      markerPositions.qatar,
      "map-country-label",
      0,
      -17,
      "middle"
    );

    /* -----------------------------------------------
       12. SAUDI ARABIA LABEL
    ----------------------------------------------- */

    addLabel(
      "SAUDI ARABIA",
      markerPositions.saudi,
      "map-country-label soft",
      0,
      23,
      "middle"
    );

    /* -----------------------------------------------
       13. MAP READY
    ----------------------------------------------- */

    const section = document.getElementById("global-network");

    if (section) {
      section.classList.add("map-ready");
    }

    console.info(
      "AZADIPOUR WORLD MAP: SUCCESSFULLY INITIALIZED"
    );

  } catch (error) {

    console.error("AZADIPOUR MAP ERROR:", error);

    countriesLayer
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("fill", "#dce1e6")
      .attr("font-size", "20")
      .attr("text-anchor", "middle")
      .text("GLOBAL MAP TEMPORARILY UNAVAILABLE");

  }

});
