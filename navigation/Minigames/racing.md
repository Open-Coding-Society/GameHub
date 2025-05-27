---
layout: bootstrap
title: Racing 
description: Racing Game 
permalink: /racing
Author: Zach & Ian
---

<style>
  body {
    background: #0d1117;
    color: #c9d1d9;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  }
  .racing-container {
    max-width: 900px;
    margin: 40px auto;
    background: #161b22;
    border-radius: 18px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
    padding: 32px 0 40px 0;
    border: 1px solid #21262d;
  }
  h1, h2, h3 {
    color: #58a6ff;
    text-align: center;
    letter-spacing: 0.02em;
  }
  canvas {
    border: 2px solid #30363d;
    display: block;
    margin: 32px auto 0 auto;
    background: #000;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(20,20,20,0.18);
    max-width: 100%;
  }
  .hud {
    text-align: center;
    margin-top: 18px;
    color: #c9d1d9;
    font-size: 1.1rem;
    letter-spacing: 0.01em;
  }
  .win-screen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(13,17,23,0.96);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .win-screen h2 {
    color: #58a6ff;
    font-size: 2.5rem;
    margin-bottom: 18px;
  }
  .win-screen button {
    background: #238636;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 32px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-top: 18px;
    transition: background 0.2s;
  }
  .win-screen button:hover {
    background: #2ea043;
  }
</style>

<div class="racing-container">
  <h1>Racing Game</h1>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <div class="hud" id="hud"></div>
</div>
<div id="winScreen" class="win-screen" style="display:none;">
  <h2>🏁 You Win! 🏁</h2>
  <p>Congratulations! You finished all 3 laps.</p>
  <button onclick="restartGame()">Restart</button>
</div>

<script>
// --- Track Definition ---
const track = [
  // Outer rectangle (barriers)
  {x: 100, y: 100}, {x: 700, y: 100}, {x: 700, y: 500}, {x: 100, y: 500}, {x: 100, y: 100},
  // Inner rectangle (track inside)
  {x: 200, y: 200}, {x: 600, y: 200}, {x: 600, y: 400}, {x: 200, y: 400}, {x: 200, y: 200}
];

// Centerline path for cars to follow (simplified as a list of waypoints)
const path = [
  {x: 150, y: 300}, {x: 400, y: 120}, {x: 650, y: 300}, {x: 400, y: 480}, {x: 150, y: 300}
];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  pos: 0, // index on path
  t: 0,   // progress between path points (0-1)
  lap: 1,
  item: null,
  stunned: 0,
  boost: 0,
  color: "#ff5e57"
};

let npcs = [
  { pos: 0, t: 0, lap: 1, stunned: 0, color: "#58a6ff" },
  { pos: 0, t: 0, lap: 1, stunned: 0, color: "#2ea043" },
  { pos: 0, t: 0, lap: 1, stunned: 0, color: "#f1e05a" }
];

let keys = {};
let lapMessage = "";
let gameEnded = false;

// Item logic
const items = ["shell", "mushroom"];
function useItem() {
  if (!player.item) return;

  if (player.item === "shell") {
    const closest = npcs.reduce((prev, curr) =>
      (npcDistance(player, curr) < npcDistance(player, prev) ? curr : prev)
    );
    closest.stunned = 120;
  } else if (player.item === "mushroom") {
    player.boost = 600;
  }
  player.item = null;
}

function npcDistance(a, b) {
  // Compare path progress
  return Math.abs((a.lap * path.length + a.pos + a.t) - (b.lap * path.length + b.pos + b.t));
}

// Controls
document.addEventListener("keydown", (e) => {
  if (gameEnded) return;
  keys[e.key] = true;
  if (e.key === " ") useItem();
});
document.addEventListener("keyup", (e) => {
  if (gameEnded) return;
  keys[e.key] = false;
});

