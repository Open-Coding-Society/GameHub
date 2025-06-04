---
layout: bootstrap
title: Road
description: Road Game
permalink: /road
Author: Ian
---

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/18moonviewhighway.mp3');
music.loop = true;
music.volume = 0.5;

function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>

<style>
  body {
    margin: 0;
    background: #7ec850;
    font-family: Arial, sans-serif;
    user-select: none;
  }
  #gameCanvas {
    background: #a0d468;
    display: block;
    margin: auto;
    border: 4px solid #555;
  }
  .menu {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    background: white;
    border: 3px solid #444;
    padding: 20px;
    text-align: center;
    font-size: 1.5rem;
    z-index: 10;
    width: 300px;
    border-radius: 10px;
  }
  .hidden {
    display: none;
  }
</style>

<div id="startMenu" class="menu">
  <div>🚗 Crossy Clone - Randomized Infinite Map</div>
  <button id="startBtn">Start Game</button>
  <div style="font-size: 1rem; margin-top: 1rem;">
    Use WASD to move. Avoid cars & trains!<br>
    The screen follows your frog as you climb infinitely.
  </div>
</div>

<div id="gameOverMenu" class="menu hidden">
  <div>💥 Game Over!</div>
  <div id="finalScore"></div>
  <button id="gameOverBackBtn">Back to Menu</button>
</div>

<canvas id="gameCanvas" width="800" height="600"></canvas>

<script>
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 40;
  const cols = Math.floor(canvas.width / tileSize);
  const rowsVisible = Math.floor(canvas.height / tileSize);

  const playerEmoji = "🐸";
  const carEmoji = "🚗";
  const trainEmoji = "🚂";

  let player = { x: Math.floor(cols / 2), y: 0 };
  let cameraY = 0;
  let lanes = new Map();

  let gameActive = false;
  let score = 0;

  const startMenu = document.getElementById("startMenu");
  const gameOverMenu = document.getElementById("gameOverMenu");
  const startBtn = document.getElementById("startBtn");
  const gameOverBackBtn = document.getElementById("gameOverBackBtn");
  const finalScore = document.getElementById("finalScore");

