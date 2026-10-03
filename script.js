document.addEventListener("DOMContentLoaded", function () {

    // Navbar shadow / background on scroll
    const navbar = document.querySelector(".navbar");

    function handleScroll() {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();


    // Mobile menu
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("open");
            menuToggle.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.classList.remove("active");
            });
        });
    }


    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // Reveal animation
    const revealElements = document.querySelectorAll(
        ".reveal, .business-card, .section-title, .about-content, .contact-box"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);

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


    // Current year in footer
    const yearElements = document.querySelectorAll("[data-year]");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    // Active navigation link
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {

        const href = link.getAttribute("href");

        if (!href) return;

        const linkPage = href.split("/").pop().split("#")[0];

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            link.classList.add("active");
        }

    });

});