// Move along path
function moveCar(car, isPlayer = false) {
  if (car.stunned > 0) {
    car.stunned--;
    return;
  }
  let speed = isPlayer ? 0.012 : 0.009;
  if (car.boost > 0) {
    speed *= 2;
    car.boost--;
  }
  // Player controls: accelerate/decelerate
  if (isPlayer) {
    if (keys["w"]) car.t += speed;
    if (keys["s"]) car.t -= speed / 2;
    if (car.t < 0) {
      if (car.pos > 0) {
        car.pos--;
        car.t = 1 + car.t;
      } else {
        car.t = 0;
      }
    }
    if (car.t > 1) {
      car.pos++;
      car.t = car.t - 1;
    }
  } else {
    car.t += speed;
    if (car.t > 1) {
      car.pos++;
      car.t = car.t - 1;
    }
  }
  // Lap logic
  if (car.pos >= path.length - 1) {
    car.pos = 0;
    car.t = 0;
    car.lap++;
    if (isPlayer && car.lap <= 3) {
      lapMessage = car.lap === 3 ? "Final Lap!" : `Lap ${car.lap}`;
      setTimeout(() => lapMessage = "", 3000);
    }
  }
}

// Get car position on track
function getCarXY(car) {
  const p1 = path[car.pos];
  const p2 = path[(car.pos + 1) % path.length];
  return {
    x: p1.x + (p2.x - p1.x) * car.t,
    y: p1.y + (p2.y - p1.y) * car.t
  };
}

// Draw track and barriers
function drawTrack() {
  // Outer barrier
  ctx.save();
  ctx.strokeStyle = "#30363d";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(track[0].x, track[0].y);
  for (let i = 1; i < 5; i++) ctx.lineTo(track[i].x, track[i].y);
  ctx.stroke();
  ctx.restore();

  // Inner barrier
  ctx.save();
  ctx.strokeStyle = "#30363d";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(track[5].x, track[5].y);
  for (let i = 6; i < 10; i++) ctx.lineTo(track[i].x, track[i].y);
  ctx.stroke();
  ctx.restore();

  // Track surface
  ctx.save();
  ctx.strokeStyle = "#21262d";
  ctx.lineWidth = 80;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
  ctx.stroke();
  ctx.restore();
}

// Draw car
function drawCar(car) {
  const {x, y} = getCarXY(car);
  ctx.save();
  ctx.shadowColor = car.color;
  ctx.shadowBlur = 8;
  ctx.fillStyle = car.color;
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Draw HUD
function drawHUD() {
  const hud = document.getElementById("hud");
  let html = `<strong>Lap:</strong> ${Math.min(player.lap,3)}/3`;
  if (player.item && !gameEnded) html += ` &nbsp; <strong>Item:</strong> ${player.item}`;
  if (lapMessage) html += `<br><span style="color:#58a6ff;font-weight:bold">${lapMessage}</span>`;
  hud.innerHTML = html;
}

// Main game loop
function gameLoop() {
  if (gameEnded) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrack();

  moveCar(player, true);
  npcs.forEach(npc => moveCar(npc));

  drawCar(player);
  npcs.forEach(drawCar);

  drawHUD();

  // End game after 3 laps
  if (player.lap > 3) {
    endGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Item pickup every 5 seconds randomly
let itemInterval = setInterval(() => {
  if (!player.item && !gameEnded) player.item = items[Math.floor(Math.random() * items.length)];
}, 5000);

function endGame() {
  gameEnded = true;
  document.getElementById("winScreen").style.display = "flex";
}

function restartGame() {
  // Reset all game state
  player = {
    pos: 0,
    t: 0,
    lap: 1,
    item: null,
    stunned: 0,
    boost: 0,
    color: "#ff5e57"
  };
  npcs = [
    { pos: 0, t: 0, lap: 1, stunned: 0, color: "#58a6ff" },
    { pos: 0, t: 0, lap: 1, stunned: 0, color: "#2ea043" },
    { pos: 0, t: 0, lap: 1, stunned: 0, color: "#f1e05a" }
  ];
  keys = {};
  lapMessage = "";
  gameEnded = false;
  document.getElementById("winScreen").style.display = "none";
  gameLoop();
}

gameLoop();
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/29rainbowroad.mp3');
music.loop = true;
music.volume = 0.5;

// Play music after first user interaction (required by browsers)
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>

