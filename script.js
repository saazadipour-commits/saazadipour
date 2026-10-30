/* =========================================================
   AZADIPOUR — MAIN WEBSITE JAVASCRIPT
   Navigation / Intro / Responsive / Accessibility
   ========================================================= */

(() => {
    "use strict";

    const SELECTORS = {
        intro: "#introScreen",
        menu: "#menuToggle",
        navigation: "#mainNavigation",
        year: "#currentYear"
    };

    const intro = document.querySelector(SELECTORS.intro);
    const menu = document.querySelector(SELECTORS.menu);
    const navigation = document.querySelector(SELECTORS.navigation);
    const year = document.querySelector(SELECTORS.year);

    /* -----------------------------------------
       01 — INTRO ANIMATION
    ----------------------------------------- */

    function hideIntro() {

        if (!intro) return;

        intro.classList.add("hide");

        window.setTimeout(() => {
            intro.style.display = "none";
        }, 900);
    }

    if (intro) {

        const alreadyVisited =
            sessionStorage.getItem("azadipour_intro_seen");

        if (alreadyVisited) {

            intro.style.display = "none";

        } else {

            window.addEventListener("load", () => {

                window.setTimeout(() => {

                    hideIntro();

                    sessionStorage.setItem(
                        "azadipour_intro_seen",
                        "true"
                    );

                }, 1100);

            }, { once: true });

        }
    }


    /* -----------------------------------------
       02 — MOBILE NAVIGATION
    ----------------------------------------- */

    function openMenu() {

        if (!menu || !navigation) return;

        navigation.classList.add("open");

        menu.classList.add("active");

        menu.setAttribute(
            "aria-expanded",
            "true"
        );

        menu.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        document.body.classList.add("menu-open");
    }

    function closeMenu() {

        if (!menu || !navigation) return;

        navigation.classList.remove("open");

        menu.classList.remove("active");

        menu.setAttribute(
            "aria-expanded",
            "false"
        );

        menu.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("menu-open");
    }

    if (menu && navigation) {

        menu.addEventListener("click", () => {

            const isOpen =
                navigation.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        document.addEventListener("click", event => {

            const clickedInside =
                navigation.contains(event.target) ||
                menu.contains(event.target);

            if (!clickedInside) {
                closeMenu();
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 1050) {
                closeMenu();
            }

        });

    }


    /* -----------------------------------------
       03 — CURRENT YEAR
    ----------------------------------------- */

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* -----------------------------------------
       04 — ACTIVE NAVIGATION
    ----------------------------------------- */

    const currentPage = (
        window.location.pathname.split("/").pop() ||
        "index.html"
    ).toLowerCase();

    if (navigation) {

        navigation.querySelectorAll("a").forEach(link => {

            const href = (
                link.getAttribute("href") || ""
            ).toLowerCase();

            if (href === currentPage) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.classList.remove("active");

                link.removeAttribute("aria-current");

            }

        });

    }


    /* -----------------------------------------
       05 — SMOOTH INTERNAL NAVIGATION
    ----------------------------------------- */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            closeMenu();

        });

    });


    /* -----------------------------------------
       06 — HEADER SCROLL EFFECT
    ----------------------------------------- */

    const header = document.querySelector(".site-header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* -----------------------------------------
       07 — ACCESSIBILITY
    ----------------------------------------- */

    if (menu) {

        menu.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                menu.click();

            }

        });

    }


    /* -----------------------------------------
       08 — NETWORK EVENT LISTENER
    ----------------------------------------- */

    document.addEventListener(
        "azadipour:location-selected",
        event => {

            const location = event.detail;

            if (!location) return;

            console.info(
                "Azadipour network location selected:",
                location.name
            );

        }
    );


    /* -----------------------------------------
       09 — INITIALIZATION
    ----------------------------------------- */

    document.documentElement.classList.add(
        "azadipour-ready"
    );

    console.info(
        "AZADIPOUR WEBSITE INITIALIZED"
    );

})();
