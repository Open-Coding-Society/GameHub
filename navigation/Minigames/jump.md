---
layout: bootstrap
title: Jump 
description: Jump Game 
permalink: /jump
Author: Aarush
---

<style>
  body {
    background: #222;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  #gdashCanvas {
    display: block;
    margin: 40px auto;
    background: linear-gradient(to bottom, #222 60%, #444 100%);
    border: 3px solid #ffd700;
    border-radius: 10px;
    box-shadow: 0 0 18px #ffd70066;
  }
  .gdash-center {
    text-align: center;
    margin-top: 10px;
  }
  .gdash-btn {
    font-size: 1.1em;
    margin: 8px;
    padding: 6px 18px;
    border-radius: 6px;
    border: none;
    background: #ffd700;
    color: #222;
    font-weight: bold;
    cursor: pointer;
  }
</style>

<h1 class="gdash-center">Geometry Dash Mini</h1>
<p class="gdash-center">Press <b>Space</b> or click/tap to jump! Avoid the spikes!</p>
<div class="gdash-center">
  <label for="gdashDifficulty" style="font-size:1.1em;">Difficulty: </label>
  <select id="gdashDifficulty" style="font-size:1.1em;">
    <option value="2">Easy</option>
    <option value="3" selected>Normal</option>
    <option value="4">Hard</option>
  </select>
  <button id="gdashRestart" class="gdash-btn" style="display:none;">Restart</button>
</div>
<canvas id="gdashCanvas" width="900" height="400"></canvas>
<div class="gdash-center" id="gdashScore"></div>

<script>
  const canvas = document.getElementById('gdashCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Difficulty settings (more platforms, lower platforms)
  const difficultySelect = document.getElementById('gdashDifficulty');
  const difficultySettings = {
    1: { spawnRate: 90, minSpike: 32, maxSpike: 40, doubleChance: 0, platformChance: 0.25, topObstacleChance: 0.02, padChance: 0.03, movingPlatformChance: 0.01 },
    2: { spawnRate: 75, minSpike: 32, maxSpike: 48, doubleChance: 0.08, platformChance: 0.35, topObstacleChance: 0.04, padChance: 0.06, movingPlatformChance: 0.02 },
    3: { spawnRate: 60, minSpike: 32, maxSpike: 56, doubleChance: 0.15, platformChance: 0.5, topObstacleChance: 0.07, padChance: 0.10, movingPlatformChance: 0.03 },
    4: { spawnRate: 48, minSpike: 32, maxSpike: 64, doubleChance: 0.22, platformChance: 0.65, topObstacleChance: 0.12, padChance: 0.15, movingPlatformChance: 0.05 },
    5: { spawnRate: 36, minSpike: 32, maxSpike: 72, doubleChance: 0.33, platformChance: 0.8, topObstacleChance: 0.18, padChance: 0.22, movingPlatformChance: 0.08 }
  };

  // Player (fixed jump/gravity, slightly lower jump, slightly faster speed)
  const player = {
    x: 100,
    y: height - 80,
    size: 40,
    velocityY: 0,
    gravity: 1.1,
    jumpPower: -20, // Slightly lower jump
    onGround: true
  };

  let obstacleSpeed = 10; // Slightly increased speed

  // Obstacles and platforms
  let obstacles = [];
  let platforms = [];
  let spawnRate = difficultySettings[3].spawnRate;
  let minSpike = difficultySettings[3].minSpike;
  let maxSpike = difficultySettings[3].maxSpike;
  let doubleChance = difficultySettings[3].doubleChance;
  let platformChance = difficultySettings[3].platformChance;
  let topObstacleChance = difficultySettings[3].topObstacleChance;
  let padChance = difficultySettings[3].padChance;
  let movingPlatformChance = difficultySettings[3].movingPlatformChance;
  let frame = 0;
  let score = 0;
  let bestScore = 0;
  let gameOver = false;
  let started = false;

  // Helper to generate a "chain" of platforms, spread out for jumping
  function generatePlatformChain(startX, startY, count, minGap, maxGap, minY, maxY) {
    const chain = [];
    let lastX = startX;
    let lastY = startY;
    for (let i = 0; i < count; i++) {
      const pfWidth = 80 + Math.random() * 60;
      const pfHeight = 18;
      // Spread out platforms: gap is based on jump distance
      // Player jumpPower and gravity allow about 170-190px horizontal jump at obstacleSpeed=10
      const gap = minGap + Math.random() * (maxGap - minGap); // e.g. 120-180px
      lastX += pfWidth + gap;
      // Next platform Y is close to previous, but random within jumpable range
      lastY += (Math.random() - 0.5) * 40;
      lastY = Math.max(minY, Math.min(maxY, lastY));
      chain.push({
        x: lastX,
        y: lastY,
        width: pfWidth,
        height: pfHeight,
        type: "static",
        vy: 0
      });
    }
    return chain;
  }

  function applyDifficulty() {
    const diff = difficultySelect.value;
    spawnRate = difficultySettings[diff].spawnRate;
    minSpike = difficultySettings[diff].minSpike;
    maxSpike = difficultySettings[diff].maxSpike;
    doubleChance = difficultySettings[diff].doubleChance;
    platformChance = difficultySettings[diff].platformChance;
    topObstacleChance = difficultySettings[diff].topObstacleChance;
    padChance = difficultySettings[diff].padChance;
    movingPlatformChance = difficultySettings[diff].movingPlatformChance;
  }

  difficultySelect.addEventListener('change', () => {
    applyDifficulty();
    resetGame();
    draw();
  });

  function resetGame() {
    player.y = height - 80;
    player.velocityY = 0;
    player.onGround = true;
    obstacles = [];
    platforms = [];
    frame = 0;
    score = 0;
    gameOver = false;
    started = false;
    applyDifficulty();
    document.getElementById('gdashScore').textContent = '';
    document.getElementById('gdashRestart').style.display = 'none';
  }

  function drawPlayer() {
    ctx.save();
    ctx.fillStyle = "#00eaff";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.size, player.size);
    ctx.fill();
    ctx.stroke();
    // Eyes
    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x + 10, player.y + 12, 8, 8);
    ctx.fillRect(player.x + 22, player.y + 12, 8, 8);
    ctx.fillStyle = "#222";
    ctx.fillRect(player.x + 13, player.y + 15, 3, 3);
    ctx.fillRect(player.x + 25, player.y + 15, 3, 3);
    ctx.restore();
  }

  function drawObstacles() {
    ctx.save();
    obstacles.forEach(obs => {
      if (obs.type === "spike") {
        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#e1a800";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (obs.type === "top") {
        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#e1a800";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y);
        ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width, obs.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (obs.type === "pad") {
        // Jumper pad
        ctx.fillStyle = "#00ff00";
        ctx.strokeStyle = "#006600";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Arrow
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width / 2, obs.y + 8);
        ctx.lineTo(obs.x + obs.width / 2 - 8, obs.y + obs.height - 8);
        ctx.lineTo(obs.x + obs.width / 2 + 8, obs.y + obs.height - 8);
        ctx.closePath();
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function drawPlatforms() {
    ctx.save();
    platforms.forEach(pf => {
      if (pf.type === "moving") {
        ctx.fillStyle = "#ffb347";
        ctx.strokeStyle = "#b36b00";
      } else {
        ctx.fillStyle = "#8fffa0";
        ctx.strokeStyle = "#2e7d32";
      }
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(pf.x, pf.y, pf.width, pf.height);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawGround() {
    ctx.save();
    ctx.fillStyle = "#444";
    ctx.fillRect(0, height - 40, width, 40);
    ctx.restore();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    ctx.strokeText(score, width / 2, 60);
    ctx.fillText(score, width / 2, 60);
    ctx.restore();
  }

  function update() {
    if (gameOver) return;
    if (!started) return;

    // Player physics
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Platform collision (player can land on platforms)
    player.onGround = false;
    platforms.forEach(pf => {
      // Moving platform logic
      if (pf.type === "moving") {
        pf.y += pf.vy;
        if (pf.y < 80 || pf.y > height - 120) pf.vy *= -1;
      }
      if (
        player.x + player.size > pf.x &&
        player.x < pf.x + pf.width &&
        player.y + player.size > pf.y &&
        player.y + player.size - player.velocityY <= pf.y
      ) {
        player.y = pf.y - player.size;
        player.velocityY = 0;
        player.onGround = true;
      }
    });

    // Jumper pad collision
    obstacles.forEach(obs => {
      if (obs.type === "pad") {
        if (
          player.x + player.size > obs.x &&
          player.x < obs.x + obs.width &&
          player.y + player.size > obs.y &&
          player.y + player.size - player.velocityY <= obs.y + obs.height
        ) {
          player.velocityY = -28; // Strong jump
        }
      }
    });

    // Ground collision
    if (player.y + player.size > height - 40) {
      player.y = height - 40 - player.size;
      player.velocityY = 0;
      player.onGround = true;
    }

    // Add obstacles (course generation based on difficulty)
    if (frame % spawnRate === 0) {
      // Bottom spike
      const widthSpike = minSpike + Math.random() * (maxSpike - minSpike);
      obstacles.push({
        x: width,
        y: height - 40 - widthSpike,
        width: widthSpike,
        height: widthSpike,
        type: "spike"
      });
      // Chance for double spike (harder difficulties)
      if (Math.random() < doubleChance) {
        const widthSpike2 = minSpike + Math.random() * (maxSpike - minSpike);
        obstacles.push({
          x: width + widthSpike + 24,
          y: height - 40 - widthSpike2,
          width: widthSpike2,
          height: widthSpike2,
          type: "spike"
        });
      }
      // Chance for top obstacle (spike on ceiling)
      if (Math.random() < topObstacleChance) {
        const widthTop = minSpike + Math.random() * (maxSpike - minSpike);
        obstacles.push({
          x: width,
          y: 0,
          width: widthTop,
          height: widthTop,
          type: "top"
        });
      }
      // Chance for platform (jumpable)
      if (Math.random() < platformChance) {
        // Start the chain at a reachable height above ground
        const baseY = height - 40 - (40 + Math.random() * 60);
        const chainCount = 2 + Math.floor(Math.random() * 3); // 2-4 platforms per chain
        // Spread out: minGap/maxGap based on jump distance (tune as needed)
        const minGap = 110, maxGap = 170;
        const minY = height - 40 - 120;
        const maxY = height - 40 - 30;
        // Start X is just off the right edge
        const chain = generatePlatformChain(width, baseY, chainCount, minGap, maxGap, minY, maxY);
        platforms.push(...chain);
      }
      // Chance for jumper pad
      if (Math.random() < padChance) {
        const padSize = 32;
        obstacles.push({
          x: width,
          y: height - 40 - padSize,
          width: padSize,
          height: padSize,
          type: "pad"
        });
      }
    }

    // Move obstacles and check for collision
    obstacles.forEach(obs => {
      obs.x -= obstacleSpeed;
      // Collision detection (bottom and top spikes)
      if (obs.type === "spike") {
        if (
          player.x + player.size > obs.x &&
          player.x < obs.x + obs.width &&
          player.y + player.size > obs.y &&
          player.y < obs.y + obs.height
        ) {
          gameOver = true;
          bestScore = Math.max(score, bestScore);
          document.getElementById('gdashScore').innerHTML = `<b>Game Over!</b> Score: ${score} &nbsp; | &nbsp; Best: ${bestScore}`;
          document.getElementById('gdashRestart').style.display = '';
        }
        if (!obs.passed && obs.x + obs.width < player.x) {
          score++;
          obs.passed = true;
        }
      } else if (obs.type === "top") {
        if (
          player.x + player.size > obs.x &&
          player.x < obs.x + obs.width &&
          player.y < obs.y + obs.height &&
          player.y + player.size > obs.y
        ) {
          gameOver = true;
          bestScore = Math.max(score, bestScore);
          document.getElementById('gdashScore').innerHTML = `<b>Game Over!</b> Score: ${score} &nbsp; | &nbsp; Best: ${bestScore}`;
          document.getElementById('gdashRestart').style.display = '';
        }
      }
      // Pad collision handled above
    });

    // Move platforms
    platforms.forEach(pf => {
      pf.x -= obstacleSpeed;
    });

    // Remove off-screen obstacles and platforms
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    platforms = platforms.filter(pf => pf.x + pf.width > 0);

    frame++;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGround();
    drawPlatforms();
    drawObstacles();
    drawPlayer();
    drawScore();
  }

  function loop() {
    update();
    draw();
    if (!gameOver) {
      requestAnimationFrame(loop);
    }
  }

  function jump() {
    if (!started) {
      started = true;
      gameOver = false;
      obstacles = [];
      frame = 0;
      score = 0;
      player.y = height - 80;
      player.velocityY = 0;
      player.onGround = true;
      document.getElementById('gdashScore').textContent = '';
      document.getElementById('gdashRestart').style.display = 'none';
      loop();
    }
    if (!gameOver && player.onGround) {
      player.velocityY = player.jumpPower;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      jump();
    }
    if (e.key && e.key.toLowerCase() === 'r') {
      resetGame();
      draw();
    }
  });

  canvas.addEventListener('mousedown', jump);
  canvas.addEventListener('touchstart', jump);

  document.getElementById('gdashRestart').onclick = () => {
    resetGame();
    draw();
  };

  // Initial draw
  resetGame();
  draw();
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/8inthemirror.mp3'); // Change path as needed
music.loop = true;
music.volume = 0.7;

// Play music after first user interaction (required by browsers)
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>


