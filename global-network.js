/* ==========================================================
   AZADIPOUR — GLOBAL NETWORK MAP
   SVG Map Initialization
   No Globe / No External Map Library
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  "use strict";

  const mapSection = document.getElementById("global-network");
  const map = document.querySelector(".az-world-map");

  if (!mapSection || !map) {
    console.warn("Azadipour global map was not found.");
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Accessibility: pause SVG animation when reduced motion is preferred.
  if (reduceMotion) {
    map.querySelectorAll(
      ".route-moving-light, .marker-pulse"
    ).forEach(function (element) {
      element.style.animation = "none";
    });
  }

  // Make sure the SVG is rendered correctly.
  function refreshMap() {
    map.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  refreshMap();

  // Keep the map responsive.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(refreshMap);
    observer.observe(mapSection);
  } else {
    window.addEventListener("resize", refreshMap);
  }

  // Confirm map initialization.
  mapSection.classList.add("az-map-ready");

  console.info(
    "Azadipour international SVG map initialized successfully."
  );

});
