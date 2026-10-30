/* =========================================================
   AZADIPOUR — GLOBAL WEBSITE SCRIPT
   Navigation / Mobile Menu / Intro / Footer Year
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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

        const hideIntro = () => {
            intro.classList.add("hide");

            window.setTimeout(() => {
                intro.style.display = "none";
            }, 900);
        };

        if (sessionStorage.getItem("azadipourIntroShown")) {
            hideIntro();
        } else {
            sessionStorage.setItem("azadipourIntroShown", "true");

            window.setTimeout(() => {
                hideIntro();
            }, reduceMotion ? 100 : 1600);
        }
    }


    /* =====================================================
       02. MOBILE NAVIGATION
    ===================================================== */

    const closeMenu = () => {

        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        body.classList.remove("menu-open");
    };


    const openMenu = () => {

        if (!menuToggle || !mainNav) return;

        mainNav.classList.add("open");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        body.classList.add("menu-open");
    };


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });


        mainNav.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {
                closeMenu();
            });

        });


        document.addEventListener("click", (event) => {

            const clickedInsideMenu = mainNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });


        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {
                closeMenu();
            }

        });

    }


    /* =====================================================
       03. HEADER SCROLL EFFECT
    ===================================================== */

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 35) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       04. CURRENT YEAR
    ===================================================== */

    const currentYear = new Date().getFullYear();

    document.querySelectorAll(
        "#currentYear, [data-year]"
    ).forEach((element) => {

        element.textContent = currentYear;

    });


    /* =====================================================
       05. SMOOTH INTERNAL LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

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
       06. ACTIVE NAVIGATION LINK
    ===================================================== */

    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    document.querySelectorAll(
        ".main-nav a, #mainNav a"
    ).forEach((link) => {

        const linkPage = (
            link.getAttribute("href") || ""
        ).split("/").pop().toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });


    /* =====================================================
       07. REVEAL ANIMATIONS
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section, .section-heading, .intro-detail, .technology-card, .solution-item, .partnership-content"
    );


    if (
        !reduceMotion &&
        "IntersectionObserver" in window
    ) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

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


        revealElements.forEach((element) => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("reveal-visible");
        });

    }


    /* =====================================================
       08. ACCESSIBILITY
    ===================================================== */

    if (menuToggle) {

        menuToggle.addEventListener("keydown", (event) => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
            }

        });

    }

});
