/* =========================================================
   AZADIPOUR
   MAIN WEBSITE JAVASCRIPT
   Navigation / Intro / Scroll / Footer
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
            // Matches the .hide class in CSS
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

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

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

        header.classList.toggle(
            "scrolled",
            window.scrollY > 35
        );

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


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

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

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
        ".section-heading, " +
        ".intro-detail, " +
        ".technology-card, " +
        ".presence-card, " +
        ".network-legend, " +
        ".network-footer, " +
        ".contact-inner"
    );


    if (
        !reduceMotion &&
        "IntersectionObserver" in window
    ) {

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
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
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
       08. WEBSITE READY
    ===================================================== */

    body.classList.add("js-ready");

});
