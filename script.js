/* =========================================================
   SA AZADIPOUR — PREMIUM INTERACTION SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(
    '.navbar nav a[href^="#"]'
  );

  const revealElements = document.querySelectorAll(
    ".section-heading, .content-grid, .card, .network-item, .contact-box"
  );

  const cards = document.querySelectorAll(".card");
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const watermarks = document.querySelectorAll(
    ".watermark, .intro-watermark, .footer-watermark"
  );


  /* =======================================================
     REDUCED MOTION
     ======================================================= */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     PAGE READY
     ======================================================= */

  document.body.classList.add("js-ready");


  /* =======================================================
     NAVBAR
     ======================================================= */

  function updateNavbar() {

    if (!navbar) return;

    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      const isOpen = navLinks.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

    });


    navLinks.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );

      });

    });

  }


  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#" ||
        targetId.length < 2
      ) {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const navbarHeight = navbar
        ? navbar.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: reduceMotion
          ? "auto"
          : "smooth"
      });

    });

  });


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  if (!reduceMotion && "IntersectionObserver" in window) {

    revealElements.forEach(element => {
      element.classList.add("reveal");
    });


    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "reveal-visible"
              );

              revealObserver.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px"
        }
      );


    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("reveal-visible");
    });

  }


  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  if (
    sections.length &&
    navigationLinks.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const id = entry.target.id;

            navigationLinks.forEach(link => {

              const isActive =
                link.getAttribute("href") === `#${id}`;

              link.classList.toggle(
                "active",
                isActive
              );

            });

          });

        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0
        }
      );


    sections.forEach(section => {
      sectionObserver.observe(section);
    });

  }


  /* =======================================================
     HERO PARALLAX
     ======================================================= */

  if (
    hero &&
    heroContent &&
    !reduceMotion &&
    window.innerWidth > 768
  ) {

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        window.requestAnimationFrame(() => {

          const scroll = window.scrollY;

          if (scroll < window.innerHeight) {

            const movement = scroll * 0.08;

            heroContent.style.transform =
              `translate3d(0, ${movement}px, 0)`;

          }

          ticking = false;

        });

        ticking = true;

      },
      { passive: true }
    );

  }


  /* =======================================================
     WATERMARK MOVEMENT
     ======================================================= */

  if (!reduceMotion && watermarks.length) {

    let watermarkTicking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (watermarkTicking) return;

        window.requestAnimationFrame(() => {

          const scrollY = window.scrollY;

          watermarks.forEach((watermark, index) => {

            const direction =
              index % 2 === 0 ? 1 : -1;

            const movement =
              (scrollY * 0.025) * direction;

            watermark.style.transform =
              `translate3d(${movement}px, 0, 0)`;

          });

          watermarkTicking = false;

        });

        watermarkTicking = true;

      },
      { passive: true }
    );

  }


  /* =======================================================
     PREMIUM CARD INTERACTION
     ======================================================= */

  if (!reduceMotion && window.innerWidth > 768) {

    cards.forEach(card => {

      card.addEventListener("mousemove", event => {

        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const rotateX =
          ((y / rect.height) - 0.5) * -4;

        const rotateY =
          ((x / rect.width) - 0.5) * 4;

        card.style.transform =
          `perspective(900px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-8px)`;

      });


      card.addEventListener("mouseleave", () => {

        card.style.transform =
          "";

      });

    });

  }


  /* =======================================================
     BUTTON RIPPLE
     ======================================================= */

  if (!reduceMotion) {

    document.querySelectorAll(
      ".button, .contact-button, .card a"
    ).forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const ripple =
            document.createElement("span");

          ripple.className = "button-ripple";

          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);

        }
      );

    });

  }


  /* =======================================================
     KEYBOARD ACCESSIBILITY
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        if (navLinks) {
          navLinks.classList.remove("open");
        }

        if (menuToggle) {
          menuToggle.classList.remove("active");

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );
        }

        document.body.classList.remove(
          "menu-open"
        );

      }

    }
  );


  /* =======================================================
     PREVENT FLASH AFTER INTRO
     ======================================================= */

  const intro =
    document.querySelector(".intro");

  if (intro) {

    intro.addEventListener(
      "animationend",
      () => {

        intro.style.pointerEvents =
          "none";

      }
    );

  }


  /* =======================================================
     YEAR AUTO UPDATE
     ======================================================= */

  const yearElements =
    document.querySelectorAll(
      "[data-current-year]"
    );

  yearElements.forEach(element => {

    element.textContent =
      new Date().getFullYear();

  });


  /* =======================================================
     PAGE LOADED
     ======================================================= */

  window.setTimeout(() => {

    document.body.classList.add(
      "page-loaded"
    );

  }, reduceMotion ? 0 : 100);


});
