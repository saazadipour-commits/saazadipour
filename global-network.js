/* =========================================
   AZADIPOUR — GLOBAL NETWORK
   International Silver Edition
   One connection: Oman — WeMed — China
========================================= */

(() => {
    "use strict";

    const container = document.getElementById("azadipourWorldMap");
    if (!container) return;

    if (!window.d3 || !window.topojson) {
        container.innerHTML =
            '<div class="world-map-loading">MAP LIBRARIES COULD NOT BE LOADED</div>';
        return;
    }

    const width = 1440;
    const height = 680;

    // The only business connection displayed on the map
    const origin = {
        name: "Azadipour",
        country: "Oman",
        coordinates: [58.383, 23.588]
    };

    const destination = {
        name: "WeMed",
        country: "China",
        coordinates: [116.407, 39.904]
    };

    const svgNS = "http://www.w3.org/2000/svg";

    function createElement(parent, tag, attributes = {}) {
        const element = document.createElementNS(svgNS, tag);

        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });

        parent.appendChild(element);
        return element;
    }

    function showError() {
        container.innerHTML =
            '<div class="world-map-loading">' +
            'GLOBAL MAP COULD NOT BE LOADED — PLEASE REFRESH' +
            '</div>';
    }

    function createMap(worldData) {
        container.innerHTML = "";

        const svg = createElement(container, "svg", {
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: "xMidYMid meet",
            role: "img",
            "aria-label": "Azadipour international network map showing its WeMed connection to China"
        });

        const defs = createElement(svg, "defs");

        // Silver land gradient
        const landGradient = createElement(defs, "linearGradient", {
            id: "azSilverLand",
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "100%"
        });

        createElement(landGradient, "stop", {
            offset: "0%",
            "stop-color": "#f0f1f2"
        });

        createElement(landGradient, "stop", {
            offset: "50%",
            "stop-color": "#aeb4bb"
        });

        createElement(landGradient, "stop", {
            offset: "100%",
            "stop-color": "#626a73"
        });

        // Route gradient
        const routeGradient = createElement(defs, "linearGradient", {
            id: "azRouteGradient",
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "0%"
        });

        createElement(routeGradient, "stop", {
            offset: "0%",
            "stop-color": "#8c949d"
        });

        createElement(routeGradient, "stop", {
            offset: "50%",
            "stop-color": "#ffffff"
        });

        createElement(routeGradient, "stop", {
            offset: "100%",
            "stop-color": "#aeb8c3"
        });

        // Soft glow
        const glow = createElement(defs, "filter", {
            id: "azMapGlow",
            x: "-100%",
            y: "-100%",
            width: "300%",
            height: "300%"
        });

        createElement(glow, "feGaussianBlur", {
            stdDeviation: "4",
            result: "blur"
        });

        const merge = createElement(glow, "feMerge");
        createElement(merge, "feMergeNode", { in: "blur" });
        createElement(merge, "feMergeNode", { in: "SourceGraphic" });

        // Geographic data
        const countries = topojson.feature(
            worldData,
            worldData.objects.countries
        );

        const projection = d3.geoNaturalEarth1()
            .fitExtent(
                [[22, 28], [width - 22, height - 28]],
                countries
            );

        const path = d3.geoPath(projection);

        // Subtle geographic grid
        const graticule = d3.geoGraticule()
            .step([30, 30])();

        createElement(svg, "path", {
            d: path(graticule),
            class: "world-graticule"
        });

        // World countries
        const landGroup = createElement(svg, "g", {
            class: "world-land-group"
        });

        countries.features.forEach(country => {
            createElement(landGroup, "path", {
                d: path(country),
                class: "world-land"
            });
        });

        // Country borders
        const borders = topojson.mesh(
            worldData,
            worldData.objects.countries,
            (a, b) => a !== b
        );

        createElement(svg, "path", {
            d: path(borders),
            class: "world-country-lines"
        });

        // The single Azadipour — WeMed connection
        const interpolate = d3.geoInterpolate(
            origin.coordinates,
            destination.coordinates
        );

        const routeCoordinates = d3.range(0, 1.001, 0.005)
            .map(t => interpolate(t));

        const routePath = path({
            type: "LineString",
            coordinates: routeCoordinates
        });

        // Route glow
        createElement(svg, "path", {
            d: routePath,
            class: "world-route-glow"
        });

        // Main route
        createElement(svg, "path", {
            d: routePath,
            class: "world-route"
        });

        // Route midpoint for WeMed label
        const midpoint = projection(interpolate(0.5));

        // WeMed label background
        const labelGroup = createElement(svg, "g", {
            class: "wemed-label",
            transform: `translate(${midpoint[0]}, ${midpoint[1] - 22})`
        });

        createElement(labelGroup, "rect", {
            x: -49,
            y: -17,
            width: 98,
            height: 34,
            rx: 17,
            class: "wemed-label-bg"
        });

        const label = createElement(labelGroup, "text", {
            x: 0,
            y: 5,
            "text-anchor": "middle",
            class: "wemed-label-text"
        });

        label.textContent = "WeMed";

        // Origin and destination points
        [origin, destination].forEach((location, index) => {
            const point = projection(location.coordinates);

            const marker = createElement(svg, "g", {
                class: "world-endpoint",
                transform: `translate(${point[0]}, ${point[1]})`
            });

            createElement(marker, "circle", {
                r: index === 0 ? 8 : 7,
                class: "world-endpoint-glow"
            });

            createElement(marker, "circle", {
                r: 3.5,
                class: "world-endpoint-core"
            });
        });
    }

    async function init() {
        try {
            const response = await fetch(
                "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
            );

            if (!response.ok) {
                throw new Error("World map data unavailable");
            }

            const worldData = await response.json();
            createMap(worldData);

        } catch (error) {
            console.error("Azadipour global map:", error);
            showError();
        }
    }

    init();
})();
