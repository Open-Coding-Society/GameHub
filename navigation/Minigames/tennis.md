---
layout: base
title: Tennis
description: Table Tennis
permalink: /tennis
Author: Aarush
---

<style>
  body {
    background-color: #0e1111;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e5e5e5;
  }
  #tennisCanvas {
    display: block;
gi    position: absolute;
    left: 0;
    top: 40px;
    background: #1a3d2f;
    border: 3px solid #fff;
    border-radius: 10px;
    width: 95vw;
    height: 85vh;
    max-width: 1800px;
    max-height: 1100px;
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

<h1 class="tennis-center">Mini Tennis</h1>
<p class="tennis-center">Use <b>W</b>/<b>S</b> to move your paddle. First to 5 wins!</p>
<div class="tennis-center">
  <button id="tennisRestart" class="tennis-btn" style="display:none;">Restart</button>
</div>
<canvas id="tennisCanvas" width="1800" height="1100"></canvas>
<div class="tennis-center" id="tennisScore"></div>

<script>
  const canvas = document.getElementById('tennisCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Paddle settings
  const paddleWidth = 12, paddleHeight = 80, paddleSpeed = 14; // Faster paddle
  let playerY = height / 2 - paddleHeight / 2;
  let aiY = height / 2 - paddleHeight / 2;
  let playerTargetY = playerY;
  let playerMoveDir = 0;

  // Pointer lock helpers
  function requestPointerLock() {
    canvas.requestPointerLock =
      canvas.requestPointerLock ||
      canvas.mozRequestPointerLock ||
      canvas.webkitRequestPointerLock;
    if (canvas.requestPointerLock) canvas.requestPointerLock();
  }

  function pointerLockChange() {
    // No-op, but could add UI feedback if desired
  }

  canvas.addEventListener('click', () => {
    requestPointerLock();
  });

  document.addEventListener('pointerlockchange', pointerLockChange, false);
  document.addEventListener('mozpointerlockchange', pointerLockChange, false);
  document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

  canvas.addEventListener('mousemove', (e) => {
    // If pointer is locked, use movementY for relative movement
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas ||
      document.webkitPointerLockElement === canvas
    ) {
      playerTargetY += e.movementY * 1.5; // Scale for faster movement
      playerTargetY = Math.max(0, Math.min(height - paddleHeight, playerTargetY));
    } else {
      // Fallback: absolute mouse position
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      playerTargetY = Math.max(0, Math.min(height - paddleHeight, mouseY - paddleHeight / 2));
    }
  });

  // Ball settings
  let ballX = width / 2, ballY = height / 2;
  let ballRadius = 10;
  let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
  let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

  // Score
  let playerScore = 0, aiScore = 0;
  let gameOver = false;

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

  function resetBall() {
    ballX = width / 2;
    ballY = height / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  function resetGame() {
    playerScore = 0;
    aiScore = 0;
    playerY = height / 2 - paddleHeight / 2;
    aiY = height / 2 - paddleHeight / 2;
    resetBall();
    gameOver = false;
    document.getElementById('tennisScore').textContent = '';
    document.getElementById('tennisRestart').style.display = 'none';
  }

  function update() {
    if (gameOver) return;

    // Smoothly move player paddle toward target
    if (playerY < playerTargetY) {
      playerY += Math.min(paddleSpeed, playerTargetY - playerY);
    } else if (playerY > playerTargetY) {
      playerY -= Math.min(paddleSpeed, playerY - playerTargetY);
    }
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

    // AI paddle collision
    if (
      ballX + ballRadius > width - 32 &&
      ballY > aiY &&
      ballY < aiY + paddleHeight
    ) {
      ballSpeedX *= -1.1;
      ballX = width - 32 - ballRadius;
      ballSpeedY += ((ballY - (aiY + paddleHeight / 2)) / paddleHeight) * 6;
    }

    // Score
    if (ballX < 0) {
      aiScore++;
      if (aiScore >= 5) {
        gameOver = true;
        document.getElementById('tennisScore').innerHTML = "<b>Game Over!</b> You Lose!";
        document.getElementById('tennisRestart').style.display = '';
      }
      resetBall();
    }
    if (ballX > width) {
      playerScore++;
      if (playerScore >= 5) {
        gameOver = true;
        document.getElementById('tennisScore').innerHTML = "<b>Game Over!</b> You Win!";
        document.getElementById('tennisRestart').style.display = '';
      }
      resetBall();
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
    if (e.key === 'w' || e.key === 'W') {
      playerTargetY -= paddleSpeed * 6;
      playerTargetY = Math.max(0, playerTargetY);
    }
    if (e.key === 's' || e.key === 'S') {
      playerTargetY += paddleSpeed * 6;
      playerTargetY = Math.min(height - paddleHeight, playerTargetY);
    }
    if (e.key.toLowerCase() === 'r') {
      resetGame();
      draw();
      loop();
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
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/smashbrosmaintheme.mp3'); // Change path as needed
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