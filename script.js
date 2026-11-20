document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const body = document.body;
    const header = document.querySelector(".site-header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const intro = document.getElementById("intro");

    /* 01. INTRO SCREEN */
    if (intro) {
        const hideIntro = function () {
            intro.classList.add("hide");
            setTimeout(() => { intro.style.display = "none"; }, 900);
        };
        setTimeout(hideIntro, 1500);
    }

    /* 02. MOBILE NAVIGATION */
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
    }

    /* 03. HEADER SCROLL */
    function updateHeader() { if (header) header.classList.toggle("scrolled", window.scrollY > 35); }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* 04. AUTOMATIC FOOTER YEAR */
    const currentYear = new Date().getFullYear();
    if (document.getElementById("currentYear")) document.getElementById("currentYear").textContent = currentYear;

    /* =========================================================
       05. 3D GLOBE INITIALIZATION (HIGH PERFORMANCE)
    ========================================================= */
    const globeContainer = document.getElementById("globeViz");
    const loading = document.getElementById("mapLoading");
    
    if (globeContainer && typeof Globe !== 'undefined') {
        setTimeout(() => {
            try {
                const world = Globe()(globeContainer)
                    .backgroundColor('#050607')
                    .showAtmosphere(false)
                    .globeImageUrl(null) // No heavy image texture
                    .width(globeContainer.clientWidth)
                    .height(globeContainer.clientHeight)
                    // Limit pixel ratio to 1 for massive performance boost on mobile/retina
                    .rendererConfig({ antialias: false, alpha: true, pixelRatio: 1 });

                // Further back view and slight angle
                world.pointOfView({ lat: 25, lng: 45, altitude: 3.2 });

                // Black Globe Material
                world.globeMaterial(new THREE.MeshBasicMaterial({ color: '#050607' }));

                // Country Borders
                fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
                    .then(res => res.json())
                    .then(countries => {
                        world.polygonsData(countries.features)
                            .polygonCapColor(() => 'rgba(0,0,0,0)') 
                            .polygonSideColor(() => 'rgba(0,0,0,0)')
                            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.7)')
                            .polygonAltitude(0.002);
                    }).catch(err => console.error(err));

                // Coordinates
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
                    .arcStroke(0.6);

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
                    .htmlAltitude(d => d.type === 'A' ? 0.015 : 0.01);

                // Controls
                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.6;
                world.controls().enableZoom = false;
                world.controls().enablePan = false;

                if (loading) loading.style.display = "none";
                
                // ==========================================
                // PERFORMANCE BOOST: Pause rendering when out of view
                // ==========================================
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            world.controls().autoRotate = true; // Resume rotation
                        } else {
                            world.controls().autoRotate = false; // Stop rotation to save battery/CPU
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(globeContainer);

                window.addEventListener('resize', () => {
                    world.width(globeContainer.clientWidth);
                    world.height(globeContainer.clientHeight);
                });
            } catch(e) { console.error(e); }
        }, 300);
    }
});
