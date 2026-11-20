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
       05. 2.5D COMMAND CENTER MAP (STRICTLY B&W)
    ========================================================= */
    const mapContainer = document.getElementById('luxuryMap');
    if (mapContainer && typeof L !== 'undefined') {
        
        // Initialize map
        const map = L.map('luxuryMap', {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: false // Disable dragging to keep it looking like a static dashboard
        }).setView([25.0, 45.0], 3);

        // Use a strictly Black & White tile layer (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        // Coordinates
        const omanHub = [23.588, 58.383];
        const taiwan = [25.033, 121.565];
        const chinaSupplier = [22.543, 114.057];
        const germany = [52.520, 13.405];
        const usa = [37.774, -122.419];

        const gccHospitals = [
            [24.713, 46.675], [25.285, 51.531], [25.204, 55.270], 
            [24.453, 54.377], [29.375, 47.977], [26.228, 50.586], 
            [17.015, 54.092], [24.207, 55.744]
        ];
        const europeHospitals = [[48.856, 2.352], [51.507, -0.127], [41.902, 12.496]];
        const americasHospitals = [[40.712, -74.006], [34.052, -118.243], [43.653, -79.383]];
        const chinaHospitals = [[39.904, 116.407], [31.230, 121.473]];

        // Custom Marker HTML (Strictly White & Black)
        function createIcon(type) {
            let size = type === 'A' ? 32 : (type === 'C' ? 24 : 18);
            let fontSize = type === 'A' ? 14 : (type === 'C' ? 11 : 9);
            let border = type === 'A' ? '2px solid #fff' : '1.5px solid #fff';
            let bg = type === 'A' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.8)';
            let shadow = type === 'A' ? '0 0 20px rgba(255,255,255,0.6)' : '0 0 10px rgba(0,0,0,0.8)';
            
            let html = `<div style="
                display:flex; justify-content:center; align-items:center;
                width:${size}px; height:${size}px; border-radius:50%;
                background:${bg}; border:${border}; color:#fff; font-weight:bold;
                font-family:'Inter', sans-serif; font-size:${fontSize}px;
                box-shadow:${shadow}; backdrop-filter:blur(2px);">${type}</div>`;
                
            return L.divIcon({
                html: html,
                className: '',
                iconSize: [size, size],
                iconAnchor: [size/2, size/2]
            });
        }

        // Add Markers
        L.marker(omanHub, { icon: createIcon('A'), zIndexOffset: 1000 }).addTo(map);
        L.marker(germany, { icon: createIcon('A') }).addTo(map);
        L.marker(taiwan, { icon: createIcon('C') }).addTo(map);
        L.marker(chinaSupplier, { icon: createIcon('C') }).addTo(map);

        [...gccHospitals, ...europeHospitals, ...americasHospitals, ...chinaHospitals].forEach(pos => {
            L.marker(pos, { icon: createIcon('H') }).addTo(map);
        });

        // Draw Luxury Curved Lines (Pure White)
        const drawArc = (start, end, weight = 1, dash = '4, 6') => {
            const midLat = (start[0] + end[0]) / 2 + (Math.abs(start[1] - end[1]) * 0.2);
            const midLng = (start[1] + end[1]) / 2;
            
            // Using polyline with a calculated midpoint to fake a bezier curve
            const points = [start, [midLat, midLng], end];
            
            L.polyline(points, {
                color: '#ffffff',
                weight: weight,
                opacity: 0.9,
                dashArray: dash,
                className: 'animated-arc'
            }).addTo(map);
        };

        // Inbound (Thicker White)
        drawArc(taiwan, omanHub, 2, '8, 8');
        drawArc(chinaSupplier, omanHub, 2, '8, 8');

        // Outbound (Thin White)
        gccHospitals.forEach(h => drawArc(omanHub, h, 1, '4, 6'));
        europeHospitals.forEach(h => drawArc(germany, h, 1, '4, 6'));
        americasHospitals.forEach(h => drawArc(usa, h, 1, '4, 6'));
        chinaHospitals.forEach(h => drawArc(chinaSupplier, h, 1, '4, 6'));

        // Pulsing Ring on Oman (White)
        L.circle(omanHub, {
            color: '#ffffff', fillColor: '#ffffff', fillOpacity: 0.1,
            radius: 100000, weight: 1, className: 'pulse-ring'
        }).addTo(map);
    }

});
