/* =====================================================
   AZADIPOUR — 3D GLOBAL PARTNERSHIP GLOBE
   Oman • WeMed China • Qatar • Saudi Arabia
   ===================================================== */

(() => {
  "use strict";

  const container = document.getElementById("globalNetworkMap");
  const loading = document.getElementById("mapLoading");

  if (!container || typeof Globe !== "function") {
    console.error("Azadipour 3D Globe could not initialize.");
    if (loading) loading.textContent = "3D GLOBE UNAVAILABLE";
    return;
  }

  // Country highlighting
  const countryStyles = {
    "China": "partner",
    "Qatar": "partner",
    "Saudi Arabia": "regional",
    "Oman": "base"
  };

  // Approximate geographic markers
  const locations = [
    {
      id: "azadipour",
      name: "AZADIPOUR",
      subtitle: "Muscat · Oman",
      lat: 23.5880,
      lng: 58.3829,
      type: "base",
      color: "#ffffff",
      radius: 0.48
    },
    {
      id: "wemed",
      name: "WEMED",
      subtitle: "Beijing · China",
      lat: 39.9042,
      lng: 116.4074,
      type: "partner",
      color: "#ffffff",
      radius: 0.43
    },
    {
      id: "qatar",
      name: "QATAR",
      subtitle: "Selected regional connection",
      lat: 25.3548,
      lng: 51.1839,
      type: "partner",
      color: "#ffffff",
      radius: 0.34
    },
    {
      id: "saudi",
      name: "SAUDI ARABIA",
      subtitle: "Regional market",
      lat: 23.8859,
      lng: 45.0792,
      type: "regional",
      color: "#b7bec7",
      radius: 0.27
    }
  ];

  // Only the Oman–WeMed connection is displayed.
  const connections = [{
    startLat: 23.5880,
    startLng: 58.3829,
    endLat: 39.9042,
    endLng: 116.4074,
    name: "Azadipour — WeMed"
  }];

  // Create globe
  const globe = Globe()(container)
    .backgroundColor("rgba(0,0,0,0)")
    .showAtmosphere(true)
    .atmosphereColor("#c7d0da")
    .atmosphereAltitude(0.17)

    // Earth texture
    .globeImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-night.jpg"
    )
    .bumpImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-topology.png"
    )
    .showGraticules(false)

    // Country surfaces
    .polygonsData([])
    .polygonCapColor(feature => {
      const name =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME ||
        feature.properties.NAME_EN;

      const type = countryStyles[name];

      if (type === "base") {
        return "rgba(255,255,255,0.82)";
      }

      if (type === "partner") {
        return "rgba(255,255,255,0.78)";
      }

      if (type === "regional") {
        return "rgba(195,202,211,0.35)";
      }

      return "rgba(45,52,61,0.12)";
    })
    .polygonSideColor(feature => {
      const name =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME;

      return countryStyles[name]
        ? "rgba(190,200,210,0.20)"
        : "rgba(5,8,12,0.08)";
    })
    .polygonStrokeColor(feature => {
      const name =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME;

      return countryStyles[name]
        ? "rgba(255,255,255,0.75)"
        : "rgba(170,180,190,0.12)";
    })
    .polygonAltitude(feature => {
      const name =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME;

      return countryStyles[name] ? 0.012 : 0.001;
    })
    .polygonsTransitionDuration(700)

    // Location points
    .pointsData(locations)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(d => d.color)
    .pointAltitude(d => d.type === "base" ? 0.045 : 0.035)
    .pointRadius(d => d.radius)
    .pointResolution(20)
    .pointsMerge(false)
    .pointLabel(d => `
      <div class="az-map-tooltip">
        <strong>${d.name}</strong>
        <span>${d.subtitle}</span>
      </div>
    `)
    .onPointClick(d => {
      globe.pointOfView({
        lat: d.lat,
        lng: d.lng,
        altitude: 1.35
      }, 1000);
    })

    // Country / company labels
    .labelsData(locations)
    .labelLat(d => d.lat)
    .labelLng(d => d.lng)
    .labelText(d => d.name)
    .labelSize(d => d.id === "azadipour" ? 1.15 : 0.85)
    .labelColor(d =>
      d.type === "regional"
        ? "rgba(220,225,230,0.72)"
        : "#ffffff"
    )
    .labelDotRadius(d => d.id === "azadipour" ? 0.25 : 0.18)
    .labelAltitude(0.075)
    .labelResolution(4)

    // Animated Oman to Beijing route
    .arcsData(connections)
    .arcStartLat(d => d.startLat)
    .arcStartLng(d => d.startLng)
    .arcEndLat(d => d.endLat)
    .arcEndLng(d => d.endLng)
    .arcColor(() => [
      "rgba(255,255,255,0.95)",
      "rgba(190,200,210,0.65)"
    ])
    .arcAltitude(0.27)
    .arcStroke(0.85)
    .arcDashLength(0.24)
    .arcDashGap(0.12)
    .arcDashInitialGap(0.04)
    .arcDashAnimateTime(2600);

  // Glowing location rings
  globe
    .ringsData(locations.filter(d =>
      d.id === "azadipour" || d.id === "wemed"
    ))
    .ringLat(d => d.lat)
    .ringLng(d => d.lng)
    .ringColor(() => t =>
      `rgba(255,255,255,${0.75 * (1 - t)})`
    )
    .ringMaxRadius(d => d.id === "azadipour" ? 2.4 : 2.0)
    .ringPropagationSpeed(0.7)
    .ringRepeatPeriod(1900);

  // Camera and rotation
  const controls = globe.controls();

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.24;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.minDistance = 145;
  controls.maxDistance = 430;

  // Initial view: Middle East and Asia
  globe.pointOfView({
    lat: 29,
    lng: 80,
    altitude: 2.05
  }, 0);

  // Load world borders
  fetch(
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
  )
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not load geographic data.");
      }
      return response.json();
    })
    .then(data => {
      globe.polygonsData(data.features);
    })
    .catch(error => {
      console.error("Azadipour map:", error);
    })
    .finally(() => {
      if (loading) loading.classList.add("is-hidden");
    });

  // Responsive sizing
  function resizeGlobe() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width && height) {
      globe.width(width);
      globe.height(height);
    }
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resizeGlobe);
    observer.observe(container);
  } else {
    window.addEventListener("resize", resizeGlobe);
  }

  resizeGlobe();
  window.addEventListener("load", resizeGlobe);
  setTimeout(resizeGlobe, 500);
  setTimeout(resizeGlobe, 1500);

})();
