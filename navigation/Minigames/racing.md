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
  .win-screen, .start-menu {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(13,17,23,0.96);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .win-screen h2, .start-menu h2 {
    color: #58a6ff;
    font-size: 2.5rem;
    margin-bottom: 18px;
  }
  .win-screen button, .start-menu button {
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
  .win-screen button:hover, .start-menu button:hover {
    background: #2ea043;
  }
  .start-menu .card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 16px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    padding: 32px 40px;
    text-align: center;
    max-width: 400px;
  }
  .start-menu ul {
    text-align: left;
    margin: 18px 0 0 0;
    color: #c9d1d9;
    font-size: 1rem;
  }
  .timer {
    color: #f1e05a;
    font-size: 1.2rem;
    margin-top: 8px;
    text-align: center;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    letter-spacing: 0.03em;
  }
</style>

<div class="racing-container" id="gameContainer" style="display:none;">
  <h1>Racing Game</h1>
  <div class="timer" id="timer"></div>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <div class="hud" id="hud"></div>
</div>

<div id="startMenu" class="start-menu">
  <div class="card">
    <h2>🏎️ Racing Game</h2>
    <p>Race against 3 computer opponents!<br>
      Complete 3 laps and use items to win.</p>
    <ul>
      <li><strong>W</strong> - Accelerate</li>
      <li><strong>S</strong> - Brake/Reverse (use to avoid obstacles!)</li>
      <li><strong>Space</strong> - Use Item</li>
    </ul>
    <button id="startBtn" class="btn btn-success mt-3">Start Race</button>
  </div>
</div>

<div id="winScreen" class="win-screen" style="display:none;">
  <h2>🏁 You Win! 🏁</h2>
  <p>Congratulations! You finished all 3 laps.</p>
  <div class="timer" id="finalTime"></div>
  <button onclick="returnToMenu()">Return to Menu</button>
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

// --- Timed Obstacles ---
const obstacles = [
  // Each obstacle is {pos: index on path, t: progress (0-1), active: true/false, timer: ms}
  {pos: 0, t: 0.5, active: false, timer: 0, period: 3000, duration: 1200},
  {pos: 2, t: 0.5, active: false, timer: 0, period: 4000, duration: 1500},
  {pos: 3, t: 0.2, active: false, timer: 0, period: 5000, duration: 1800}
];

// Helper to get obstacle XY
function getObstacleXY(ob) {
  const p1 = path[ob.pos];
  const p2 = path[(ob.pos + 1) % path.length];
  return {
    x: p1.x + (p2.x - p1.x) * ob.t,
    y: p1.y + (p2.y - p1.y) * ob.t
  };
}

// Update obstacle timers and toggle active state
function updateObstacles(dt) {
  for (const ob of obstacles) {
    ob.timer += dt;
    if (!ob.active && ob.timer >= ob.period) {
      ob.active = true;
      ob.timer = 0;
    } else if (ob.active && ob.timer >= ob.duration) {
      ob.active = false;
      ob.timer = 0;
    }
  }
}

// Draw obstacles
function drawObstacles() {
  for (const ob of obstacles) {
    const {x, y} = getObstacleXY(ob);
    ctx.save();
    ctx.globalAlpha = ob.active ? 1 : 0.3;
    ctx.fillStyle = ob.active ? "#ffbe00" : "#555";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();
  }
}

// Check if car collides with any active obstacle
function checkObstacleCollision(car) {
  for (const ob of obstacles) {
    if (!ob.active) continue;
    const carXY = getCarXY(car);
    const obXY = getObstacleXY(ob);
    const dx = carXY.x - obXY.x, dy = carXY.y - obXY.y;
    if (dx*dx + dy*dy < 30*30) {
      return true;
    }
  }
  return false;
}

let canvas, ctx;
let player, npcs, keys, lapMessage, gameEnded, itemInterval;
let timerStart = null;
let timerInterval = null;
let elapsedMs = 0;
let lastFrameTime = null;

function resetGameState() {
  player = {
    pos: 0, // index on path
    t: 0,   // progress between path points (0-1)
    lap: 1,
    item: null,
    stunned: 0,
    boost: 0,
    color: "#ff5e57",
    obstaclePenalty: 0
  };
  npcs = [
    { pos: 1, t: 0.2, lap: 1, stunned: 0, color: "#58a6ff", speed: 0.0085, obstaclePenalty: 0 },
    { pos: 2, t: 0.5, lap: 1, stunned: 0, color: "#2ea043", speed: 0.0075, obstaclePenalty: 0 },
    { pos: 3, t: 0.7, lap: 1, stunned: 0, color: "#f1e05a", speed: 0.009, obstaclePenalty: 0 }
  ];
  keys = {};
  lapMessage = "";
  gameEnded = false;
  timerStart = null;
  elapsedMs = 0;
  lastFrameTime = null;
  for (const ob of obstacles) {
    ob.active = false;
    ob.timer = Math.random() * ob.period; // randomize initial timers
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}

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
  if (gameEnded || document.getElementById("gameContainer").style.display === "none") return;
  keys[e.key.toLowerCase()] = true;
  if (e.key === " ") useItem();
});
document.addEventListener("keyup", (e) => {
  if (gameEnded || document.getElementById("gameContainer").style.display === "none") return;
  keys[e.key.toLowerCase()] = false;
});

