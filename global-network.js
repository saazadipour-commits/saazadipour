/* =========================================
   AZADIPOUR GLOBAL NETWORK MAP
   Self-contained static canvas visualization
========================================= */

(() => {
  "use strict";

  const canvas = document.getElementById("globalNetworkMap");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  /*
    Simplified continent outlines.
    Coordinates use longitude and latitude.
    These are illustrative shapes, not navigational boundaries.
  */

  const continents = [
    // North America
    [
      [-168, 70], [-150, 72], [-137, 68], [-130, 60],
      [-125, 52], [-124, 43], [-117, 33], [-108, 29],
      [-103, 22], [-96, 19], [-90, 20], [-84, 25],
      [-80, 31], [-75, 36], [-68, 44], [-60, 51],
      [-57, 58], [-66, 63], [-78, 69], [-95, 73],
      [-115, 75], [-140, 72], [-155, 74]
    ],

    // Greenland
    [
      [-53, 83], [-38, 80], [-30, 73], [-42, 60],
      [-53, 59], [-62, 68], [-60, 77]
    ],

    // South America
    [
      [-81, 12], [-73, 10], [-65, 5], [-58, -3],
      [-50, -8], [-47, -18], [-53, -29], [-58, -39],
      [-66, -55], [-72, -49], [-75, -36], [-78, -20],
      [-81, -5]
    ],

    // Europe and Asia
    [
      [-10, 36], [-10, 44], [-5, 50], [2, 55],
      [10, 58], [18, 55], [27, 60], [36, 65],
      [48, 69], [62, 72], [80, 74], [100, 72],
      [120, 67], [140, 60], [155, 55], [165, 49],
      [155, 43], [145, 40], [135, 35], [130, 30],
      [122, 24], [115, 20], [108, 15], [103, 8],
      [98, 12], [92, 20], [85, 22], [78, 8],
      [73, 8], [69, 20], [61, 25], [56, 27],
      [50, 30], [45, 37], [38, 40], [30, 39],
      [25, 35], [20, 40], [15, 43], [10, 43],
      [5, 42], [0, 40], [-5, 36]
    ],

    // Africa
    [
      [-17, 36], [-5, 37], [10, 36], [24, 32],
      [34, 30], [43, 12], [50, 10], [48, -2],
      [42, -12], [39, -20], [32, -29], [25, -34],
      [18, -35], [12, -25], [8, -15], [2, -5],
      [-5, 5], [-12, 17], [-17, 25]
    ],

    // India
    [
      [68, 24], [77, 30], [87, 26], [90, 21],
      [84, 8], [78, 6], [73, 14]
    ],

    // Japan and nearby islands
    [
      [130, 32], [135, 35], [140, 39], [143, 44],
      [146, 42], [142, 35], [137, 31]
    ],

    // Australia
    [
      [113, -12], [124, -14], [135, -12], [145, -16],
      [153, -25], [150, -38], [141, -40], [130, -35],
      [116, -33], [113, -23]
    ],

    // Madagascar
    [
      [48, -13], [50, -17], [49, -25], [46, -23]
    ],

    // United Kingdom
    [
      [-8, 58], [-4, 59], [0, 55], [-3, 50], [-6, 52]
    ]
  ];

  const oman = {
    name: "OMAN",
    lon: 58.4,
    lat: 23.6
  };

  const markets = [
    { name: "SAUDI ARABIA", lon: 46.7, lat: 24.7 },
    { name: "UAE", lon: 54.4, lat: 24.5 },
    { name: "QATAR", lon: 51.5, lat: 25.3 },
    { name: "BAHRAIN", lon: 50.6, lat: 26.2 },
    { name: "KUWAIT", lon: 47.9, lat: 29.3 },
    { name: "GERMANY", lon: 10.4, lat: 51.1 }
  ];

  /*
    Anonymous illustrative opportunity markers.
    They do not represent confirmed hospitals or clients.
  */

  const opportunities = [
    { lon: 44.4, lat: 33.3 },
    { lon: 46.7, lat: 24.7 },
    { lon: 55.3, lat: 25.2 },
    { lon: 51.5, lat: 25.3 },
    { lon: 10.4, lat: 51.1 },
    { lon: 53.0, lat: 28.0 }
  ];

  function project(lon, lat) {
    const top = 45;
    const bottom = height - 40;

    return {
      x: ((lon + 180) / 360) * width,
      y: top + ((85 - lat) / 145) * (bottom - top)
    };
  }

  function drawBackground() {
    const glow = ctx.createRadialGradient(
      width * .5, height * .5, 10,
      width * .5, height * .5, width * .58
    );

    glow.addColorStop(0, "rgba(115,135,160,.10)");
    glow.addColorStop(1, "rgba(5,8,12,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawGrid() {
    ctx.save();

    ctx.strokeStyle = "rgba(180,195,215,.075)";
    ctx.lineWidth = .6;

    for (let lon = -150; lon <= 180; lon += 30) {
      const a = project(lon, 85);
      const b = project(lon, -60);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    for (let lat = -45; lat <= 75; lat += 30) {
      const a = project(-180, lat);
      const b = project(180, lat);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawContinents() {
    continents.forEach(points => {
      ctx.beginPath();

      points.forEach((point, index) => {
        const p = project(point[0], point[1]);

        if (index === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      });

      ctx.closePath();

      const fill = ctx.createLinearGradient(0, 0, 0, height);
      fill.addColorStop(0, "rgba(200,210,223,.26)");
      fill.addColorStop(1, "rgba(100,115,135,.12)");

      ctx.fillStyle = fill;
      ctx.strokeStyle = "rgba(218,226,238,.44)";
      ctx.lineWidth = .9;

      ctx.fill();
      ctx.stroke();
    });
  }

  function drawConnection(destination) {
    const start = project(oman.lon, oman.lat);
    const end = project(destination.lon, destination.lat);

    const middleX = (start.x + end.x) / 2;
    const middleY = Math.min(start.y, end.y) - Math.min(100, height * .18);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(middleX, middleY, end.x, end.y);

    ctx.strokeStyle = "rgba(215,225,238,.65)";
    ctx.lineWidth = 1.2;
    ctx.shadowColor = "rgba(220,230,245,.8)";
    ctx.shadowBlur = 9;
    ctx.stroke();

    ctx.restore();
  }

  function drawPoint(location, main = false) {
    const p = project(location.lon, location.lat);

    ctx.save();

    ctx.beginPath();
    ctx.arc(p.x, p.y, main ? 12 : 7, 0, Math.PI * 2);
    ctx.fillStyle = main
      ? "rgba(255,255,255,.11)"
      : "rgba(185,200,220,.09)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, main ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = main ? "#ffffff" : "#bdc8d7";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = main ? 20 : 10;
    ctx.fill();

    ctx.restore();
  }

  function drawOpportunity(location) {
    const p = project(location.lon, location.lat);

    ctx.save();

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(115,130,150,.85)";
    ctx.strokeStyle = "rgba(225,232,242,.85)";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawLabels() {
    const p = project(oman.lon, oman.lat);

    ctx.save();
    ctx.font = "600 10px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fillText("OMAN", p.x + 15, p.y - 12);

    ctx.font = "8px Inter, sans-serif";
    ctx.fillStyle = "rgba(220,230,242,.8)";
    ctx.shadowBlur = 0;
    ctx.fillText("REGISTERED BASE", p.x + 15, p.y + 2);

    const germany = project(10.4, 51.1);
    ctx.fillText("GERMANY", germany.x + 10, germany.y - 10);

    ctx.restore();
  }

  function render() {
    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    drawBackground();
    drawGrid();
    drawContinents();

    markets.forEach(drawConnection);

    opportunities.forEach(drawOpportunity);

    drawPoint(oman, true);
    markets.forEach(market => drawPoint(market));

    drawLabels();
  }

  render();

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
  } else {
    window.addEventListener("resize", render);
  }

})();
