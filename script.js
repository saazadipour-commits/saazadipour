
/* AZADIPOUR WEBSITE JAVASCRIPT */

document.addEventListener("DOMContentLoaded", function () {

  // Intro animation
  const intro = document.getElementById("intro");

  if (intro) {
    const delay = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? 200 : 1800;

    window.setTimeout(function () {
      intro.classList.add("hide");
    }, delay);
  }

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Automatic copyright year
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

});