// Move along path
function moveCar(car, isPlayer = false) {
  if (car.stunned > 0) {
    car.stunned--;
    return;
  }
  if (car.obstaclePenalty > 0) {
    car.obstaclePenalty--;
    return;
  }
  let speed = isPlayer ? 0.012 : (car.speed || 0.009);
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
    // NPCs always move forward
    car.t += speed;
    if (car.t > 1) {
      car.pos++;
      car.t = car.t - 1;
    }
  }
  // Lap logic for both player and NPCs
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
  if (!gameEnded) html += `<br><span style="color:#ffbe00">Avoid obstacles! Brake (<b>S</b>) to stop in time.</span>`;
  hud.innerHTML = html;
}

// Draw Timer
function drawTimer() {
  const timerDiv = document.getElementById("timer");
  if (!timerDiv) return;
  let ms = elapsedMs;
  if (!gameEnded && timerStart !== null) {
    ms = Date.now() - timerStart;
    elapsedMs = ms;
  }
  timerDiv.textContent = `Time: ${formatTime(ms)}`;
}

// Main game loop
let animationFrameId;
function gameLoop(now) {
  if (gameEnded) return;
  if (!lastFrameTime) lastFrameTime = now;
  const dt = now - lastFrameTime;
  lastFrameTime = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrack();
  updateObstacles(dt);
  drawObstacles();

  moveCar(player, true);
  npcs.forEach(npc => moveCar(npc));

  // Obstacle collision for player
  if (checkObstacleCollision(player)) {
    // If braking, avoid penalty
    if (!keys["s"] && player.obstaclePenalty === 0) {
      player.obstaclePenalty = 60; // 1 second penalty (60 frames)
      lapMessage = "Hit obstacle! Brake to avoid!";
      setTimeout(() => { if (lapMessage === "Hit obstacle! Brake to avoid!") lapMessage = ""; }, 2000);
    }
  }

  // Obstacle collision for NPCs (random chance to avoid)
  for (const npc of npcs) {
    if (checkObstacleCollision(npc) && npc.obstaclePenalty === 0) {
      if (Math.random() < 0.7) { // 70% chance to get penalized
        npc.obstaclePenalty = 60;
      }
    }
  }

  drawCar(player);
  npcs.forEach(drawCar);

  drawHUD();
  drawTimer();

  // End game after 3 laps
  if (player.lap > 3) {
    endGame();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

// Item pickup every 5 seconds randomly
function startItemInterval() {
  itemInterval = setInterval(() => {
    if (!player.item && !gameEnded) player.item = items[Math.floor(Math.random() * items.length)];
  }, 5000);
}
function stopItemInterval() {
  if (itemInterval) clearInterval(itemInterval);
  itemInterval = null;
}

// Timer interval for updating timer display
function startTimerInterval() {
  timerInterval = setInterval(drawTimer, 100);
}
function stopTimerInterval() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function endGame() {
  gameEnded = true;
  stopItemInterval();
  stopTimerInterval();
  // Show final time on win screen
  document.getElementById("finalTime").textContent = `Final Time: ${formatTime(elapsedMs)}`;
  document.getElementById("winScreen").style.display = "flex";
}

function startGame() {
  resetGameState();
  document.getElementById("startMenu").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  stopItemInterval();
  stopTimerInterval();
  timerStart = Date.now();
  elapsedMs = 0;
  lastFrameTime = null;
  startItemInterval();
  startTimerInterval();
  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(gameLoop);
}

function returnToMenu() {
  stopItemInterval();
  stopTimerInterval();
  cancelAnimationFrame(animationFrameId);
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("startMenu").style.display = "flex";
  resetGameState();
  drawTimer();
}

document.getElementById("startBtn").onclick = startGame;

// On page load, show start menu, hide game/win screens
window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  resetGameState();

  document.getElementById("startMenu").style.display = "flex";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  stopItemInterval();
  stopTimerInterval();
  drawTimer();

  document.getElementById("startBtn").onclick = startGame;
};
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

