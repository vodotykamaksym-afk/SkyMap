const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeStars() {
  stars.length = 0;
  const count = Math.min(180, Math.floor((canvas.width * canvas.height) / 14000));
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.02 + 0.004,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    star.a += star.s;
    const alpha = 0.25 + Math.abs(Math.sin(star.a)) * 0.75;
    ctx.beginPath();
    ctx.fillStyle = `rgba(235, 243, 255, ${alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resize();
makeStars();
drawStars();
window.addEventListener("resize", () => {
  resize();
  makeStars();
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

const constellations = {
  dipper: {
    kicker: "Wielka Niedźwiedzica",
    title: "Wielki Wóz",
    copy: "Siedem jasnych gwiazd układa się w wóz na północnym niebie. Dwie gwiazdy na krawędzi skrzyni wskazują Gwiazdę Polarną.",
    tip: "Najlepszy pierwszy kształt dla początkujących. Jeśli znajdziesz wóz, znajdziesz północ.",
  },
  cassiopeia: {
    kicker: "Królowa",
    title: "Kasjopea",
    copy: "Pięć gwiazd tworzy jasne W (albo M, zależnie od pory roku). W micie greckim Kasjopea była królową umieszczoną na niebie jako gwiazdozbiór.",
    tip: "Patrz naprzeciw Wielkiego Wozu. Gdy jeden jest wysoko, drugi często jest blisko.",
  },
  orion: {
    kicker: "Myśliwy",
    title: "Orion",
    copy: "Trzy gwiazdy w krótkiej, prostej linii tworzą pas Oriona. Wokół nich możesz wyobrazić sobie ramiona i kolana myśliwego. Zimą to jeden z najłatwiejszych wzorów na Ziemi.",
    tip: "Najpierw znajdź trzy w rzędzie. Nazwy mogą poczekać.",
  },
};

const starData = [
  { id: "dipper", x: 90, y: 120, group: "dipper" },
  { id: "dipper", x: 130, y: 108, group: "dipper" },
  { id: "dipper", x: 168, y: 118, group: "dipper" },
  { id: "dipper", x: 205, y: 132, group: "dipper" },
  { id: "dipper", x: 218, y: 178, group: "dipper" },
  { id: "dipper", x: 268, y: 170, group: "dipper" },
  { id: "dipper", x: 255, y: 122, group: "dipper" },
  { id: "cassiopeia", x: 390, y: 88, group: "cassiopeia" },
  { id: "cassiopeia", x: 430, y: 118, group: "cassiopeia" },
  { id: "cassiopeia", x: 470, y: 92, group: "cassiopeia" },
  { id: "cassiopeia", x: 512, y: 128, group: "cassiopeia" },
  { id: "cassiopeia", x: 548, y: 96, group: "cassiopeia" },
  { id: "orion", x: 340, y: 250, group: "orion" },
  { id: "orion", x: 410, y: 240, group: "orion" },
  { id: "orion", x: 360, y: 300, group: "orion" },
  { id: "orion", x: 390, y: 308, group: "orion" },
  { id: "orion", x: 420, y: 300, group: "orion" },
  { id: "orion", x: 350, y: 360, group: "orion" },
  { id: "orion", x: 430, y: 355, group: "orion" },
];

const lineSets = {
  dipper: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 3],
  ],
  cassiopeia: [
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
  ],
  orion: [
    [12, 13],
    [12, 14],
    [13, 16],
    [14, 15],
    [15, 16],
    [14, 17],
    [16, 18],
  ],
};

const linesGroup = document.getElementById("lines");
const starsGroup = document.getElementById("stars");

starData.forEach((star, index) => {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", star.x);
  circle.setAttribute("cy", star.y);
  circle.setAttribute("r", 9);
  circle.setAttribute("fill", "url(#starGlow)");
  circle.classList.add("star");
  circle.dataset.group = star.group;
  circle.dataset.index = String(index);
  circle.addEventListener("click", () => selectGroup(star.group));
  starsGroup.appendChild(circle);
});

Object.entries(lineSets).forEach(([group, pairs]) => {
  pairs.forEach(([a, b]) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", starData[a].x);
    line.setAttribute("y1", starData[a].y);
    line.setAttribute("x2", starData[b].x);
    line.setAttribute("y2", starData[b].y);
    line.dataset.group = group;
    linesGroup.appendChild(line);
  });
});

function selectGroup(group) {
  document.querySelectorAll(".star").forEach((star) => {
    star.classList.toggle("is-active", star.dataset.group === group);
  });
  document.querySelectorAll("#lines line").forEach((line) => {
    line.style.opacity = line.dataset.group === group ? "1" : "0.25";
    line.style.stroke = line.dataset.group === group ? "#f0d7a3" : "#8aa0d8";
  });
  const info = constellations[group];
  document.getElementById("sky-kicker").textContent = info.kicker;
  document.getElementById("sky-title").textContent = info.title;
  document.getElementById("sky-copy").textContent = info.copy;
  document.getElementById("sky-tip").textContent = info.tip;
  document.querySelectorAll("[data-group]").forEach((button) => {
    if (button.tagName === "BUTTON") {
      button.classList.toggle("is-on", button.dataset.group === group);
    }
  });
}

document.querySelectorAll(".sky-picks button").forEach((button) => {
  button.addEventListener("click", () => selectGroup(button.dataset.group));
});

selectGroup("dipper");