function generateLaneObstaclesRandom(laneY) {
  const obstacles = [];

  // Prevent any obstacles from spawning in the player's spawn lane
  if (laneY === 1) return obstacles;

  let rand = Math.random();
  let type;
  if (laneY % 7 === 0) {
    type = "train";
  } else if (rand < 0.35) {
    type = "car";
  } else {
    type = "grass";
  }

  if (type === "grass") return obstacles;

  const direction = Math.random() < 0.5 ? 1 : -1;
  const speed = type === "train" ? 0.5 + Math.random() * 0.3 : 0.7 + Math.random() * 1.0;
  const length = type === "train" ? 3 : 1;
  const numObs = type === "train" ? 1 : Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numObs; i++) {
    const x = Math.floor(Math.random() * cols);
    obstacles.push({ x, type, length, speed, direction, offset: 0 });
  }
  return obstacles;
}


  function updateLanes() {
    const minLane = Math.floor(player.y) - 10;
    const maxLane = Math.floor(player.y) + 10;
    for (let lane = minLane; lane <= maxLane; lane++) {
      if (!lanes.has(lane)) {
        lanes.set(lane, generateLaneObstaclesRandom(lane));
      }
    }
  }

  function drawBackground() {
    const startLane = Math.floor(cameraY) - Math.floor(rowsVisible / 2);
    for (let y = 0; y <= rowsVisible; y++) {
      const laneNum = startLane + y;
      let color;
      if (laneNum % 7 === 0) color = "#5a2e0a";
      else if (laneNum % 2 === 1) color = "#656d78";
      else color = "#a0d468";

      ctx.fillStyle = color;
      ctx.fillRect(0, y * tileSize, canvas.width, tileSize);

      if (laneNum % 2 === 1) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        for (let i = 0; i < cols; i += 2) {
          ctx.beginPath();
          ctx.moveTo(i * tileSize + tileSize / 2, y * tileSize);
          ctx.lineTo(i * tileSize + tileSize / 2, y * tileSize + tileSize);
          ctx.stroke();
        }
      }

      if (laneNum % 7 === 0) {
        ctx.strokeStyle = "silver";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, y * tileSize + tileSize / 3);
        ctx.lineTo(canvas.width, y * tileSize + tileSize / 3);
        ctx.moveTo(0, y * tileSize + 2 * tileSize / 3);
        ctx.lineTo(canvas.width, y * tileSize + 2 * tileSize / 3);
        ctx.stroke();

        ctx.lineWidth = 2;
        for (let x = 0; x < cols; x++) {
          ctx.beginPath();
          ctx.moveTo(x * tileSize, y * tileSize + tileSize / 4);
          ctx.lineTo(x * tileSize, y * tileSize + 3 * tileSize / 4);
          ctx.stroke();
        }
      }
    }
  }

  function drawObstacles() {
    const startLane = Math.floor(cameraY) - Math.floor(rowsVisible / 2);
    for (let y = 0; y <= rowsVisible; y++) {
      const laneNum = startLane + y;
      const laneObs = lanes.get(laneNum) || [];
      for (const obs of laneObs) {
        let xPos = obs.x + obs.offset;
        while (xPos < 0) xPos += cols;
        while (xPos >= cols) xPos -= cols;

        for (let part = 0; part < obs.length; part++) {
          const drawX = ((xPos + part) % cols) * tileSize + tileSize / 2;
          const drawY = y * tileSize + tileSize / 2;
          ctx.font = `${tileSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obs.type === "train" ? trainEmoji : carEmoji, drawX, drawY);
        }
      }
    }
  }

  function drawPlayer() {
    const centerY = canvas.height / 2;
    const drawX = player.x * tileSize + tileSize / 2;
    const drawY = centerY;

    ctx.font = `${tileSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(playerEmoji, drawX, drawY);
  }

  function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${Math.floor(score)}`, 80, 20);
  }

  function updateObstacles() {
    lanes.forEach((obstacles) => {
      for (const obs of obstacles) {
        obs.offset += obs.speed * obs.direction * 0.05;
        if (obs.offset > cols) obs.offset -= cols;
        if (obs.offset < -cols) obs.offset += cols;

        if (obs.offset >= 1) {
          obs.x = (obs.x + 1) % cols;
          obs.offset -= 1;
        } else if (obs.offset <= -1) {
          obs.x = (obs.x - 1 + cols) % cols;
          obs.offset += 1;
        }
      }
    });
  }

  function checkCollision() {
    const playerLane = Math.floor(player.y);
    const laneObs = lanes.get(playerLane) || [];
    for (const obs of laneObs) {
      let obsX = obs.x + obs.offset;
      while (obsX < 0) obsX += cols;
      while (obsX >= cols) obsX -= cols;

      for (let part = 0; part < obs.length; part++) {
        let partX = (obsX + part) % cols;
        if (Math.floor(player.x) === Math.floor(partX) && Math.floor(player.y) === playerLane) {
          return true;
        }
      }
    }
    return false;
  }

  function gameLoop() {
    if (!gameActive) {
      requestAnimationFrame(gameLoop);
      return;
    }

    updateObstacles();
    cameraY = player.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawObstacles();
    drawPlayer();
    drawScore();

    if (checkCollision()) {
      endGame();
      return;
    }

    updateLanes();
    requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameActive = false;
    finalScore.textContent = `Score: ${Math.floor(score)}`;
    gameOverMenu.classList.remove("hidden");
  }

  function startGame() {
    lanes.clear();
    updateLanes();

    let safeSpawn = false;
    while (!safeSpawn) {
      player = { x: Math.floor(cols / 2), y: 1 };
      const playerLaneObs = lanes.get(player.y) || [];
      safeSpawn = playerLaneObs.length === 0;
    }

    cameraY = 0;
    score = 0;
    gameActive = true;
    startMenu.classList.add("hidden");
    gameOverMenu.classList.add("hidden");
    gameLoop();
  }

  window.addEventListener("keydown", (e) => {
    if (!gameActive) return;

    if (e.key === "w" || e.key === "ArrowUp") {
      player.y -= 1;
      score = Math.max(score, -player.y);
    } else if (e.key === "s" || e.key === "ArrowDown") {
      if (player.y < 0) player.y += 1;
    } else if (e.key === "a" || e.key === "ArrowLeft") {
      if (player.x > 0) player.x -= 1;
    } else if (e.key === "d" || e.key === "ArrowRight") {
      if (player.x < cols - 1) player.x += 1;
    }
  });

  startBtn.addEventListener("click", startGame);
  gameOverBackBtn.addEventListener("click", () => {
    gameOverMenu.classList.add("hidden");
    startMenu.classList.remove("hidden");
  });
</script>
