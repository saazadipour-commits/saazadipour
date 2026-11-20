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


    /* =====================================================
       01. INTRO SCREEN
    ===================================================== */

    if (intro) {
        const hideIntro = function () {
            intro.classList.add("hide");
            window.setTimeout(function () {
                intro.style.display = "none";
            }, reduceMotion ? 0 : 900);
        };

        if (reduceMotion) {
            hideIntro();
        } else {
            window.setTimeout(hideIntro, 1500);
        }
    }


    /* =====================================================
       02. MOBILE NAVIGATION
    ===================================================== */

    function closeMenu() {
        if (!menuToggle || !mainNav) return;
        mainNav.classList.remove("open");
        mainNav.classList.remove("active");
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
            link.addEventListener("click", function () {
                closeMenu();
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu = mainNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);
            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });
    }


    /* =====================================================
       03. HEADER SCROLL EFFECT
    ===================================================== */

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 35);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });


    /* =====================================================
       04. SMOOTH INTERNAL LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });
    });


    /* =====================================================
       05. REVEAL ANIMATIONS
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, .intro-detail, .technology-card, .presence-card, .network-legend, .network-footer, .contact-inner"
    );

    if (!reduceMotion && "IntersectionObserver" in window) {
        revealElements.forEach(function (element) {
            element.classList.add("reveal");
        });

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("reveal-visible");
        });
    }


    /* =====================================================
       06. AUTOMATIC FOOTER YEAR
    ===================================================== */

    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("currentYear");
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    document.querySelectorAll("[data-year]").forEach(function (element) {
        element.textContent = currentYear;
    });


    /* =====================================================
       07. CLOSE MOBILE MENU ON RESIZE
    ===================================================== */

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1050) {
            closeMenu();
        }
    });


    /* =====================================================
       08. GLOBE INITIALIZATION
    ===================================================== */

    // We use window load to ensure Three.js and Globe.gl are fully loaded
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
                    .showAtmosphere(false)
                    .width(globeContainer.clientWidth)
                    .height(globeContainer.clientHeight);

                world.pointOfView({ lat: 25, lng: 45, altitude: 2.3 });

                fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
                    .then(res => res.json())
                    .then(countries => {
                        world.polygonsData(countries.features)
                            .polygonCapColor(() => 'rgba(0,0,0,0)') 
                            .polygonSideColor(() => 'rgba(0,0,0,0)')
                            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.15)') 
                            .polygonAltitude(0.005);
                    }).catch(err => console.error("Error loading borders:", err));

                const omanHub = { lat: 23.588, lng: 58.383, label: "OMAN (HUB)" };
                const chinaSupplier = { lat: 22.543, lng: 114.057, label: "CHINA" };
                const taiwanSupplier = { lat: 25.033, lng: 121.565, label: "TAIWAN" };
                const germanyHub = { lat: 52.520, lng: 13.405, label: "GERMANY" };
                const usaHub = { lat: 37.774, lng: -122.419, label: "USA" };

                const gccHospitals = [
                    { lat: 24.713, lng: 46.675 }, { lat: 25.285, lng: 51.531 }, { lat: 25.204, lng: 55.270 }
                ];
                const europeHospitals = [
                    { lat: 48.856, lng: 2.352 }, { lat: 51.507, lng: -0.127 }, { lat: 41.902, lng: 12.496 }
                ];
                const americasHospitals = [
                    { lat: 40.712, lng: -74.006 }, { lat: 34.052, lng: -118.243 }, { lat: 43.653, lng: -79.383 }
                ];
                const chinaHospitals = [
                    { lat: 39.904, lng: 116.407 }, { lat: 31.230, lng: 121.473 }
                ];

                const arcsData = [];
                const whiteArc = ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.05)'];

                // Inbound: Taiwan -> Oman
                arcsData.push({ startLat: taiwanSupplier.lat, startLng: taiwanSupplier.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc });
                // Inbound: China -> Oman
                arcsData.push({ startLat: chinaSupplier.lat, startLng: chinaSupplier.lng, endLat: omanHub.lat, endLng: omanHub.lng, color: whiteArc });

                // Outbound: Oman -> GCC
                gccHospitals.forEach(h => arcsData.push({ startLat: omanHub.lat, startLng: omanHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));
                // Outbound: Germany -> Europe
                europeHospitals.forEach(h => arcsData.push({ startLat: germanyHub.lat, startLng: germanyHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));
                // Outbound: USA -> Americas
                americasHospitals.forEach(h => arcsData.push({ startLat: usaHub.lat, startLng: usaHub.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));
                // Outbound: China -> China
                chinaHospitals.forEach(h => arcsData.push({ startLat: chinaSupplier.lat, startLng: chinaSupplier.lng, endLat: h.lat, endLng: h.lng, color: whiteArc }));

                world.arcsData(arcsData)
                    .arcColor('color')
                    .arcDashLength(0.4)
                    .arcDashGap(0.2)
                    .arcDashAnimateTime(2500)
                    .arcStroke(0.3);

                const htmlElementsData = [
                    { ...omanHub, type: 'hub' },
                    { ...germanyHub, type: 'gold' },
                    { ...chinaSupplier, type: 'node' },
                    { ...taiwanSupplier, type: 'node' },
                    { ...usaHub, type: 'node' },
                    ...gccHospitals.map(h => ({ ...h, type: 'node' })),
                    ...europeHospitals.map(h => ({ ...h, type: 'node' })),
                    ...americasHospitals.map(h => ({ ...h, type: 'node' })),
                    ...chinaHospitals.map(h => ({ ...h, type: 'node' }))
                ];

                world.htmlElementsData(htmlElementsData)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.className = 'globe-marker';
                        if (d.type === 'hub') el.classList.add('marker-hub');
                        else if (d.type === 'gold') el.classList.add('marker-gold');
                        else el.classList.add('marker-node');
                        
                        el.innerHTML = `
                            <div class="marker-dot"></div>
                            ${d.label ? `<div class="marker-label">${d.label}</div>` : ''}
                        `;
                        return el;
                    })
                    .htmlAltitude(d => d.type === 'hub' || d.type === 'gold' ? 0.02 : 0.01);

                world.ringsData([omanHub])
                    .ringColor(() => t => `rgba(255, 255, 255, ${1-t})`)
                    .ringMaxRadius(2)
                    .ringPropagationSpeed(1.5)
                    .ringRepeatPeriod(2000);

                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.5;
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


    /* =====================================================
       09. WEBSITE READY
    ===================================================== */

    body.classList.add("js-ready");

});
