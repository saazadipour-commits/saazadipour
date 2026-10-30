/* =========================================================
   AZADIPOUR — GLOBAL NETWORK ENGINE
   Interactive Global World Map
   D3.js + TopoJSON
   Black / Silver / White
   ========================================================= */

(() => {
    "use strict";

    const CONFIG = {
        mapId: "globalNetworkMap",
        loadingId: "mapLoading",

        worldUrl:
            "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json",

        d3Url:
            "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",

        topoUrl:
            "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"
    };

    /*
       IMPORTANT:
       Only verified business relationships belong here.

       Oman is the company's registered presence.
       No unconfirmed partnerships are displayed.
    */

    window.AZADIPOUR_NETWORK = {

        registered: [
            {
                id: "oman",
                name: "Oman",
                city: "Muscat",
                coordinates: [58.4059, 23.5880],
                status: "registered",
                description:
                    "Registered company presence."
            }
        ],

        partnerships: [
            /*
            Add verified partnerships here.

            {
                id: "partner-1",
                name: "Company Name",
                country: "Country",
                coordinates: [longitude, latitude],
                status: "partnership",
                description: "Verified cooperation."
            }
            */
        ],

        negotiations: [
            /*
            Add active negotiations here only.

            {
                id: "negotiation-1",
                name: "Company Name",
                country: "Country",
                coordinates: [longitude, latitude],
                status: "negotiation",
                description: "Business discussions in progress."
            }
            */
        ]
    };

    const $ = (id) => document.getElementById(id);

    let resizeObserver = null;
    let currentMapData = null;
    let initialized = false;

    function loadScript(url) {

        return new Promise((resolve, reject) => {

            const existing = [...document.scripts].find(
                script => script.src === url
            );

            if (existing) {

                const check = () => {
                    if (window.d3 && window.topojson) {
                        resolve();
                    } else {
                        reject(new Error("Library unavailable."));
                    }
                };

                if (window.d3 && window.topojson) {
                    resolve();
                } else {
                    existing.addEventListener("load", check, {
                        once: true
                    });

                    existing.addEventListener("error", reject, {
                        once: true
                    });
                }

                return;
            }

            const script = document.createElement("script");

            script.src = url;
            script.async = true;

            script.onload = resolve;
            script.onerror = () => reject(
                new Error("Could not load map library.")
            );

            document.head.appendChild(script);
        });
    }

    async function loadLibraries() {

        await loadScript(CONFIG.d3Url);

        if (!window.topojson) {
            await loadScript(CONFIG.topoUrl);
        }

        if (!window.d3 || !window.topojson) {
            throw new Error("Map libraries are unavailable.");
        }
    }

    function setLoading(message) {

        const loading = $(CONFIG.loadingId);

        if (!loading) return;

        loading.classList.remove("is-hidden");

        loading.innerHTML = `
            <span class="loading-indicator"></span>
            <span>${message}</span>
        `;
    }

    function hideLoading() {

        const loading = $(CONFIG.loadingId);

        if (loading) {
            loading.classList.add("is-hidden");
        }
    }

    function showError(message) {

        const container = $(CONFIG.mapId);

        if (!container) return;

        container.innerHTML = "";

        const error = document.createElement("div");

        error.className = "global-map-error";
        error.textContent = message;

        container.appendChild(error);
    }

    /*
       Decorative background network.
       These lines are visual elements only.
       They do not represent actual company partnerships.
    */

    function drawBackgroundNetwork(svg, projection, width, height) {

        const d3 = window.d3;

        const points = [
            [-100, 40],
            [-75, 40],
            [-60, -10],
            [-45, -20],
            [-5, 50],
            [15, 45],
            [35, 5],
            [55, 25],
            [75, 30],
            [100, 35],
            [115, 5],
            [135, 35],
            [145, -25],
            [20, -25],
            [80, -20],
            [-120, 30],
            [-70, -35]
        ];

        const validPoints = points
            .map(point => projection(point))
            .filter(point =>
                point &&
                Number.isFinite(point[0]) &&
                Number.isFinite(point[1])
            );

        const lineGroup = svg.append("g")
            .attr("class", "global-network-lines");

        const nodeGroup = svg.append("g");

        validPoints.forEach((point, index) => {

            validPoints.forEach((other, otherIndex) => {

                if (otherIndex <= index) return;

                const distance = Math.hypot(
                    point[0] - other[0],
                    point[1] - other[1]
                );

                if (distance < width * 0.24) {

                    lineGroup.append("line")
                        .attr("x1", point[0])
                        .attr("y1", point[1])
                        .attr("x2", other[0])
                        .attr("y2", other[1])
                        .attr("stroke-opacity", 0.35);
                }
            });

            nodeGroup.append("circle")
                .attr("class", "global-network-node-glow")
                .attr("cx", point[0])
                .attr("cy", point[1])
                .attr("r", 5);

            nodeGroup.append("circle")
                .attr("class", "global-network-node")
                .attr("cx", point[0])
                .attr("cy", point[1])
                .attr("r", 1.2);
        });
    }

    function getAllLocations() {

        const network = window.AZADIPOUR_NETWORK;

        return [
            ...network.registered,
            ...network.partnerships,
            ...network.negotiations
        ];
    }

    function drawMarkers(svg, projection, width) {

        const d3 = window.d3;

        const locations = getAllLocations();

        const markerGroup = svg.append("g")
            .attr("class", "global-map-markers");

        locations.forEach(location => {

            const coordinates = projection(
                location.coordinates
            );

            if (!coordinates) return;

            const [x, y] = coordinates;

            const marker = markerGroup.append("g")
                .attr(
                    "class",
                    `global-map-marker ${location.status}`
                )
                .attr("transform", `translate(${x},${y})`)
                .attr("tabindex", 0)
                .attr("role", "button")
                .attr(
                    "aria-label",
                    `${location.name}: ${location.status}`
                );

            marker.append("circle")
                .attr("class", "marker-halo")
                .attr("r", width > 700 ? 9 : 7);

            marker.append("circle")
                .attr("class", "marker-core")
                .attr("r", width > 700 ? 3.5 : 3);

            const label = marker.append("text")
                .attr("class", "global-map-label")
                .attr("x", 12)
                .attr("y", -10)
                .text(location.city || location.name);

            if (location.status === "registered") {

                label.attr("font-weight", 700);

                marker.append("text")
                    .attr("class", "global-map-label-sub")
                    .attr("x", 12)
                    .attr("y", 3)
                    .text("REGISTERED PRESENCE");
            }

            marker.on("click", () => {
                showLocationDetails(location);
            });

            marker.on("keydown", event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    showLocationDetails(location);
                }
            });
        });
    }

    function showLocationDetails(location) {

        const name = location.name;
        const status = location.status;

        const statusLabels = {
            registered: "Registered presence",
            partnership: "Verified partnership",
            negotiation: "Active negotiations"
        };

        const event = new CustomEvent(
            "azadipour:location-selected",
            {
                detail: {
                    id: location.id,
                    name: name,
                    country: location.country || name,
                    status: status,
                    description: location.description || ""
                }
            }
        );

        document.dispatchEvent(event);

        const map = $(CONFIG.mapId);

        if (!map) return;

        let tooltip = map.querySelector(
            ".global-map-tooltip"
        );

        if (!tooltip) {

            tooltip = document.createElement("div");

            tooltip.className = "global-map-tooltip";

            map.appendChild(tooltip);
        }

        tooltip.innerHTML = "";

        const title = document.createElement("strong");
        title.textContent = name;

        const statusText = document.createElement("span");
        statusText.textContent =
            statusLabels[status] || "Company presence";

        const description = document.createElement("span");
        description.textContent =
            location.description || "";

        tooltip.appendChild(title);
        tooltip.appendChild(statusText);

        if (location.description) {
            tooltip.appendChild(description);
        }

        tooltip.classList.add("visible");

        window.clearTimeout(tooltip._hideTimer);

        tooltip._hideTimer = window.setTimeout(() => {
            tooltip.classList.remove("visible");
        }, 4500);
    }

    function drawMap(worldData) {

        const d3 = window.d3;
        const container = $(CONFIG.mapId);

        if (!container) return;

        const width = Math.max(
            container.clientWidth,
            320
        );

        const height = Math.max(
            container.clientHeight,
            width * 0.51
        );

        container.innerHTML = "";

        const svg = d3.select(container)
            .append("svg")
            .attr("class", "global-map-svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("role", "img")
            .attr(
                "aria-label",
                "Azadipour global presence and international network map"
            );

        svg.append("rect")
            .attr("class", "global-map-ocean")
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoNaturalEarth1()
            .fitExtent(
                [[12, 12], [width - 12, height - 12]],
                { type: "Sphere" }
            );

        const path = d3.geoPath(projection);

        const graticule = d3.geoGraticule()
            .step([30, 30]);

        svg.append("path")
            .datum(graticule())
            .attr("class", "global-map-graticule")
            .attr("d", path);

        const countries = window.topojson.feature(
            worldData,
            worldData.objects.countries
        );

        svg.append("g")
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("class", "global-map-land")
            .attr("d", path);

        svg.append("path")
            .datum(
                window.topojson.mesh(
                    worldData,
                    worldData.objects.countries,
                    (a, b) => a !== b
                )
            )
            .attr("class", "global-map-borders")
            .attr("d", path);

        drawBackgroundNetwork(
            svg,
            projection,
            width,
            height
        );

        drawMarkers(
            svg,
            projection,
            width
        );

        hideLoading();

        currentMapData = worldData;
    }

    async function initialize() {

        if (initialized) return;

        const container = $(CONFIG.mapId);

        if (!container) return;

        initialized = true;

        setLoading("INITIALIZING GLOBAL NETWORK");

        try {

            await loadLibraries();

            setLoading("LOADING WORLD GEOGRAPHY");

            const response = await fetch(
                CONFIG.worldUrl,
                {
                    cache: "force-cache"
                }
            );

            if (!response.ok) {
                throw new Error("World map data unavailable.");
            }

            const worldData = await response.json();

            drawMap(worldData);

            if (resizeObserver) {
                resizeObserver.disconnect();
            }

            resizeObserver = new ResizeObserver(() => {

                if (currentMapData) {
                    drawMap(currentMapData);
                }
            });

            resizeObserver.observe(container);

        } catch (error) {

            console.error(
                "Azadipour Global Map:",
                error
            );

            initialized = false;

            showError(
                "GLOBAL MAP TEMPORARILY UNAVAILABLE"
            );
        }
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();
    }

    window.AZADIPOUR_MAP = {
        refresh: () => {

            if (currentMapData) {
                drawMap(currentMapData);
            } else {
                initialize();
            }
        },

        getLocations: getAllLocations
    };

})();
