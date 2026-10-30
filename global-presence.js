/* =========================================================
   AZADIPOUR — GLOBAL PRESENCE
   Interactive 3D Globe
   Monochrome Edition
   ========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    "use strict";

    /* -----------------------------------------------------
       01. NAVIGATION
    ----------------------------------------------------- */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* -----------------------------------------------------
       02. AUTOMATIC FOOTER YEAR
    ----------------------------------------------------- */

    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* -----------------------------------------------------
       03. GLOBE ELEMENT
    ----------------------------------------------------- */

    const globeElement = document.getElementById("globeViz");

    if (!globeElement || typeof Globe !== "function") {
        console.warn("3D Globe library is not available.");
        return;
    }


    /* -----------------------------------------------------
       04. INTERFACE ELEMENTS
    ----------------------------------------------------- */

    const countryName = document.getElementById("countryName");
    const countryStatus = document.getElementById("countryStatus");
    const countryDescription = document.getElementById("countryDescription");

    const regionButtons = document.querySelectorAll(".region-button");


    /* -----------------------------------------------------
       05. COUNTRY INFORMATION
    ----------------------------------------------------- */

    const countryInfo = {

        "Oman": {
            status: "Registered Company",
            type: "registered",
            description:
                "Azadipour is registered in the Sultanate of Oman. Oman serves as the company's regional business foundation."
        },

        "Saudi Arabia": {
            status: "Target Market",
            type: "target",
            description:
                "A strategic target market for developing healthcare technology and hospital solution opportunities."
        },

        "United Arab Emirates": {
            status: "Target Market",
            type: "target",
            description:
                "A target market for exploring regional healthcare and medical technology opportunities."
        },

        "Qatar": {
            status: "Target Market",
            type: "target",
            description:
                "A target market for developing potential healthcare business opportunities."
        },

        "Bahrain": {
            status: "Target Market",
            type: "target",
            description:
                "A target market within Azadipour's wider GCC development strategy."
        },

        "Kuwait": {
            status: "Target Market",
            type: "target",
            description:
                "A target market for evaluating selected hospital and medical technology opportunities."
        },

        "Germany": {
            status: "Target Market",
            type: "target",
            description:
                "A selected European market under evaluation for potential business development."
        }

    };


    /* -----------------------------------------------------
       06. NETWORK LOCATIONS
    ----------------------------------------------------- */

    const networkLocations = [

        {
            name: "Oman",
            lat: 21.4735,
            lng: 55.9754,
            status: "registered"
        },

        {
            name: "Saudi Arabia",
            lat: 23.8859,
            lng: 45.0792,
            status: "target"
        },

        {
            name: "United Arab Emirates",
            lat: 23.4241,
            lng: 53.8478,
            status: "target"
        },

        {
            name: "Qatar",
            lat: 25.3548,
            lng: 51.1839,
            status: "target"
        },

        {
            name: "Bahrain",
            lat: 26.0667,
            lng: 50.5577,
            status: "target"
        },

        {
            name: "Kuwait",
            lat: 29.3117,
            lng: 47.4818,
            status: "target"
        },

        {
            name: "Germany",
            lat: 51.1657,
            lng: 10.4515,
            status: "target"
        }

    ];


    /* -----------------------------------------------------
       07. COUNTRY INFORMATION DISPLAY
    ----------------------------------------------------- */

    function showCountry(name) {

        if (!countryName || !countryStatus || !countryDescription) {
            return;
        }

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

        countryStatus.className =
            "status-tag " + info.type;

        countryDescription.textContent = info.description;

    }


    /* -----------------------------------------------------
       08. CREATE 3D GLOBE
    ----------------------------------------------------- */

    const globe = Globe()(globeElement)

        .backgroundColor("rgba(0,0,0,0)")

        .showAtmosphere(true)

        .atmosphereColor("#aeb8c2")

        .atmosphereAltitude(0.16)

        .globeImageUrl(
            "https://unpkg.com/three-globe/example/img/earth-night.jpg"
        )

        .bumpImageUrl(
            "https://unpkg.com/three-globe/example/img/earth-topology.png"
        )

        .showGraticules(false)

        .polygonsData([])

        .polygonCapColor(function (feature) {

            const name =
                feature.properties.ADMIN ||
                feature.properties.name;

            if (name === "Oman") {
                return "rgba(225, 230, 234, 0.88)";
            }

            if (
                countryInfo[name] &&
                countryInfo[name].type === "target"
            ) {
                return "rgba(160, 172, 184, 0.55)";
            }

            return "rgba(45, 60, 72, 0.22)";

        })

        .polygonSideColor(function () {
            return "rgba(8, 12, 17, 0.25)";
        })

        .polygonStrokeColor(function () {
            return "rgba(205, 212, 218, 0.28)";
        })

        .polygonAltitude(function (feature) {

            const name =
                feature.properties.ADMIN ||
                feature.properties.name;

            return countryInfo[name] ? 0.012 : 0.002;

        })

        .polygonsTransitionDuration(500)

        .onPolygonClick(function (feature) {

            const name =
                feature.properties.ADMIN ||
                feature.properties.name;

            showCountry(name);

            globe.pointOfView({
                lat: feature.properties.LATITUDE || 25,
                lng: feature.properties.LONGITUDE || 50,
                altitude: 1.5
            }, 900);

        })

        /* LOCATION POINTS */

        .pointsData(networkLocations)

        .pointLat(function (d) {
            return d.lat;
        })

        .pointLng(function (d) {
            return d.lng;
        })

        .pointColor(function (d) {
            return d.status === "registered"
                ? "#f0f2f4"
                : "#aeb8c2";
        })

        .pointAltitude(function (d) {
            return d.status === "registered"
                ? 0.035
                : 0.022;
        })

        .pointRadius(function (d) {
            return d.status === "registered"
                ? 0.34
                : 0.25;
        })

        .pointResolution(12)

        .pointsMerge(false)

        .pointLabel(function (d) {
            return `${d.name} · ${
                d.status === "registered"
                    ? "Registered company"
                    : "Target market"
            }`;
        })

        .onPointClick(function (d) {

            showCountry(d.name);

            globe.pointOfView({
                lat: d.lat,
                lng: d.lng,
                altitude: 1.35
            }, 900);

        })

        /* CONNECTION ARCS */

        .arcsData(
            networkLocations.slice(1).map(function (d) {

                return {
                    startLat: 21.4735,
                    startLng: 55.9754,
                    endLat: d.lat,
                    endLng: d.lng,
                    name: d.name
                };

            })
        )

        .arcColor(function () {
            return ["#dfe3e6", "#929da7"];
        })

        .arcAltitude(0.25)

        .arcStroke(0.65)

        .arcDashLength(0.45)

        .arcDashGap(0.25)

        .arcDashAnimateTime(3500);


    /* -----------------------------------------------------
       09. GLOBE CONTROLS
    ----------------------------------------------------- */

    const controls = globe.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.32;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 150;
    controls.maxDistance = 450;


    /* -----------------------------------------------------
       10. INITIAL CAMERA POSITION
    ----------------------------------------------------- */

    globe.pointOfView({
        lat: 25,
        lng: 48,
        altitude: 2.15
    }, 0);


    /* -----------------------------------------------------
       11. LOAD COUNTRY BOUNDARIES
    ----------------------------------------------------- */

    try {

        const response = await fetch(
            "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
        );

        if (!response.ok) {
            throw new Error("Country data could not be loaded.");
        }

        const geoData = await response.json();

        globe.polygonsData(geoData.features);

    } catch (error) {

        console.error("Globe country data error:", error);

        if (countryDescription) {

            countryDescription.textContent =
                "The globe is visible, but country boundaries could not be loaded. Please check the internet connection.";

        }

    }


    /* -----------------------------------------------------
       12. REGION CAMERA POSITIONS
    ----------------------------------------------------- */

    const regions = {

        all: {
            lat: 20,
            lng: 25,
            altitude: 2.5
        },

        asia: {
            lat: 30,
            lng: 90,
            altitude: 1.8
        },

        europe: {
            lat: 50,
            lng: 15,
            altitude: 1.8
        },

        africa: {
            lat: 0,
            lng: 20,
            altitude: 2.0
        },

        "north-america": {
            lat: 40,
            lng: -100,
            altitude: 2.0
        },

        "south-america": {
            lat: -18,
            lng: -60,
            altitude: 2.0
        },

        oceania: {
            lat: -25,
            lng: 135,
            altitude: 2.0
        }

    };


    /* -----------------------------------------------------
       13. REGION BUTTON EVENTS
    ----------------------------------------------------- */

    regionButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            regionButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

            const region = regions[this.dataset.region];

            if (!region) return;

            globe.pointOfView(region, 1000);

            if (this.dataset.region === "all") {

                showCountry("Oman");

            } else {

                if (countryName) {
                    countryName.textContent = this.textContent;
                }

                if (countryStatus) {
                    countryStatus.textContent = "Regional overview";
                    countryStatus.className = "status-tag neutral";
                }

                if (countryDescription) {

                    countryDescription.textContent =
                        "Explore this region on the globe. Select a highlighted country to view its current Azadipour status.";

                }

            }

        });

    });


    /* -----------------------------------------------------
       14. INITIAL COUNTRY
    ----------------------------------------------------- */

    showCountry("Oman");


    /* -----------------------------------------------------
       15. RESPONSIVE GLOBE SIZE
    ----------------------------------------------------- */

    if ("ResizeObserver" in window) {

        const resizeObserver = new ResizeObserver(function () {

            globe.width(globeElement.clientWidth);

            globe.height(globeElement.clientHeight);

        });

        resizeObserver.observe(globeElement);

    } else {

        window.addEventListener("resize", function () {

            globe.width(globeElement.clientWidth);

            globe.height(globeElement.clientHeight);

        });

    }

});
