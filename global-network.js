/* =========================================
   AZADIPOUR — GLOBAL NETWORK MAP
   Silver Monochrome Edition
========================================= */

(() => {
    "use strict";

    const container = document.getElementById("worldMap");
    if (!container) return;

    const width = 1440;
    const height = 747;

    const locations = [
        {
            name: "MUSCAT",
            country: "Oman",
            lat: 23.588,
            lng: 58.383,
            type: "registered",
            label: true
        },
        {
            name: "BEIJING",
            country: "China",
            lat: 39.904,
            lng: 116.407,
            type: "partner",
            label: true
        },
        {
            name: "GERMANY",
            country: "Germany",
            lat: 50.11,
            lng: 8.68,
            type: "target",
            label: true
        },
        {
            name: "RIYADH",
            country: "Saudi Arabia",
            lat: 24.713,
            lng: 46.675,
            type: "target"
        },
        {
            name: "DUBAI",
            country: "UAE",
            lat: 25.204,
            lng: 55.270,
            type: "target"
        },
        {
            name: "DOHA",
            country: "Qatar",
            lat: 25.285,
            lng: 51.531,
            type: "target"
        },
        {
            name: "MANAMA",
            country: "Bahrain",
            lat: 26.228,
            lng: 50.586,
            type: "target"
        },
        {
            name: "KUWAIT",
            country: "Kuwait",
            lat: 29.375,
            lng: 47.977,
            type: "target"
        }
    ];

    const connections = locations
        .filter(d => d.country !== "Oman")
        .map(d => ({
            source: locations[0],
            target: d
        }));

    const svgNS = "http://www.w3.org/2000/svg";

    function element(parent, tag, attrs = {}) {
        const el = document.createElementNS(svgNS, tag);

        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });

        parent.appendChild(el);
        return el;
    }

    function createSVG() {
        container.innerHTML = "";

        const svg = element(container, "svg", {
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: "xMidYMid meet",
            role: "img",
            "aria-label": "Azadipour international medical technology network map"
        });

        const defs = element(svg, "defs");

        const gradient = element(defs, "linearGradient", {
            id: "silverLand",
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "100%"
        });

        element(gradient, "stop", {
            offset: "0%",
            "stop-color": "#f5f6f7"
        });

        element(gradient, "stop", {
            offset: "55%",
            "stop-color": "#aeb4ba"
        });

        element(gradient, "stop", {
            offset: "100%",
            "stop-color": "#626a72"
        });

        const glow = element(defs, "filter", {
            id: "lightGlow",
            x: "-200%",
            y: "-200%",
            width: "400%",
            height: "400%"
        });

        element(glow, "feGaussianBlur", {
            stdDeviation: "3",
            result: "blur"
        });

        const merge = element(glow, "feMerge");
        element(merge, "feMergeNode", { in: "blur" });
        element(merge, "feMergeNode", { in: "SourceGraphic" });

        const routeGlow = element(defs, "filter", {
            id: "routeGlow"
        });

        element(routeGlow, "feGaussianBlur", {
            stdDeviation: "2"
        });

        return svg;
    }

    function renderMap(worldData) {
        const svg = createSVG();

        const countries = topojson.feature(
            worldData,
            worldData.objects.countries
        );

        const projection = d3.geoNaturalEarth1()
            .fitExtent(
                [[15, 35], [width - 15, height - 35]],
                countries
            );

        const path = d3.geoPath(projection);

        // Country shapes
        const landGroup = element(svg, "g");

        countries.features.forEach(country => {
            element(landGroup, "path", {
                d: path(country),
                class: "world-land"
            });
        });

        // Country boundary lines
        const boundaries = topojson.mesh(
            worldData,
            worldData.objects.countries,
            (a, b) => a !== b
        );

        element(svg, "path", {
            d: path(boundaries),
            class: "world-country-lines"
        });

        // Subtle background network stars
        const stars = [
            [-155, 20], [-120, 48], [-100, 10],
            [-75, -25], [-30, 35], [0, 55],
            [25, 10], [75, 5], [100, 50],
            [130, 20], [150, -20], [35, -25],
            [-10, -10], [65, 35], [115, -35]
        ];

        stars.forEach(([lng, lat]) => {
            const point = projection([lng, lat]);
            if (!point) return;

            element(svg, "circle", {
                cx: point[0],
                cy: point[1],
                r: 2.2,
                class: "world-star",
                opacity: ".75"
            });
        });

        // Connection routes
        connections.forEach(connection => {
            const interpolate = d3.geoInterpolate(
                [
                    connection.source.lng,
                    connection.source.lat
                ],
                [
                    connection.target.lng,
                    connection.target.lat
                ]
            );

            const coordinates = d3.range(0, 1.001, 0.012)
                .map(t => projection(interpolate(t)));

            const route = d3.line()(coordinates);

            element(svg, "path", {
                d: route,
                class: "world-route"
            });
        });

        // Location points
        locations.forEach(location => {
            const point = projection([
                location.lng,
                location.lat
            ]);

            if (!point) return;

            const group = element(svg, "g", {
                class: "world-node",
                transform: `translate(${point[0]},${point[1]})`
            });

            const title = element(group, "title");
            title.textContent =
                `${location.name} — ${location.country} — ${location.type}`;

            element(group, "circle", {
                r: location.type === "registered" ? 9 : 6,
                class: "world-node-ring"
            });

            element(group, "circle", {
                r: location.type === "registered" ? 4 : 3,
                class: "world-node-core"
            });

            if (location.label) {
                const label = element(group, "text", {
                    x: 13,
                    y: -12,
                    class: "world-node-label"
                });

                label.textContent = location.name;
            }
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
            renderMap(worldData);

        } catch (error) {
            console.error("Azadipour map error:", error);

            container.innerHTML =
                '<div class="world-map-loading">' +
                'GLOBAL MAP COULD NOT BE LOADED — CHECK CONNECTION' +
                '</div>';
        }
    }

    init();

})();
