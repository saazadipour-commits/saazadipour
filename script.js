/**
 * Azadipour Medical - Core JavaScript
 * Optimized for Performance & Speed
 */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // 1. Cache DOM Elements
    const body = document.body;
    const header = document.querySelector(".site-header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const intro = document.getElementById("intro");
    const currentYearEl = document.getElementById("currentYear");

    /* =========================================================
       01. INTRO SCREEN (Failsafe & Fast Hide)
    ========================================================= */
    if (intro) {
        // Hide intro when everything is loaded, or after max 1 second
        const hideIntro = () => {
            if (!intro.classList.contains("hide")) {
                intro.classList.add("hide");
                setTimeout(() => { intro.style.display = "none"; }, 600);
            }
        };

        window.addEventListener('load', hideIntro);
        setTimeout(hideIntro, 1000); // Failsafe
    }

    /* =========================================================
       02. MOBILE NAVIGATION (Using Event Delegation for Performance)
    ========================================================= */
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

        // Event Delegation: Only ONE listener for all links instead of many
        mainNav.addEventListener("click", function(e) {
            if (e.target.tagName === "A") {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (e) => { 
            if (e.key === "Escape") closeMenu(); 
        });
    }

    /* =========================================================
       03. HEADER SCROLL (Throttled with requestAnimationFrame)
       Prevents CPU throttling on mobile devices
    ========================================================= */
    if (header) {
        let isScrolling = false;
        
        window.addEventListener("scroll", () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    header.classList.toggle("scrolled", window.scrollY > 35);
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }

    /* =========================================================
       04. AUTOMATIC FOOTER YEAR
    ========================================================= */
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /* =========================================================
       05. 3D GLOBE INITIALIZATION (Decoupled from window.load)
       This starts loading immediately after DOM is ready, 
       independent of heavy images loading.
    ========================================================= */
    const globeContainer = document.getElementById("globeViz");
    const loading = document.getElementById("mapLoading");
    
    // Safety Timeout: If globe takes more than 8 seconds, show error
    let globeTimeout = setTimeout(() => {
        if (loading && loading.style.display !== "none") {
            loading.innerHTML = '<span style="color:var(--muted); font-size:10px; letter-spacing:1px;">NETWORK VISUALIZATION UNAVAILABLE</span>';
            setTimeout(() => { loading.style.display = "none"; }, 3000);
        }
    }, 8000);

    if (globeContainer && typeof Globe !== 'undefined') {
        // We use requestAnimationFrame to ensure the main thread is free before building the 3D scene
        requestAnimationFrame(() => {
            try {
                const world = Globe()(globeContainer)
                    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
                    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
                    .backgroundColor('#000000')
                    .showAtmosphere(false)
                    .width(globeContainer.clientWidth)
                    .height(globeContainer.clientHeight);

                // View Position
                world.pointOfView({ lat: 25, lng: 45, altitude: 2.2 });

                // Country Borders (Fetched asynchronously)
                fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
                    .then(res => res.json())
                    .then(countries => {
                        world.polygonsData(countries.features)
                            .polygonCapColor(() => 'rgba(0,0,0,0)') 
                            .polygonSideColor(() => 'rgba(0,0,0,0)')
                            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.5)') 
                            .polygonAltitude(0.005);
                    }).catch(err => {
                        console.warn("Could not load country borders:", err);
                    });

                // Coordinates & Data
                const omanHub = { lat: 23.588, lng: 58.383, type: 'A' };
                const taiwan = { lat: 25.033, lng: 121.565, type: 'C' };
                const chinaSupplier = { lat: 22.543, lng: 114.057, type: 'C' };
                const germany = { lat: 52.520, lng: 13.405, type: 'A' };
                const usa = { lat: 37.774, lng: -122.419, type: 'C' };

                const gccHospitals = [[24.713, 46.675], [25.285, 51.531], [25.204, 55.270], [24.453, 54.377], [29.375, 47.977], [26.228, 50.586], [17.015, 54.092], [24.207, 55.744]].map(p => ({ lat: p[0], lng: p[1], type: 'H' }));
                const europeHospitals = [[48.856, 2.352], [51.507, -0.127], [41.902, 12.496]].map(p => ({ lat: p[0], lng: p[1], type: 'H' }));
                const americasHospitals = [[40.712, -74.006], [34.052, -118.243], [43.653, -79.383]].map(p => ({ lat: p[0], lng: p[1], type: 'H' }));
                const chinaHospitals = [[39.904, 116.407], [31.230, 121.473]].map(p => ({ lat: p[0], lng: p[1], type: 'H' }));

                // Arcs
                const arcsData = [];
                const whiteArc = ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.1)'];

                arcsData.push({ startLat: taiwan.lat, startLng: taiwan.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc });
                arcsData.push({ startLat: chinaSupplier.lat, startLng: chinaSupplier.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc });
                gccHospitals.forEach(h => arcsData.push({ startLat: omanHub.lat, startLng: omanHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));
                europeHospitals.forEach(h => arcsData.push({ startLat: germany.lat, startLng: germany.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));
                americasHospitals.forEach(h => arcsData.push({ startLat: usa.lat, startLng: usa.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));
                chinaHospitals.forEach(h => arcsData.push({ startLat: chinaSupplier.lat, startLng: chinaSupplier.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));

                world.arcsData(arcsData)
                    .arcColor('color')
                    .arcDashLength(0.5)
                    .arcDashGap(0.2)
                    .arcDashAnimateTime(2000)
                    .arcStroke(0.5);

                // Markers
                const markersData = [omanHub, germany, taiwan, chinaSupplier, usa, ...gccHospitals, ...europeHospitals, ...americasHospitals, ...chinaHospitals];

                world.htmlElementsData(markersData)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.className = 'globe-marker';
                        if (d.type === 'A') el.classList.add('marker-A');
                        else if (d.type === 'C') el.classList.add('marker-C');
                        else el.classList.add('marker-H');
                        el.innerHTML = `<span>${d.type}</span>`;
                        return el;
                    })
                    .htmlAltitude(d => d.type === 'A' ? 0.02 : 0.01);

                // Rotation
                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.5;
                world.controls().enableZoom = false; 

                // Hide loading screen (Success)
                clearTimeout(globeTimeout); 
                if (loading) loading.style.display = "none";
                
                // Performance: Pause 3D rendering when out of view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            world.controls().autoRotate = true;
                        } else {
                            world.controls().autoRotate = false;
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(globeContainer);

                // Handle Resize efficiently
                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        world.width(globeContainer.clientWidth);
                        world.height(globeContainer.clientHeight);
                    }, 200);
                });
                
            } catch(e) { 
                console.error("Globe initialization failed:", e); 
                clearTimeout(globeTimeout);
                if (loading) {
                    loading.innerHTML = '<span style="color:var(--muted); font-size:10px;">WEBGL NOT SUPPORTED</span>';
                    setTimeout(() => { loading.style.display = "none"; }, 2000);
                }
            }
        });
    } else {
        // If library is not loaded at all
        if (loading) loading.style.display = "none";
    }
});
