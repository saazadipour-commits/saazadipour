/* =========================================================
   AZADIPOUR — FLAT WORLD NETWORK
   SVG route animation and map initialization
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  "use strict";

  const map = document.querySelector(".world-map-container");
  const mapImage = document.querySelector(".world-map-image");
  const route = document.querySelector(".network-route-light");
  const loading = document.querySelector(".map-loading");

  if (!map || !mapImage) {
    console.warn("Azadipour world map element was not found.");
    return;
  }

  // Show map after image loads
  function mapReady() {
    map.classList.add("map-ready");

    if (loading) {
      loading.classList.add("is-hidden");
    }
  }

  if (mapImage.complete && mapImage.naturalWidth > 0) {
    mapReady();
  } else {
    mapImage.addEventListener("load", mapReady, { once: true });

    mapImage.addEventListener("error", function () {
      console.error(
        "World map image not found. Check assets/world-network-map.jpg"
      );

      map.classList.add("map-image-error");

      if (loading) {
        loading.textContent = "WORLD MAP IMAGE NOT FOUND";
      }
    }, { once: true });
  }

  // Animate the Oman–Beijing route
  if (route) {
    route.style.animationPlayState =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "paused"
        : "running";
  }

  // Ensure SVG overlay follows the image dimensions
  function updateMapSize() {
    const overlay = map.querySelector(".world-network-overlay");

    if (!overlay) return;

    overlay.setAttribute("preserveAspectRatio", "none");
  }

  updateMapSize();

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateMapSize);
    resizeObserver.observe(map);
  } else {
    window.addEventListener("resize", updateMapSize);
  }

});
