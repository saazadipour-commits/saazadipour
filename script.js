/* =========================================================
   AZADIPOUR
   MAIN WEBSITE JAVASCRIPT & GLOBE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const body = document.body;
    const header = document.querySelector(".site-header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const intro = document.getElementById("intro");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* 01. INTRO SCREEN */
    if (intro) {
        const hideIntro = function () {
            intro.classList.add("hide");
            window.setTimeout(function () {
                intro.style.display = "none";
            }, reduceMotion ? 0 : 900);
        };
        if (reduceMotion) { hideIntro(); } else { window.setTimeout(hideIntro, 1500); }
    }

    /* 02. MOBILE NAVIGATION */
    function closeMenu() {
        if (!menuToggle || !mainNav) return;
        mainNav.classList.remove("open", "active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        body.classList.remove("menu-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");
            mainNav.classList.toggle("active", isOpen);
            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
            body.classList.toggle("menu-open", isOpen);
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeMenu();
        });

        document.addEventListener("click", function (event) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
        });
    }

    /* 03. HEADER SCROLL */
    function updateHeader() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 35);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* 04. SMOOTH INTERNAL LINKS */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: reduceMotion ? "auto" : "smooth" });
        });
    });

    /* 05. AUTOMATIC FOOTER YEAR */
    const currentYear = new Date().getFullYear();
    if (document.getElementById("currentYear")) document.getElementById("currentYear").textContent = currentYear;
    document.querySelectorAll("[data-year]").forEach(el => el.textContent = currentYear);

    /* 06. GLOBE INITIALIZATION */
    window.addEventListener('load', () => {
        const globeContainer = document.getElementById("globeViz");
        const loading = document.getElementById("mapLoading");
        if (!globeContainer) return;

        setTimeout(() => {
            if (typeof Globe === 'undefined' || typeof THREE === 'undefined') {
                if (loading) loading.style.display = "none";
                return;
            }

            try {
                const world = Globe()(globeContainer)
                    // Using a high-res natural earth texture
                    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                    .backgroundImageUrl(null)
                    .backgroundColor('#050607')
                    .showAtmosphere(false)
                    .width(globeContainer.clientWidth)
                    .height(globeContainer.clientHeight);

                // Set a perfect view to see US, Europe, and Asia
                world.pointOfView({ lat: 30, lng: 20, altitude: 2.5 });

                // Load Country Borders (Thicker and brighter for luxury look)
                fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
                    .then(res => res.json())
                    .then(countries => {
                        world.polygonsData(countries.features)
                            .polygonCapColor(() => 'rgba(0,0,0,0)') 
                            .polygonSideColor(() => 'rgba(0,0,0,0)')
                            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.4)') // Much clearer borders
                            .polygonAltitude(0.005);
                    }).catch(err => console.error("Error loading borders:", err));

                // --- PRECISE COORDINATES ---
                const omanHub = { lat: 23.588, lng: 58.383, label: "OMAN HQ" };
                const chinaSupplier = { lat: 31.230, lng: 121.473, label: "CHINA" };
                const taiwanSupplier = { lat: 25.033, lng: 121.565, label: "TAIWAN" };
                const germanyHub = { lat: 52.520, lng: 13.405, label: "GERMANY" };
                const usaHub = { lat: 37.774, lng: -122.419, label: "USA" };

                // Hospitals explicitly defined
                const gccHospitals = [
                    { lat: 24.713, lng: 46.675, label: "Riyadh" }, 
                    { lat: 25.285, lng: 51.531, label: "Doha" }, 
                    { lat: 25.204, lng: 55.270, label: "Dubai" }
                ];
                const europeHospitals = [
                    { lat: 48.856, lng: 2.352, label: "Paris" }, 
                    { lat: 51.507, lng: -0.127, label: "London" }, 
                    { lat: 41.902, lng: 12.496, label: "Rome" }
                ];
                const americasHospitals = [
                    { lat: 40.712, lng: -74.006, label: "New York" }, 
                    { lat: 34.052, lng: -118.243, label: "Los Angeles" }, 
                    { lat: 43.653, lng: -79.383, label: "Toronto" }
                ];
                const chinaHospitals = [
                    { lat: 39.904, lng: 116.407, label: "Beijing" }, 
                    { lat: 22.543, lng: 114.057, label: "Shenzhen" }
                ];

                // --- THICK, VISIBLE ARCS ---
                const arcsData = [];
                const whiteArc = ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.2)']; // Thick bright white
                const goldArc = ['rgba(255, 215, 0, 1)', 'rgba(255, 215, 0, 0.2)']; // Thick bright gold
                const blueArc = ['rgba(0, 191, 255, 1)', 'rgba(0, 191, 255, 0.2)']; // Thick bright blue

                // Inbound: Taiwan -> Oman
                arcsData.push({ startLat: taiwanSupplier.lat, startLng: taiwanSupplier.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc, stroke: 0.8 });
                // Inbound: China -> Oman
                arcsData.push({ startLat: chinaSupplier.lat, startLng: chinaSupplier.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc, stroke: 0.8 });

                // Outbound: Oman -> GCC
                gccHospitals.forEach(h => arcsData.push({ startLat: omanHub.lat, startLng: omanHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc, stroke: 0.5 }));
                // Outbound: Germany -> Europe (Gold)
                europeHospitals.forEach(h => arcsData.push({ startLat: germanyHub.lat, startLng: germanyHub.lng, endLat: h.lat, endLng: h.lng, color: goldArc, stroke: 0.5 }));
                // Outbound: USA -> Americas
                americasHospitals.forEach(h => arcsData.push({ startLat: usaHub.lat, startLng: usaHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc, stroke: 0.5 }));
                // Outbound: China -> China
                chinaHospitals.forEach(h => arcsData.push({ startLat: chinaSupplier.lat, startLng: chinaSupplier.lng, endLat: h.lat, endLng: h.lng, color: blueArc, stroke: 0.5 }));

                world.arcsData(arcsData)
                    .arcColor('color')
                    .arcStroke('stroke') // Applying the thick stroke
                    .arcDashLength(0.5)
                    .arcDashGap(0.1)
                    .arcDashAnimateTime(2000);

                // --- MARKERS & LABELS (Visible) ---
                const htmlElementsData = [
                    { ...omanHub, type: 'hub' },
                    { ...germanyHub, type: 'gold' },
                    { ...chinaSupplier, type: 'supplier' },
                    { ...taiwanSupplier, type: 'supplier' },
                    { ...usaHub, type: 'supplier' },
                    ...gccHospitals.map(h => ({ ...h, type: 'hospital' })),
                    ...europeHospitals.map(h => ({ ...h, type: 'hospital' })),
                    ...americasHospitals.map(h => ({ ...h, type: 'hospital' })),
                    ...chinaHospitals.map(h => ({ ...h, type: 'hospital' }))
                ];

                world.htmlElementsData(htmlElementsData)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.className = 'globe-marker';
                        if (d.type === 'hub') el.classList.add('marker-hub');
                        else if (d.type === 'gold') el.classList.add('marker-gold');
                        else if (d.type === 'supplier') el.classList.add('marker-supplier');
                        else el.classList.add('marker-hospital');
                        
                        el.innerHTML = `
                            <div class="marker-dot"></div>
                            ${d.label ? `<div class="marker-label">${d.label}</div>` : ''}
                        `;
                        return el;
                    })
                    .htmlAltitude(d => d.type === 'hub' || d.type === 'gold' ? 0.02 : 0.01);

                // Ring for Oman Hub
                world.ringsData([omanHub])
                    .ringColor(() => t => `rgba(255, 255, 255, ${1-t})`)
                    .ringMaxRadius(3)
                    .ringPropagationSpeed(2)
                    .ringRepeatPeriod(1500);

                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.3; // Slow rotation for luxury feel
                world.controls().enableZoom = true;
                world.controls().minDistance = 150;

                if (loading) loading.style.display = "none";

                window.addEventListener('resize', () => {
                    world.width(globeContainer.clientWidth);
                    world.height(globeContainer.clientHeight);
                });
            } catch (err) {
                console.error(err);
                if (loading) loading.style.display = "none";
            }
        }, 100);
    });

    body.classList.add("js-ready");
});
