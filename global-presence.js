
document.addEventListener("DOMContentLoaded", async function () {
  // Shared navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  const globeElement = document.getElementById("globeViz");
  if (!globeElement || typeof Globe !== "function") return;

  const countryName = document.getElementById("countryName");
  const countryStatus = document.getElementById("countryStatus");
  const countryDescription = document.getElementById("countryDescription");
  const regionButtons = document.querySelectorAll(".region-button");

  const countryInfo = {
    "Oman": {
      status: "Registered Company",
      type: "registered",
      description: "Azadipour is registered in the Sultanate of Oman. Oman serves as the company's regional business foundation."
    },
    "Saudi Arabia": {
      status: "Target Market",
      type: "target",
      description: "A strategic target market for developing healthcare technology and hospital solution opportunities."
    },
    "United Arab Emirates": {
      status: "Target Market",
      type: "target",
      description: "A target market for exploring regional healthcare and medical technology opportunities."
    },
    "Qatar": {
      status: "Target Market",
      type: "target",
      description: "A target market for developing potential healthcare business opportunities."
    },
    "Bahrain": {
      status: "Target Market",
      type: "target",
      description: "A target market within Azadipour's wider GCC development strategy."
    },
    "Kuwait": {
      status: "Target Market",
      type: "target",
      description: "A target market for evaluating selected hospital and medical technology opportunities."
    },
    "Germany": {
      status: "Target Market",
      type: "target",
      description: "A selected European market under evaluation for potential business development."
    }
  };

  const networkLocations = [
    { name: "Oman", lat: 21.4735, lng: 55.9754, status: "registered" },
    { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, status: "target" },
    { name: "United Arab Emirates", lat: 23.4241, lng: 53.8478, status: "target" },
    { name: "Qatar", lat: 25.3548, lng: 51.1839, status: "target" },
    { name: "Bahrain", lat: 26.0667, lng: 50.5577, status: "target" },
    { name: "Kuwait", lat: 29.3117, lng: 47.4818, status: "target" },
    { name: "Germany", lat: 51.1657, lng: 10.4515, status: "target" }
  ];

  function showCountry(name) {
    const info = countryInfo[name];

    countryName.textContent = name || "Country information";

    if (!info) {
      countryStatus.textContent = "No designated status";
      countryStatus.className = "status-tag neutral";
      countryDescription.textContent =
        "No specific company presence or market status is currently designated for this country.";
      return;
    }

    countryStatus.textContent = info.status;
    countryStatus.className = "status-tag " + info.type;
    countryDescription.textContent = info.description;
  }

  const globe = Globe()(globeElement)
    .backgroundColor("rgba(0,0,0,0)")
    .showAtmosphere(true)
    .atmosphereColor("#8ba9bd")
    .atmosphereAltitude(0.16)
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
    .showGraticules(false)
    .polygonsData([])
    .polygonCapColor(function (feature) {
      const name = feature.properties.ADMIN || feature.properties.name;
      if (name === "Oman") return "rgba(211, 177, 112, 0.82)";
      if (countryInfo[name] && countryInfo[name].type === "target") {
        return "rgba(104, 158, 180, 0.48)";
      }
      return "rgba(45, 60, 72, 0.22)";
    })
    .polygonSideColor(() => "rgba(8, 12, 17, 0.25)")
    .polygonStrokeColor(() => "rgba(190, 178, 151, 0.28)")
    .polygonAltitude(function (feature) {
      const name = feature.properties.ADMIN || feature.properties.name;
      return countryInfo[name] ? 0.012 : 0.002;
    })
    .polygonsTransitionDuration(500)
    .onPolygonClick(function (feature) {
      const name = feature.properties.ADMIN || feature.properties.name;
      showCountry(name);
      globe.pointOfView({
        lat: feature.properties.LATITUDE || 25,
        lng: feature.properties.LONGITUDE || 50,
        altitude: 1.5
      }, 900);
    })
    .pointsData(networkLocations)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(d => d.status === "registered" ? "#e3c17e" : "#83c3d7")
    .pointAltitude(d => d.status === "registered" ? 0.035 : 0.022)
    .pointRadius(d => d.status === "registered" ? 0.34 : 0.25)
    .pointResolution(12)
    .pointsMerge(false)
    .pointLabel(d => `${d.name} · ${d.status === "registered" ? "Registered company" : "Target market"}`)
    .onPointClick(d => {
      showCountry(d.name);
      globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.35 }, 900);
    })
    .arcsData(networkLocations.slice(1).map(d => ({
      startLat: 21.4735,
      startLng: 55.9754,
      endLat: d.lat,
      endLng: d.lng,
      name: d.name
    })))
    .arcColor(() => ["#d7b875", "#6c9fb2"])
    .arcAltitude(0.25)
    .arcStroke(0.65)
    .arcDashLength(0.45)
    .arcDashGap(0.25)
    .arcDashAnimateTime(3500);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.32;
  globe.controls().enableDamping = true;
  globe.controls().dampingFactor = 0.08;
  globe.controls().minDistance = 150;
  globe.controls().maxDistance = 450;

  globe.pointOfView({ lat: 25, lng: 48, altitude: 2.15 }, 0);

  // Load country boundaries
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    );

    if (!response.ok) throw new Error("Country data could not be loaded.");

    const geoData = await response.json();
    globe.polygonsData(geoData.features);
  } catch (error) {
    console.error("Globe country data error:", error);
    countryDescription.textContent =
      "The globe is visible, but country boundaries could not be loaded. Please check the internet connection.";
  }

  // Region focus positions
  const regions = {
    all: { lat: 20, lng: 25, altitude: 2.5 },
    asia: { lat: 30, lng: 90, altitude: 1.8 },
    europe: { lat: 50, lng: 15, altitude: 1.8 },
    africa: { lat: 0, lng: 20, altitude: 2.0 },
    "north-america": { lat: 40, lng: -100, altitude: 2.0 },
    "south-america": { lat: -18, lng: -60, altitude: 2.0 },
    oceania: { lat: -25, lng: 135, altitude: 2.0 }
  };

  regionButtons.forEach(button => {
    button.addEventListener("click", function () {
      regionButtons.forEach(item => item.classList.remove("active"));
      this.classList.add("active");

      const region = regions[this.dataset.region];
      if (!region) return;

      globe.pointOfView(region, 1000);

      if (this.dataset.region === "all") {
        showCountry("Oman");
      } else {
        countryName.textContent = this.textContent;
        countryStatus.textContent = "Regional overview";
        countryStatus.className = "status-tag neutral";
        countryDescription.textContent =
          "Explore this region on the globe. Select a highlighted country to view its current Azadipour status.";
      }
    });
  });

  // Start with Oman selected
  showCountry("Oman");

  // Responsive globe sizing
  const resizeObserver = new ResizeObserver(() => {
    globe.width(globeElement.clientWidth);
    globe.height(globeElement.clientHeight);
  });

  resizeObserver.observe(globeElement);
});
