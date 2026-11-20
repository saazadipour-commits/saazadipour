/* =========================================================
   AZADIPOUR - MAIN JAVASCRIPT & ULTIMATE GLOBE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const body = document.body;
    const header = document.querySelector(".site-header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const intro = document.getElementById("intro");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* INTRO SCREEN */
    if (intro) {
        const hideIntro = function () {
            intro.classList.add("hide");
            setTimeout(() => { intro.style.display = "none"; }, reduceMotion ? 0 : 900);
        };
        if (reduceMotion) hideIntro(); else setTimeout(hideIntro, 1500);
    }

    /* MOBILE NAVIGATION */
    function closeMenu() {
        if (!menuToggle || !mainNav) return;
        mainNav.classList.remove("open", "active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");
            mainNav.classList.toggle("active", isOpen);
            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            body.classList.toggle("menu-open", isOpen);
        });
        mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
        document.addEventListener("click", (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
        });
    }

    /* HEADER SCROLL & SMOOTH LINKS */
    function updateHeader() { if (header) header.classList.toggle("scrolled", window.scrollY > 35); }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

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

    /* AUTOMATIC FOOTER YEAR */
    const currentYear = new Date().getFullYear();
    if (document.getElementById("currentYear")) document.getElementById("currentYear").textContent = currentYear;

    /* =========================================================
       GLOBE INITIALIZATION (COMMAND CENTER STYLE)
    ========================================================= */
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
                    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                    .backgroundImageUrl(null)
                    .backgroundColor('#050607')
                    .showAtmosphere(false) // No clouds/atmosphere for precise map
                    .width(globeContainer.clientWidth)
                    .height(globeContainer.clientHeight);

                // Optimal view to see Americas, Europe, and Asia
                world.pointOfView({ lat: 25, lng: 40, altitude: 2.4 });

                // Clear, thick country borders
                fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
                    .then(res => res.json())
                    .then(countries => {
                        world.polygonsData(countries.features)
                            .polygonCapColor(() => 'rgba(0,0,0,0)') 
                            .polygonSideColor(() => 'rgba(0,0,0,0)')
                            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.4)') // Strong borders
                            .polygonAltitude(0.005);
                    }).catch(err => console.error(err));

                // --- NODES CONFIGURATION ---
                const omanHub = { lat: 23.588, lng: 58.383, type: 'A', color: 'white' };
                const germanyHub = { lat: 52.520, lng: 13.405, type: 'A', color: 'gold' };
                
                const suppliers = [
                    { lat: 22.543, lng: 114.057, type: 'C', color: 'blue' }, // China
                    { lat: 25.033, lng: 121.565, type: 'C', color: 'blue' }  // Taiwan
                ];

                // 10 GCC Hospitals
                const gccHospitals = [
                    { lat: 24.713, lng: 46.675, type: 'H' }, // Riyadh
                    { lat: 21.485, lng: 39.192, type: 'H' }, // Jeddah
                    { lat: 26.420, lng: 50.088, type: 'H' }, // Dammam
                    { lat: 25.204, lng: 55.270, type: 'H' }, // Dubai
                    { lat: 24.453, lng: 54.377, type: 'H' }, // Abu Dhabi
                    { lat: 25.285, lng: 51.531, type: 'H' }, // Doha
                    { lat: 29.375, lng: 47.977, type: 'H' }, // Kuwait City
                    { lat: 26.228, lng: 50.586, type: 'H' }, // Manama
                    { lat: 17.015, lng: 54.092, type: 'H' }, // Salalah
                    { lat: 24.207, lng: 55.744, type: 'H' }  // Al Ain
                ];

                // Europe Hospitals
                const europeHospitals = [
                    { lat: 51.507, lng: -0.127, type: 'H' }, // London
                    { lat: 48.856, lng: 2.352, type: 'H' },  // Paris
                    { lat: 41.902, lng: 12.496, type: 'H' }, // Rome
                    { lat: 40.416, lng: -3.703, type: 'H' }  // Madrid
                ];

                // Americas Hospitals
                const americasHospitals = [
                    { lat: 40.712, lng: -74.006, type: 'H' }, // NY
                    { lat: 34.052, lng: -118.243, type: 'H' },// LA
                    { lat: 43.653, lng: -79.383, type: 'H' }, // Toronto
                    { lat: -23.550, lng: -46.633, type: 'H' } // Sao Paulo
                ];

                // China Hospitals
                const chinaHospitals = [
                    { lat: 39.904, lng: 116.407, type: 'H' }, // Beijing
                    { lat: 31.230, lng: 121.473, type: 'H' }, // Shanghai
                    { lat: 23.129, lng: 113.264, type: 'H' }  // Guangzhou
                ];

                // --- ARCS (THICK & PRECISE) ---
                const arcsData = [];
                const arcStroke = 0.7; // Very thick lines
                const whiteArc = ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.1)'];
                const goldArc = ['rgba(255, 215, 0, 1)', 'rgba(255, 215, 0, 0.1)'];
                const blueArc = ['rgba(0, 191, 255, 1)', 'rgba(0, 191, 255, 0.1)'];

                // Inbound: Suppliers -> Oman
                suppliers.forEach(s => arcsData.push({ startLat: s.lat, startLng: s.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc, stroke: arcStroke }));
                
                // Outbound: Oman -> GCC
                gccHospitals.forEach(h => arcsData.push({ startLat: omanHub.lat, startLng: omanHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc, stroke: arcStroke }));
                
                // Outbound: Germany -> Europe (Gold)
                europeHospitals.forEach(h => arcsData.push({ startLat: germanyHub.lat, startLng: germanyHub.lng, endLat: h.lat, endLng: h.lng, color: goldArc, stroke: arcStroke }));
                
                // Outbound: USA (assumed SF) -> Americas
                americasHospitals.forEach(h => arcsData.push({ startLat: 37.774, startLng: -122.419, endLat: h.lat, endLng: h.lng, color: whiteArc, stroke: arcStroke }));
                
                // Outbound: China (Shenzhen) -> China
                chinaHospitals.forEach(h => arcsData.push({ startLat: 22.543, startLng: 114.057, endLat: h.lat, endLng: h.lng, color: blueArc, stroke: arcStroke }));

                world.arcsData(arcsData)
                    .arcColor('color')
                    .arcStroke('stroke')
                    .arcDashLength(0.4)
                    .arcDashGap(0.1)
                    .arcDashAnimateTime(2000);

                // --- HTML MARKERS (A, C, H) ---
                const allMarkers = [
                    omanHub, germanyHub, 
                    ...suppliers, 
                    ...gccHospitals, 
                    ...europeHospitals, 
                    ...americasHospitals, 
                    ...chinaHospitals
                ];

                world.htmlElementsData(allMarkers)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.className = 'globe-marker-node';
                        
                        // Add specific color classes
                        if (d.color === 'gold') el.classList.add('node-gold');
                        else if (d.color === 'blue') el.classList.add('node-blue');
                        else if (d.type === 'A') el.classList.add('node-hub');
                        
                        el.innerHTML = `<span>${d.type}</span>`;
                        return el;
                    })
                    .htmlAltitude(d => d.type === 'A' ? 0.02 : 0.01);

                // Pulsing Ring for Oman Hub
                world.ringsData([omanHub])
                    .ringColor(() => t => `rgba(255, 255, 255, ${1-t})`)
                    .ringMaxRadius(4)
                    .ringPropagationSpeed(2)
                    .ringRepeatPeriod(1500);

                // Controls
                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.4;
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
});
