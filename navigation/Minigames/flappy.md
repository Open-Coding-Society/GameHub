---
layout: bootstrap
title: Flappy 
description: Flappy Game
permalink: /flappy
Author: Aarush
---

<style>
  body {
    background-color: #222;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  #flappyCanvas {
    display: block;
    margin: 80px auto 0 auto; /* Increased top margin for more downward shift */
    background: linear-gradient(to bottom, #87ceeb 80%, #e0e0e0 100%);
    border: 2px solid #333;
    width: 90vw;
    height: 80vh;
    max-width: 900px;
    max-height: 900px;
  }
  .flappy-center {
    text-align: center;
    margin-top: 10px;
  }
  .flappy-btn {
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
  .flappy-settings {
    position: absolute;
    top: 200px; /* Move settings panel down to match canvas shift */
    right: 5vw;
    background: #222;
    color: #ffd700;
    border: 2px solid #ffd700;
    border-radius: 10px;
    padding: 18px 18px 10px 18px;
    min-width: 180px;
    z-index: 10;
    font-size: 1em;
  }
  .flappy-settings label {
    display: block;
    margin-bottom: 6px;
    margin-top: 10px;
    font-weight: bold;
  }
  .flappy-settings input[type="range"] {
    width: 100%;
  }
  .flappy-settings span {
    font-size: 1em;
    color: #fff;
    margin-left: 8px;
  }
</style>

<h1 class="flappy-center">Flappy Bird</h1>
<p class="flappy-center">Press <b>Space</b> or click/tap to jump. Avoid the pipes!</p>
<div class="flappy-center">
  <button id="flappyRestart" class="flappy-btn" style="display:none;">Restart</button>
</div>

<!-- Settings Panel -->
<div class="flappy-settings" id="flappySettings">
  <label for="speedRange">Pipe Speed: <span id="speedValue"></span></label>
  <input type="range" id="speedRange" min="1" max="8" step="0.1" value="2.5">
  <label for="jumpRange">Jump Height: <span id="jumpValue"></span></label>
  <input type="range" id="jumpRange" min="-16" max="-4" step="0.1" value="-8">
</div>

<canvas id="flappyCanvas" width="900" height="800"></canvas>
<div class="flappy-center" id="flappyScore"></div>

<script>
  const canvas = document.getElementById('flappyCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Settings elements
  const speedRange = document.getElementById('speedRange');
  const jumpRange = document.getElementById('jumpRange');
  const speedValue = document.getElementById('speedValue');
  const jumpValue = document.getElementById('jumpValue');

  // Bird
  const bird = {
    x: 80,
    y: height / 2,
    radius: 18,
    velocity: 0,
    gravity: 0.5,
    jump: Number(jumpRange.value)
  };

  // Pipes
  let pipes = [];
  const pipeWidth = 90; // Increased from 60 to 90 for bigger pipes
  const pipeGap = 200;  // Increased from 150 to 200 for easier passage
  const pipeDistance = 180; // NEW: Distance between pipes (frames), increased for farther spacing
  let pipeSpeed = Number(speedRange.value);
  let frame = 0;
  let score = 0;
  let bestScore = 0;
  let gameOver = false;
  let started = false;

  // Update settings display
  function updateSettingsDisplay() {
    speedValue.textContent = pipeSpeed.toFixed(1);
    jumpValue.textContent = Math.abs(bird.jump).toFixed(1);
  }

  // Listen for settings changes
  speedRange.addEventListener('input', function () {
    pipeSpeed = Number(speedRange.value);
    updateSettingsDisplay();
  });
  jumpRange.addEventListener('input', function () {
    bird.jump = Number(jumpRange.value);
    updateSettingsDisplay();
  });

  updateSettingsDisplay();

  function showRestartButton(show) {
    document.getElementById('flappyRestart').style.display = show ? '' : 'none';
  }

  function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    started = false;
    document.getElementById('flappyScore').textContent = '';
    showRestartButton(false);
  }

  function drawBird() {
    ctx.save();
    // Body (ellipse)
    ctx.beginPath();
    ctx.ellipse(bird.x, bird.y, bird.radius + 6, bird.radius, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffe066";
    ctx.shadowColor = "#e1a800";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#e1a800";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wing
    ctx.save();
    ctx.translate(bird.x - 8, bird.y + 2);
    ctx.rotate(-0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.radius / 1.7, bird.radius / 2.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fffbe0";
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Beak (triangle)
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.radius + 10, bird.y - 2);
    ctx.lineTo(bird.x + bird.radius + 22, bird.y - 6);
    ctx.lineTo(bird.x + bird.radius + 10, bird.y + 6);
    ctx.closePath();
    ctx.fillStyle = "#ff9900";
    ctx.fill();
    ctx.strokeStyle = "#d17a00";
    ctx.stroke();

    // Eye white
    ctx.beginPath();
    ctx.arc(bird.x + 12, bird.y - 7, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Eye black
    ctx.beginPath();
    ctx.arc(bird.x + 14, bird.y - 7, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#222";
    ctx.fill();

    // Eyebrow
    ctx.beginPath();
    ctx.moveTo(bird.x + 8, bird.y - 13);
    ctx.lineTo(bird.x + 18, bird.y - 15);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  function drawPipes() {
    ctx.fillStyle = "#228B22";
    pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, height - pipe.bottom);
    });
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
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Add pipes
    if (frame % pipeDistance === 0) { // Use pipeDistance instead of 90
      const top = Math.random() * (height - pipeGap - 120) + 40;
      pipes.push({
        x: width,
        top: top,
        bottom: top + pipeGap,
        passed: false
      });
    }

    // Move pipes and check for collision
    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed;
      // Collision
      if (
        bird.x + bird.radius > pipe.x &&
        bird.x - bird.radius < pipe.x + pipeWidth &&
        (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
      ) {
        gameOver = true;
        bestScore = Math.max(score, bestScore);
        document.getElementById('flappyScore').innerHTML = `<b>Game Over!</b> Score: ${score} &nbsp; | &nbsp; Best: ${bestScore}`;
        showRestartButton(true);
      }
      // Score
      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        score++;
        pipe.passed = true;
      }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Ground or ceiling collision
    if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
      gameOver = true;
      bestScore = Math.max(score, bestScore);
      document.getElementById('flappyScore').innerHTML = `<b>Game Over!</b> Score: ${score} &nbsp; | &nbsp; Best: ${bestScore}`;
      showRestartButton(true);
    }

    frame++;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawPipes();
    drawBird();
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
      pipes = [];
      frame = 0;
      score = 0;
      document.getElementById('flappyScore').textContent = '';
      bird.y = height / 2;
      bird.velocity = 0;
      showRestartButton(false);
      loop();
    }
    if (!gameOver) {
      bird.velocity = bird.jump;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault(); // Prevent page from scrolling down
      jump();
    }
    if (e.key && e.key.toLowerCase() === 'r') {
      resetGame();
      draw();
    }
  });

  canvas.addEventListener('mousedown', jump);
  canvas.addEventListener('touchstart', jump);

  document.getElementById('flappyRestart').onclick = () => {
    resetGame();
    draw();
  };

  // Initial draw
  resetGame();
  draw();
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/7anxiety.mp3'); // Change path as needed
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