(() => {
  "use strict";

  const container = document.getElementById("globalNetworkMap");
  const loading = document.getElementById("mapLoading");

  if (!container) return;

  if (typeof Globe !== "function") {
    if (loading) {
      loading.textContent = "3D GLOBE LIBRARY COULD NOT BE LOADED";
    }
    return;
  }

  const countries = {
    "Oman": "registered",
    "Saudi Arabia": "target",
    "Qatar": "target",
    "United Arab Emirates": "target",
    "Bahrain": "target",
    "Kuwait": "target"
  };

  // Approximate business locations, not street-level pins.
  const locations = [
    {
      id: "oman",
      name: "AZADIPOUR",
      description: "Oman · Registered Company",
      lat: 23.5880,
      lng: 58.3829,
      color: "#dfe3e7",
      radius: 0.34
    },
    {
      id: "wemed",
      name: "WEMED",
      description: "Beijing · China",
      lat: 39.78,
      lng: 116.50,
      color: "#ffffff",
      radius: 0.42
    }
  ];

  const connection = [{
    startLat: locations[0].lat,
    startLng: locations[0].lng,
    endLat: locations[1].lat,
    endLng: locations[1].lng
  }];

  const globe = Globe()(container)
    .backgroundColor("#050607")
    .showAtmosphere(true)
    .atmosphereColor("#aeb6bf")
    .atmosphereAltitude(0.13)

    .globeImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-night.jpg"
    )
    .bumpImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-topology.png"
    )

    .showGraticules(false)

    // Country boundaries and muted market regions
    .polygonsData([])
    .polygonCapColor(feature => {
      const name =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME;

      if (countries[name] === "registered") {
        return "rgba(205, 211, 218, 0.30)";
      }

      if (countries[name] === "target") {
        return "rgba(160, 168, 177, 0.20)";
      }

      return "rgba(55, 62, 70, 0.10)";
    })
    .polygonSideColor(() => "rgba(10, 12, 15, 0.12)")
    .polygonStrokeColor(() => "rgba(190, 198, 207, 0.18)")
    .polygonAltitude(feature => {
      const name =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME;

      return countries[name] ? 0.009 : 0.001;
    })
    .polygonsTransitionDuration(500)

    // Main business locations
    .pointsData(locations)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(d => d.color)
    .pointAltitude(d => d.id === "wemed" ? 0.045 : 0.035)
    .pointRadius(d => d.radius)
    .pointResolution(18)
    .pointsMerge(false)
    .pointLabel(d => `
      <div style="
        background:#080a0c;
        border:1px solid #777f88;
        padding:9px 12px;
        color:#fff;
        font-family:Arial,sans-serif;
        font-size:12px;
      ">
        <strong>${d.name}</strong><br>
        <span style="color:#b8bec5">${d.description}</span>
      </div>
    `)
    .onPointClick(d => {
      globe.pointOfView({
        lat: d.lat,
        lng: d.lng,
        altitude: 1.5
      }, 900);
    })

    // Visible labels
    .labelsData(locations)
    .labelLat(d => d.lat)
    .labelLng(d => d.lng)
    .labelText(d => d.name)
    .labelSize(d => d.id === "wemed" ? 1.25 : 0.85)
    .labelColor(() => "#ffffff")
    .labelDotRadius(0)
    .labelAltitude(0.065)
    .labelResolution(3)

    // Oman to Beijing connection
    .arcsData(connection)
    .arcColor(() => "rgba(255,255,255,0.85)")
    .arcAltitude(0.24)
    .arcStroke(0.65)
    .arcDashLength(0.22)
    .arcDashGap(0.16)
    .arcDashInitialGap(0.08)
    .arcDashAnimateTime(3500);

  // Monochrome location rings
  globe
    .ringsData(locations)
    .ringLat(d => d.lat)
    .ringLng(d => d.lng)
    .ringColor(() => t =>
      `rgba(255,255,255,${1 - t})`
    )
    .ringMaxRadius(d => d.id === "wemed" ? 2.4 : 1.8)
    .ringPropagationSpeed(0.8)
    .ringRepeatPeriod(1800);

  // Globe movement and camera
  const controls = globe.controls();

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.28;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 150;
  controls.maxDistance = 400;

  // Initial view: Middle East and Asia
  globe.pointOfView({
    lat: 30,
    lng: 78,
    altitude: 2.15
  }, 0);

  // Load country boundaries
  fetch(
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
  )
    .then(response => {
      if (!response.ok) {
        throw new Error("Country data unavailable");
      }
      return response.json();
    })
    .then(data => {
      globe.polygonsData(data.features);
    })
    .catch(error => {
      console.error("Country data error:", error);
    })
    .finally(() => {
      if (loading) {
        loading.classList.add("is-hidden");
      }
    });

  // Responsive dimensions
  function resizeGlobe() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width > 0 && height > 0) {
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
  setTimeout(resizeGlobe, 500);
})();
