
/* =========================================================
   AZADIPOUR — SITE SCRIPT
   Mobile navigation + footer year + interactive world map
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* MOBILE NAVIGATION */

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

    /* FOOTER YEAR */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* INTRO ANIMATION */

    const intro = document.getElementById("intro");

    if (intro) {
        const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 200
            : 1800;

        window.setTimeout(function () {
            intro.classList.add("hide");
        }, delay);
    }

    /* INTERACTIVE WORLD MAP */

    const mapElement = document.getElementById("worldMap");

    if (!mapElement || typeof L === "undefined") {
        return;
    }

    const mapLoading = document.getElementById("mapLoading");
    const infoDefault = document.getElementById("countryInfoDefault");
    const infoResult = document.getElementById("countryInfoResult");

    const countryNameElement = document.getElementById("selectedCountryName");
    const statusElement = document.getElementById("selectedCountryStatus");
    const descriptionElement = document.getElementById("selectedCountryDescription");
    const continentElement = document.getElementById("selectedCountryContinent");
    const relationshipElement = document.getElementById("selectedCountryRelationship");

    const continentButtons = document.querySelectorAll(".continent-button");

    const map = L.map("worldMap", {
        center: [20, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 7,
        worldCopyJump: true,
        zoomControl: true,
        attributionControl: true
    });

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19
        }
    ).addTo(map);

    /* COUNTRY CLASSIFICATIONS
       Only verified/designated statuses are assigned here.
       Other countries remain without a designated status.
    */

    const countryStatuses = {
        "Oman": {
            status: "Registered Entity",
            relationship: "Registered corporate base",
            description:
                "Azadipour is registered in Oman. Oman serves as the company's corporate base for regional business development.",
            className: "registered"
        },

        "Saudi Arabia": {
            status: "Target Market",
            relationship: "Market development",
            description:
                "Saudi Arabia is a target market for exploring healthcare-sector opportunities, medical technology requirements and potential business relationships.",
            className: "target"
        },

        "United Arab Emirates": {
            status: "Target Market",
            relationship: "Market development",
            description:
                "The UAE is a target market for identifying potential healthcare projects, technology opportunities and business relationships.",
            className: "target"
        },

        "Qatar": {
            status: "Target Market",
            relationship: "Market development",
            description:
                "Qatar is a target market for exploring healthcare-sector requirements and potential medical technology opportunities.",
            className: "target"
        },

        "Bahrain": {
            status: "Target Market",
            relationship: "Market development",
            description:
                "Bahrain is a target market for evaluating healthcare-sector opportunities and potential business relationships.",
            className: "target"
        },

        "Kuwait": {
            status: "Target Market",
            relationship: "Market development",
            description:
                "Kuwait is a target market for exploring healthcare-sector opportunities and medical technology requirements.",
            className: "target"
        },

        "Germany": {
            status: "Target Market",
            relationship: "International market development",
            description:
                "Germany is being evaluated as a selected European market for future business development and international opportunities.",
            className: "target"
        }
    };

    /* COUNTRY NAME ALIASES */

    const countryAliases = {
        "United States of America": "United States",
        "United States": "United States",
        "UAE": "United Arab Emirates",
        "Republic of Korea": "South Korea",
        "Korea, Republic of": "South Korea",
        "Russian Federation": "Russia",
        "Czechia": "Czech Republic",
        "Türkiye": "Turkey",
        "The Netherlands": "Netherlands"
    };

    /* CONTINENT BOUNDS */

    const continentBounds = {
        world: [[-58, -180], [82, 180]],
        africa: [[-36, -20], [38, 55]],
        asia: [[-12, 25], [82, 180]],
        europe: [[34, -12], [72, 45]],
        "north-america": [[5, -170], [85, -45]],
        "south-america": [[-58, -82], [13, -32]],
        oceania: [[-50, 110], [0, 180]]
    };

    /* COUNTRY CONTINENT LOOKUP */

    const continentGroups = {
        Africa: [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso",
            "Burundi", "Cameroon", "Cape Verde", "Central African Republic",
            "Chad", "Comoros", "Democratic Republic of the Congo",
            "Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea",
            "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana",
            "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho",
            "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania",
            "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
            "Nigeria", "Rwanda", "Senegal", "Sierra Leone", "Somalia",
            "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo",
            "Tunisia", "Uganda", "Zambia", "Zimbabwe"
        ],

        Asia: [
            "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh",
            "Bhutan", "Brunei", "Cambodia", "China", "Cyprus", "Georgia",
            "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan",
            "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos",
            "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar",
            "Nepal", "North Korea", "Oman", "Pakistan", "Palestine",
            "Philippines", "Qatar", "Saudi Arabia", "Singapore",
            "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan",
            "Thailand", "Timor-Leste", "Turkey", "Turkmenistan",
            "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
        ],

        Europe: [
            "Albania", "Andorra", "Austria", "Belarus", "Belgium",
            "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic",
            "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
            "Hungary", "Iceland", "Ireland", "Italy", "Latvia",
            "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova",
            "Monaco", "Montenegro", "Netherlands", "North Macedonia",
            "Norway", "Poland", "Portugal", "Romania", "Russia",
            "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain",
            "Sweden", "Switzerland", "Ukraine", "United Kingdom",
            "Vatican City"
        ],

        "North America": [
            "Antigua and Barbuda", "Bahamas", "Barbados", "Belize",
            "Canada", "Costa Rica", "Cuba", "Dominica", "Dominican Republic",
            "El Salvador", "Grenada", "Guatemala", "Haiti", "Honduras",
            "Jamaica", "Mexico", "Nicaragua", "Panama",
            "Saint Kitts and Nevis", "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "Trinidad and Tobago", "United States"
        ],

        "South America": [
            "Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
            "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname",
            "Uruguay", "Venezuela"
        ],

        Oceania: [
            "Australia", "Fiji", "Kiribati", "Marshall Islands",
            "Micronesia", "Nauru", "New Zealand", "Palau",
            "Papua New Guinea", "Samoa", "Solomon Islands",
            "Tonga", "Tuvalu", "Vanuatu"
        ]
    };

    function getContinent(countryName) {
        for (const continent in continentGroups) {
            if (continentGroups[continent].includes(countryName)) {
                return continent;
            }
        }

        return "Other / Unclassified";
    }

    function getCountryName(feature) {
        const properties = feature.properties || {};

        const rawName =
            properties.ADMIN ||
            properties.name ||
            properties.NAME ||
            properties.NAME_EN ||
            "Unknown country";

        return countryAliases[rawName] || rawName;
    }

    function getCountryStatus(countryName) {
        return countryStatuses[countryName] || {
            status: "No Designated Status",
            relationship: "Not currently designated",
            description:
                "No registered entity, corporate office, strategic partner or designated target-market status is currently listed for this country.",
            className: "neutral"
        };
    }

    function getCountryStyle(feature) {
        const countryName = getCountryName(feature);
        const status = getCountryStatus(countryName);

        const colors = {
            registered: "#b99b68",
            office: "#70a9c9",
            partner: "#a58acb",
            target: "#d1d5d9",
            neutral: "#343b43"
        };

        return {
            fillColor: colors[status.className] || colors.neutral,
            weight: 0.8,
            opacity: 1,
            color: "#08090b",
            fillOpacity: status.className === "neutral" ? 0.42 : 0.85
        };
    }

    let geoJsonLayer = null;
    let selectedLayer = null;
    let selectedCountry = null;

    function resetSelectedLayer() {
        if (selectedLayer && geoJsonLayer) {
            geoJsonLayer.resetStyle(selectedLayer);
        }
        selectedLayer = null;
    }

    function displayCountry(countryName, continent) {
        const status = getCountryStatus(countryName);

        if (infoDefault) infoDefault.hidden = true;
        if (infoResult) infoResult.hidden = false;

        countryNameElement.textContent = countryName;
        statusElement.textContent = status.status;
        statusElement.className = "country-status " + status.className;
        descriptionElement.textContent = status.description;
        continentElement.textContent = continent;
        relationshipElement.textContent = status.relationship;
    }

    function selectCountry(feature, layer) {
        const countryName = getCountryName(feature);
        const continent = getContinent(countryName);

        resetSelectedLayer();

        selectedLayer = layer;
        selectedCountry = countryName;

        layer.setStyle({
            weight: 2.5,
            color: "#ffffff",
            fillOpacity: 1
        });

        displayCountry(countryName, continent);
    }

    function onEachCountry(feature, layer) {
        const countryName = getCountryName(feature);

        layer.bindTooltip(countryName, {
            sticky: true,
            direction: "top",
            className: "country-tooltip"
        });

        layer.on({
            click: function () {
                selectCountry(feature, layer);
            },

            mouseover: function () {
                if (layer !== selectedLayer) {
                    layer.setStyle({
                        weight: 1.6,
                        color: "#d6b77e",
                        fillOpacity: 0.95
                    });
                }
            },

            mouseout: function () {
                if (layer !== selectedLayer && geoJsonLayer) {
                    geoJsonLayer.resetStyle(layer);
                }
            }
        });
    }

    /* LOAD WORLD COUNTRY BOUNDARIES */

    const geoJsonURL =
        "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

    fetch(geoJsonURL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load country boundaries.");
            }
            return response.json();
        })
        .then(function (geoData) {

            geoJsonLayer = L.geoJSON(geoData, {
                style: getCountryStyle,
                onEachFeature: onEachCountry
            }).addTo(map);

            if (mapLoading) {
                mapLoading.remove();
            }

            map.fitBounds(continentBounds.world);
            map.invalidateSize();

        })
        .catch(function (error) {
            console.error("World map error:", error);

            if (mapLoading) {
                mapLoading.textContent =
                    "The map could not be loaded. Please check your internet connection and reload the page.";
                mapLoading.classList.add("map-loading-error");
            }
        });

    /* CONTINENT BUTTONS */

    continentButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const continent = button.dataset.continent;

            continentButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (continentBounds[continent]) {
                map.fitBounds(continentBounds[continent], {
                    padding: [20, 20],
                    maxZoom: continent === "world" ? 2 : 4
                });
            }
        });

    });

    /* RESET SELECTION WHEN MAP BACKGROUND IS CLICKED */

    map.on("click", function (event) {
        if (event.originalEvent && event.originalEvent.target === map.getContainer()) {
            resetSelectedLayer();
        }
    });

    /* MOBILE MAP RESIZE */

    window.addEventListener("resize", function () {
        map.invalidateSize();
    });

});
