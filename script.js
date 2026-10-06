/* =========================================================
   AZADIPOUR — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle") ||
        document.querySelector(".nav-toggle");

    const navLinks =
        document.querySelector(".nav-links") ||
        document.querySelector(".main-nav");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen =
                navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );

        });


        /* Close menu after clicking a link */

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

            });

        });


        /* Close menu when clicking outside */

        document.addEventListener("click", function (event) {

            const clickedInsideMenu =
                navLinks.contains(event.target);

            const clickedToggle =
                menuToggle.contains(event.target);

            if (
                !clickedInsideMenu &&
                !clickedToggle &&
                navLinks.classList.contains("active")
            ) {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );
            }

        });

    }


    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document
        .querySelectorAll("[data-year]")
        .forEach(function (element) {

            element.textContent =
                new Date().getFullYear();

        });


    /* =====================================================
       FORM FALLBACK
       ===================================================== */

    const forms =
        document.querySelectorAll("form");

    forms.forEach(function (form) {

        const action =
            form.getAttribute("action") || "";

        if (
            action.includes("YOUR_FORM_ID") ||
            action.trim() === ""
        ) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    const formData =
                        new FormData(form);

                    let body = "";

                    formData.forEach(
                        function (value, key) {

                            body +=
                                key +
                                ": " +
                                value +
                                "\n";

                        }
                    );

                    const subject =
                        encodeURIComponent(
                            "Azadipour Website Inquiry"
                        );

                    const email =
                        "herzchirurgsinaazadipour@gmail.com";

                    const mailto =
                        "mailto:" +
                        email +
                        "?subject=" +
                        subject +
                        "&body=" +
                        encodeURIComponent(body);

                    window.location.href =
                        mailto;
                }
            );
        }

    });

});
