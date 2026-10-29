/* =========================================================
   AZADIPOUR — MAIN JAVASCRIPT
   Navigation / Intro / Footer / Accessibility
   ========================================================= */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* INTRO SCREEN */
        const intro = document.getElementById("intro");

        if (intro) {
            const hideIntro = () => {
                intro.classList.add("hide");
                window.setTimeout(() => {
                    intro.remove();
                }, 900);
            };

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                hideIntro();
            } else {
                window.setTimeout(hideIntro, 1200);
            }
        }

        /* MOBILE NAVIGATION */
        const menuToggle = document.getElementById("menuToggle");
        const mainNav = document.getElementById("mainNav");

        if (menuToggle && mainNav) {
            const closeMenu = () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            };

            menuToggle.addEventListener("click", () => {
                const isOpen = mainNav.classList.toggle("open");

                menuToggle.setAttribute("aria-expanded", String(isOpen));
                menuToggle.setAttribute(
                    "aria-label",
                    isOpen ? "Close navigation menu" : "Open navigation menu"
                );
            });

            mainNav.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", closeMenu);
            });

            document.addEventListener("click", event => {
                if (
                    !mainNav.contains(event.target) &&
                    !menuToggle.contains(event.target)
                ) {
                    closeMenu();
                }
            });

            document.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    closeMenu();
                    menuToggle.focus();
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 1000) {
                    closeMenu();
                }
            });
        }

        /* ACTIVE NAVIGATION */
        const currentPage = (
            window.location.pathname.split("/").pop() || "index.html"
        ).toLowerCase();

        document.querySelectorAll(".main-nav a").forEach(link => {
            const linkPage = (
                link.getAttribute("href") || ""
            ).split("/").pop().toLowerCase();

            if (linkPage === currentPage) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        });

        /* FOOTER YEAR */
        const currentYear = document.getElementById("currentYear");

        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }

        /* SMOOTH INTERNAL LINKS */
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", event => {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                const target = document.querySelector(targetId);

                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches ? "auto" : "smooth",
                        block: "start"
                    });
                }
            });
        });

    });

})();
