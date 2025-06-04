---
layout: base
title: Tennis
description: Table Tennis
permalink: /tennis
Author: Aarush & Zach
---

<style>
  body {
    background-color: #0e1111;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e5e5e5;
  }
  #tennisCanvas {
    display: block;
    position: absolute;
    left: 50%;
    top: 60%; /* Move slightly down */
    transform: translate(-50%, -50%);
    background: #1a3d2f;
    border: 3px solid #fff;
    border-radius: 10px;
    width: 90vw; /* Slightly smaller */
    height: 80vh; /* Slightly smaller */
    max-width: 1600px; /* Adjust max width */
    max-height: 900px; /* Adjust max height */
  }
  .tennis-center {
    text-align: center;
    margin-top: 10px;
  }
  .tennis-btn {
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

<div class="container py-4">
  <div class="text-center mb-4">
    <h1 class="display-4">Pong Game</h1>
    <p class="lead">Use <b>W</b>/<b>S</b> or <b>↑</b>/<b>↓</b> to move your puck and return serves. First to 5 points wins!</p>
  </div>

<div class="tennis-center">
  <button id="tennisRestart" class="tennis-btn" style="display:none;">Restart</button>
</div>
<canvas id="tennisCanvas"></canvas>
<div class="tennis-center" id="tennisScore"></div>

<script>
(() => {
  const canvas = document.getElementById('tennisCanvas');
  const ctx = canvas.getContext('2d');
  const width = 1200; // Canvas width
  const height = 600; // Canvas height
  canvas.width = width;
  canvas.height = height;

  // Center the canvas in the middle of the page
  canvas.style.position = 'absolute';
  canvas.style.top = '50%';
  canvas.style.left = '50%';
  canvas.style.transform = 'translate(-50%, -50%)';

  // Paddle settings
  const paddleWidth = 12, paddleHeight = 80, paddleSpeed = 14;
  let playerY = height / 2 - paddleHeight / 2;
  let aiY = height / 2 - paddleHeight / 2;
  let playerMoveDir = 0;

  // Ball settings
  let ballX = width / 2, ballY = height / 2;
  let ballRadius = 10;
  let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
  let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

  // Score
  let playerScore = 0, aiScore = 0;
  let gameOver = false;

  // AI miss logic
  let aiMissCounter = Math.floor(Math.random() * 10) + 1; // Random miss between 1-10 hits
  let aiMissOffset = 0; // Offset for AI paddle when missing

  function drawCourt() {
    ctx.fillStyle = "#1a3d2f";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawPaddles() {
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#fff";
    ctx.fillRect(width - 20 - paddleWidth, aiY, paddleWidth, paddleHeight);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(`${playerScore} : ${aiScore}`, width / 2, 40);
    ctx.restore();
  }

  function resetBall(servingPlayer) {
    ballX = width / 2;
    ballY = height / 2;
    ballSpeedX = servingPlayer === "player" ? 6 : -6; // Serve direction based on who lost the point
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  function resetGame() {
    playerScore = 0;
    aiScore = 0;
    playerY = height / 2 - paddleHeight / 2;
    aiY = height / 2 - paddleHeight / 2;
    resetBall("player");
    gameOver = false;
    document.getElementById('tennisScore').textContent = '';
    document.getElementById('tennisRestart').style.display = 'none';
  }

  function update() {
    if (gameOver) return;

    // Player paddle movement
    playerY += playerMoveDir * paddleSpeed;
    playerY = Math.max(0, Math.min(height - paddleHeight, playerY));

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > height) {
      ballSpeedY *= -1;
    }

    // Player paddle collision
    if (
      ballX - ballRadius < 32 &&
      ballY > playerY &&
      ballY < playerY + paddleHeight
    ) {
      ballSpeedX *= -1.1;
      ballX = 32 + ballRadius;
      ballSpeedY += ((ballY - (playerY + paddleHeight / 2)) / paddleHeight) * 6;
    }

    // AI paddle collision or miss
    if (ballX + ballRadius > width - 32) {
      if (--aiMissCounter <= 0) {
        aiMissOffset = Math.random() > 0.5 ? 50 : -50; // Randomly offset AI paddle too high or too low
        aiY += aiMissOffset; // Apply the offset
        aiMissCounter = Math.floor(Math.random() * 10) + 1; // Reset miss counter
        playerScore++;
        resetBall("player");
      } else if (
        ballY > aiY &&
        ballY < aiY + paddleHeight
      ) {
        ballSpeedX *= -1.1;
        ballX = width - 32 - ballRadius;
        ballSpeedY += ((ballY - (aiY + paddleHeight / 2)) / paddleHeight) * 6;
      } else {
        aiScore++;
        resetBall("ai");
      }
    }

    // Score
    if (ballX < 0) {
      aiScore++;
      if (aiScore >= 5) {
        gameOver = true;
        document.getElementById('tennisScore').innerHTML = "<b>Game Over!</b> You Lose!";
        document.getElementById('tennisRestart').style.display = '';
      }
      resetBall("ai");
    }
    if (playerScore >= 5) {
      gameOver = true;
      document.getElementById('tennisScore').innerHTML = "<b>Game Over!</b> You Win!";
      document.getElementById('tennisRestart').style.display = '';
    }

    // AI movement (simple follow)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 20) aiY += paddleSpeed;
    else if (aiCenter > ballY + 20) aiY -= paddleSpeed;
    aiY = Math.max(0, Math.min(height - paddleHeight, aiY));
  }

  function draw() {
    drawCourt();
    drawPaddles();
    drawBall();
    drawScore();
  }

  function loop() {
    update();
    draw();
    if (!gameOver) {
      requestAnimationFrame(loop);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') {
      playerMoveDir = -1; // Move up
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
      playerMoveDir = 1; // Move down
    }
    if (e.key.toLowerCase() === 'r') {
      resetGame();
      draw();
      loop();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp' || e.key === 's' || e.key === 'ArrowDown') {
      playerMoveDir = 0; // Stop movement
    }
  });

  document.getElementById('tennisRestart').onclick = () => {
    resetGame();
    draw();
    loop();
  };

  // Start game
  resetGame();
  draw();
  loop();
})();
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/19mapletreeway.mp3'); // Change path as needed
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