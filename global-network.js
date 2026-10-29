/* ==========================================
   AZADIPOUR — GLOBAL NETWORK ENGINE
   Real Geographic World Map
   ========================================== */

(() => {
  "use strict";

  const canvas = document.getElementById("globalNetworkMap");
  const loading = document.getElementById("mapLoading");

  if (!canvas) return;

  const context = canvas.getContext("2d");

  const DATA_URL =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

  const SCRIPT_URLS = [
    "https://cdn.jsdelivr.net/npm/d3-geo@3/dist/d3-geo.min.js",
    "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"
  ];

  const COLORS = {
    ocean: "#090d12",
    land: "#222a33",
    landHighlight: "#303b47",
    borders: "rgba(190,205,220,0.22)",
    borderHighlight: "rgba(225,235,245,0.34)",
    route: "rgba(182,207,229,0.55)",
    routeGlow: "rgba(160,195,225,0.15)",
    oman: "#f0f5fa",
    market: "#b8cbdc",
    opportunity: "rgba(204,220,235,0.8)",
    text: "#e3eaf1",
    muted: "#a0acb8"
  };

  const locations = {
    oman: {
      name: "OMAN",
      coordinates: [58.4, 23.6],
      type: "registered"
    },

    connections: [
      { name: "EUROPE", coordinates: [10, 50] },
      { name: "NORTH AMERICA", coordinates: [-100, 39] },
      { name: "SOUTH AMERICA", coordinates: [-58, -15] },
      { name: "EAST ASIA", coordinates: [115, 34] },
      { name: "SOUTH ASIA", coordinates: [78, 21] },
      { name: "AFRICA", coordinates: [20, 0] },
      { name: "OCEANIA", coordinates: [135, -25] }
    ]
  };

  let worldFeatures = null;
  let borderFeatures = null;
  let projection = null;
  let pathGenerator = null;
  let width = 0;
  let height = 0;
  let animationFrame = null;
  let resizeObserver = null;
  let animationStart = 0;

  function hideLoading() {
    if (loading) {
      loading.classList.add("is-hidden");
    }
  }

  function showError(message) {
    if (!loading) return;

    loading.classList.remove("is-hidden");
    loading.innerHTML = `
      <span class="loading-indicator"></span>
      <span>${message}</span>
    `;
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const existing = Array.from(document.scripts)
        .find(script => script.src === url);

      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }

        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };

      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  async function loadDependencies() {
    for (const url of SCRIPT_URLS) {
      await loadScript(url);
    }

    if (!window.d3 || !window.topojson) {
      throw new Error("Geographic libraries could not be initialized.");
    }
  }

  async function loadWorldData() {
    const response = await fetch(DATA_URL, {
      cache: "force-cache"
    });

    if (!response.ok) {
      throw new Error("World geographic data unavailable.");
    }

    return response.json();
  }

  function setupProjection() {
    const padding = width < 600 ? 14 : 35;

    projection = d3.geoNaturalEarth1()
      .fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding]
        ],
        {
          type: "FeatureCollection",
          features: worldFeatures
        }
      );

    pathGenerator = d3.geoPath()
      .projection(projection)
      .context(context);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    if (worldFeatures) {
      setupProjection();
      drawScene(1);
    }
  }

  function drawOcean() {
    context.fillStyle = COLORS.ocean;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(
      width * 0.52,
      height * 0.48,
      10,
      width * 0.52,
      height * 0.48,
      width * 0.7
    );

    glow.addColorStop(0, "rgba(78,105,132,0.10)");
    glow.addColorStop(1, "rgba(8,12,17,0)");

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  function drawGraticule() {
    const graticule = d3.geoGraticule()
      .step([30, 20])();

    context.save();
    context.beginPath();
    pathGenerator(graticule);

    context.strokeStyle = "rgba(174,195,216,0.075)";
    context.lineWidth = 0.55;
    context.stroke();
    context.restore();
  }

  function drawCountries() {
    context.save();

    context.beginPath();

    worldFeatures.forEach(feature => {
      pathGenerator(feature);
    });

    context.fillStyle = COLORS.land;
    context.fill();

    context.strokeStyle = COLORS.borders;
    context.lineWidth = 0.45;
    context.stroke();

    context.restore();
  }

  function drawBorders() {
    if (!borderFeatures) return;

    context.save();
    context.beginPath();

    pathGenerator(borderFeatures);

    context.strokeStyle = COLORS.borderHighlight;
    context.lineWidth = 0.45;
    context.stroke();

    context.restore();
  }

  function drawRoute(start, end, progress = 1) {
    const interpolate = d3.geoInterpolate(start, end);
    const samples = 100;

    context.save();

    context.beginPath();

    for (let i = 0; i <= samples * progress; i++) {
      const point = projection(interpolate(i / samples));

      if (!point) continue;

      if (i === 0) {
        context.moveTo(point[0], point[1]);
      } else {
        context.lineTo(point[0], point[1]);
      }
    }

    context.strokeStyle = COLORS.routeGlow;
    context.lineWidth = 5;
    context.shadowColor = "rgba(165,205,235,0.4)";
    context.shadowBlur = 12;
    context.stroke();

    context.shadowBlur = 0;
    context.strokeStyle = COLORS.route;
    context.lineWidth = 1.15;
    context.stroke();

    context.restore();
  }

  function drawPoint(coordinates, type, label) {
    const point = projection(coordinates);

    if (!point) return;

    const [x, y] = point;

    context.save();

    if (type === "registered") {
      context.beginPath();
      context.arc(x, y, 11, 0, Math.PI * 2);
      context.fillStyle = "rgba(220,235,250,0.10)";
      context.fill();

      context.beginPath();
      context.arc(x, y, 4.1, 0, Math.PI * 2);
      context.fillStyle = COLORS.oman;
      context.shadowColor = COLORS.oman;
      context.shadowBlur = 14;
      context.fill();

      context.shadowBlur = 0;

      context.fillStyle = COLORS.text;
      context.font = "600 10px Inter, sans-serif";
      context.textAlign = "left";
      context.fillText(label, x + 12, y - 10);

    } else {
      context.beginPath();
      context.arc(x, y, 3, 0, Math.PI * 2);
      context.fillStyle = COLORS.market;
      context.shadowColor = COLORS.market;
      context.shadowBlur = 8;
      context.fill();

      context.shadowBlur = 0;
    }

    context.restore();
  }

  function drawConnectionLabels() {
    const labelLocations = [
      { name: "NORTH AMERICA", coordinates: [-100, 47] },
      { name: "SOUTH AMERICA", coordinates: [-60, -25] },
      { name: "EUROPE", coordinates: [15, 57] },
      { name: "AFRICA", coordinates: [22, -13] },
      { name: "ASIA", coordinates: [105, 45] },
      { name: "OCEANIA", coordinates: [140, -35] }
    ];

    context.save();

    context.font = "600 8px Inter, sans-serif";
    context.fillStyle = "rgba(211,224,237,0.56)";
    context.textAlign = "center";
    context.letterSpacing = "1.4px";

    labelLocations.forEach(item => {
      const point = projection(item.coordinates);

      if (point) {
        context.fillText(item.name, point[0], point[1]);
      }
    });

    context.restore();
  }

  function drawScene(routeProgress = 1) {
    if (!projection || !worldFeatures) return;

    context.clearRect(0, 0, width, height);

    drawOcean();
    drawGraticule();
    drawCountries();
    drawBorders();

    locations.connections.forEach(location => {
      drawRoute(
        locations.oman.coordinates,
        location.coordinates,
        routeProgress
      );
    });

    locations.connections.forEach(location => {
      drawPoint(location.coordinates, "market", location.name);
    });

    drawPoint(
      locations.oman.coordinates,
      "registered",
      "OMAN"
    );

    drawConnectionLabels();
  }

  function animate(timestamp) {
    if (!animationStart) animationStart = timestamp;

    const elapsed = timestamp - animationStart;
    const duration = 1800;

    const progress = Math.min(elapsed / duration, 1);

    drawScene(progress);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animationFrame = null;
    }
  }

  function startAnimation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawScene(1);
      return;
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    animationStart = 0;
    animationFrame = requestAnimationFrame(animate);
  }

  async function initialize() {
    try {
      await loadDependencies();

      const world = await loadWorldData();

      worldFeatures = topojson.feature(
        world,
        world.objects.countries
      ).features;

      borderFeatures = topojson.mesh(
        world,
        world.objects.countries,
        (a, b) => a !== b
      );

      resizeCanvas();
      startAnimation();
      hideLoading();

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
        });

        resizeObserver.observe(canvas.parentElement);
      } else {
        window.addEventListener("resize", resizeCanvas);
      }

    } catch (error) {
      console.error("Azadipour global map:", error);
      showError("GLOBAL MAP TEMPORARILY UNAVAILABLE");
    }
  }

  initialize();

})();
