/* =========================================================
   AZADIPOUR — GLOBAL NETWORK MAP
   Oman Headquarters / WeMed Beijing
   Black / White / Silver
   ========================================================= */

(() => {
    "use strict";

    const canvas = document.getElementById("globalNetworkMap");
    const loading = document.getElementById("mapLoading");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const LIBRARIES = [
        "https://cdn.jsdelivr.net/npm/d3-geo@3/dist/d3-geo.min.js",
        "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"
    ];

    /*
     * Approximate WeMed location in Beijing, China.
     * This is an indicative map marker, not a street-level pin.
     * Coordinates: [longitude, latitude]
     */

    const WEMED = {
        name: "WEMED",
        coordinates: [116.50, 39.78]
    };

    /*
     * Azadipour registered entity / regional base in Oman.
     */

    const AZADIPOUR = {
        name: "AZADIPOUR · OMAN",
        coordinates: [58.4, 23.6]
    };

    /*
     * Country identifiers from world-atlas.
     * Oman: 512
     * Saudi Arabia: 682
     * Qatar: 634
     */

    const MUTED_MARKETS = new Set([
        "512",
        "682",
        "634"
    ]);

    let countries = [];
    let countryBorders = null;
    let projection = null;
    let path = null;

    let width = 0;
    let height = 0;
    let resizeObserver = null;

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src = url;
            script.async = true;

            script.onload = resolve;
            script.onerror = () => reject(
                new Error("Could not load map library: " + url)
            );

            document.head.appendChild(script);
        });
    }

    function setCanvasSize() {
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        width = rect.width;
        height = rect.height;

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        if (countries.length) {
            const padding = width < 600 ? 12 : 28;

            projection = d3.geoNaturalEarth1()
                .fitExtent(
                    [
                        [padding, padding],
                        [width - padding, height - padding]
                    ],
                    {
                        type: "FeatureCollection",
                        features: countries
                    }
                );

            path = d3.geoPath()
                .projection(projection)
                .context(ctx);

            drawMap();
        }
    }

    function drawBackground() {
        ctx.fillStyle = "#050607";
        ctx.fillRect(0, 0, width, height);

        const glow = ctx.createRadialGradient(
            width / 2,
            height / 2,
            5,
            width / 2,
            height / 2,
            width * 0.65
        );

        glow.addColorStop(
            0,
            "rgba(255,255,255,0.055)"
        );

        glow.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
    }

    function drawGrid() {
        ctx.beginPath();

        path(
            d3.geoGraticule()
                .step([30, 20])()
        );

        ctx.strokeStyle = "rgba(255,255,255,0.065)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    function drawCountries() {
        countries.forEach(country => {
            const countryId = String(country.id);

            ctx.beginPath();
            path(country);

            if (MUTED_MARKETS.has(countryId)) {
                ctx.fillStyle = "rgba(255,255,255,0.10)";
            } else {
                ctx.fillStyle = "rgba(185,191,198,0.43)";
            }

            ctx.fill();

            ctx.strokeStyle = "rgba(8,10,12,0.58)";
            ctx.lineWidth = 0.45;
            ctx.stroke();
        });

        if (countryBorders) {
            ctx.beginPath();
            path(countryBorders);

            ctx.strokeStyle = "rgba(10,12,14,0.65)";
            ctx.lineWidth = 0.45;
            ctx.stroke();
        }
    }

    function drawLocationMarker(location, options = {}) {
        const point = projection(location.coordinates);

        if (!point) return;

        const [x, y] = point;

        const radius = options.radius || 4;
        const color = options.color || "#ffffff";
        const labelColor = options.labelColor || "#ffffff";

        ctx.save();

        // Outer halo
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(255,255,255,0.13)";
        ctx.fill();

        // Main marker
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.fill();

        ctx.shadowBlur = 0;

        // Location label
        const fontSize = width < 600 ? 8 : 10;

        ctx.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
        ctx.fillStyle = labelColor;

        ctx.fillText(
            location.name,
            x + 13,
            y - 9
        );

        ctx.restore();
    }

    function drawConnectionLine() {
        const interpolate = d3.geoInterpolate(
            AZADIPOUR.coordinates,
            WEMED.coordinates
        );

        ctx.beginPath();

        for (let i = 0; i <= 90; i++) {
            const coordinate = interpolate(i / 90);
            const point = projection(coordinate);

            if (!point) continue;

            if (i === 0) {
                ctx.moveTo(point[0], point[1]);
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        }

        ctx.save();

        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);

        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
    }

    function drawMap() {
        if (!projection || !path) return;

        ctx.clearRect(0, 0, width, height);

        drawBackground();
        drawGrid();
        drawCountries();

        // Connection between Oman and Beijing
        drawConnectionLine();

        // WeMed: prominent white marker
        drawLocationMarker(WEMED, {
            radius: 4.5,
            color: "#ffffff",
            labelColor: "#ffffff"
        });

        // Azadipour: Oman registered entity / regional base
        drawLocationMarker(AZADIPOUR, {
            radius: 3.8,
            color: "#c9cdd1",
            labelColor: "rgba(255,255,255,0.78)"
        });
    }

    function hideLoading() {
        if (loading) {
            loading.classList.add("is-hidden");
        }
    }

    function showError() {
        if (loading) {
            loading.textContent = "GLOBAL MAP TEMPORARILY UNAVAILABLE";
        }

        console.error(
            "Azadipour global map could not be initialized."
        );
    }

    async function initializeMap() {
        try {
            for (const url of LIBRARIES) {
                await loadScript(url);
            }

            const response = await fetch(
                "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
            );

            if (!response.ok) {
                throw new Error("World map data unavailable.");
            }

            const worldData = await response.json();

            countries = topojson.feature(
                worldData,
                worldData.objects.countries
            ).features;

            countryBorders = topojson.mesh(
                worldData,
                worldData.objects.countries,
                (a, b) => a !== b
            );

            setCanvasSize();
            hideLoading();

            if ("ResizeObserver" in window) {
                resizeObserver = new ResizeObserver(() => {
                    setCanvasSize();
                });

                resizeObserver.observe(canvas.parentElement);
            } else {
                window.addEventListener(
                    "resize",
                    setCanvasSize
                );
            }

        } catch (error) {
            showError();
        }
    }

    initializeMap();

})();
