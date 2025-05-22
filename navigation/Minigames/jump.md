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
  <button id="gdashRestart" class="gdash-btn" style="display:none;">Restart</button>
</div>
<canvas id="gdashCanvas" width="900" height="400"></canvas>
<div class="gdash-center" id="gdashScore"></div>

<script>
  const canvas = document.getElementById('gdashCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Player
  const player = {
    x: 100,
    y: height - 80,
    size: 40,
    velocityY: 0,
    gravity: 1.1,
    jumpPower: -18,
    onGround: true
  };

  // Obstacles
  let obstacles = [];
  let obstacleSpeed = 8;
  let frame = 0;
  let score = 0;
  let bestScore = 0;
  let gameOver = false;
  let started = false;

  function resetGame() {
    player.y = height - 80;
    player.velocityY = 0;
    player.onGround = true;
    obstacles = [];
    frame = 0;
    score = 0;
    gameOver = false;
    started = false;
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
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#e1a800";
    ctx.lineWidth = 2;
    obstacles.forEach(obs => {
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y + obs.height);
      ctx.lineTo(obs.x + obs.width / 2, obs.y);
      ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
      ctx.closePath();
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

    // Ground collision
    if (player.y + player.size > height - 40) {
      player.y = height - 40 - player.size;
      player.velocityY = 0;
      player.onGround = true;
    } else {
      player.onGround = false;
    }

    // Add obstacles
    if (frame % 60 === 0) {
      const widthSpike = 32 + Math.random() * 16;
      obstacles.push({
        x: width,
        y: height - 40 - widthSpike,
        width: widthSpike,
        height: widthSpike
      });
    }

    // Move obstacles and check for collision
    obstacles.forEach(obs => {
      obs.x -= obstacleSpeed;
      // Collision detection
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
      // Score
      if (!obs.passed && obs.x + obs.width < player.x) {
        score++;
        obs.passed = true;
      }
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    frame++;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGround();
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


