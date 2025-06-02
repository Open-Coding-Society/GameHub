---
layout: base
title: Pacman
description: Pacman
permalink: /pacman
Author: Aarush
---

<style>
  body {
    background-color: #0e1111;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e5e5e5;
  }

  canvas {
    display: block;
    margin: 20px auto;
    background: linear-gradient(135deg, #000428 0%, #004e92 100%);
    border: 2px solid #ffd700;
    box-shadow: 0 0 30px #00f6ff, 0 0 10px #ffd700 inset;
  }
  .restart-hint {
    text-align: center;
    font-size: 1.1em;
    color: #ffd700;
    margin-bottom: 8px;
    margin-top: 0;
    letter-spacing: 1px;
  }
  #difficulty {
    background: #000428;
    color: #ffd700;
    border: 2px solid #ffd700;
    border-radius: 6px;
    padding: 4px 10px;
    font-weight: bold;
    box-shadow: 0 0 10px #00f6ff inset;
  }
  #restartBtn {
    background: #ffd700;
    color: #222;
    border: 2px solid #ffd700;
    border-radius: 6px;
    font-weight: bold;
    margin-left: 10px;
    box-shadow: 0 0 10px #ffd70066;
  }
</style>

<h1 style="text-align: center;">Pacman Game</h1>
<p style="text-align: center;">Use W, A, S, D keys to move Pacman! Click Space to shoot in the direction you are looking!</p>

<p class="restart-hint">Press <b>R</b> to restart</p>

<canvas id="pacmanCanvas" width="896" height="960"></canvas>

<div style="text-align:center;margin:10px;">
  <label for="difficulty" style="font-size:1.2em;">Difficulty: </label>
  <select id="difficulty" style="font-size:1.1em;">
    <option value="easy">Easy</option>
    <option value="medium" selected>Medium</option>
    <option value="hard">Hard</option>
  </select>
  <button id="restartBtn" style="font-size:1.1em;">Restart</button>
</div>

<!-- Speed Settings -->
<div style="text-align:center;margin:10px;">
  <label for="pacmanSpeed" style="font-size:1.1em;color:#ffd700;">Pacman Speed: <span id="pacmanSpeedValue"></span></label>
  <input type="range" id="pacmanSpeed" min="2" max="40" step="1" value="10" style="width:120px;vertical-align:middle;">
  &nbsp;&nbsp;
  <label for="ghostSpeed" style="font-size:1.1em;color:#ffd700;">Squid Speed: <span id="ghostSpeedValue"></span></label>
  <input type="range" id="ghostSpeed" min="2" max="40" step="1" value="20" style="width:120px;vertical-align:middle;">
</div>

<script>
  const canvas = document.getElementById('pacmanCanvas');
  const ctx = canvas.getContext('2d');

  const tileSize = 32;
  const rows = Math.floor(canvas.height / tileSize);
  const cols = Math.floor(canvas.width / tileSize);

  let maze = [];
  let gameOver = false;
  let gameStarted = false;

  // Pacman state
  let pacman = {
    x: 1,
    y: 1,
    pixelX: 1 * tileSize,
    pixelY: 1 * tileSize,
    dir: 'right',
    dx: 0,
    dy: 0,
  };

  // Ghosts array
  let ghosts = [];

  // Bullets array
  let bullets = [];

  // Difficulty
  const difficultySelect = document.getElementById('difficulty');

  // Speed control (pixels per frame)
  let pacmanSpeed = 2;  // px per frame
  let ghostSpeed = 1.5; // px per frame

  // UI Elements for speed display and control
  const pacmanSpeedSlider = document.getElementById('pacmanSpeed');
  const ghostSpeedSlider = document.getElementById('ghostSpeed');
  const pacmanSpeedValue = document.getElementById('pacmanSpeedValue');
  const ghostSpeedValue = document.getElementById('ghostSpeedValue');

  function updateSpeedFromSliders() {
    // Convert slider value (2 to 40) to px/frame speeds scaled for smoothness
    pacmanSpeed = pacmanSpeedSlider.value / 4;  // around 0.5 to 10 px/frame
    ghostSpeed = ghostSpeedSlider.value / 10;   // around 0.2 to 4 px/frame
    pacmanSpeedValue.textContent = pacmanSpeedSlider.value;
    ghostSpeedValue.textContent = ghostSpeedSlider.value;
  }

  // Set base speed of Pacman to 20
  pacmanSpeed = 20 / 4; // Convert to px/frame (scaled for smoothness)

  // Update speed slider to reflect base speed
  pacmanSpeedSlider.value = 20;
  pacmanSpeedValue.textContent = pacmanSpeedSlider.value;

  // Ensure speed updates correctly when slider changes
  pacmanSpeedSlider.addEventListener('input', updateSpeedFromSliders);
  ghostSpeedSlider.addEventListener('input', updateSpeedFromSliders);
  updateSpeedFromSliders();

  // Generate maze randomly based on difficulty
  // Ensure maze generation allows access to all orbs
  function generateMaze(difficulty) {
    const maze = [];
    let wallChance;
    if (difficulty === 'easy') wallChance = 0.07;
    else if (difficulty === 'medium') wallChance = 0.15;
    else wallChance = 0.25;

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          row.push(0); // Border walls
          continue;
        }
        const safeZone =
          (Math.abs(r - 1) <= 1 && Math.abs(c - 1) <= 1) ||
          (Math.abs(r - Math.floor(rows / 2)) <= 2 && Math.abs(c - Math.floor(cols / 2)) <= 2);
        if (!safeZone && Math.random() < wallChance) {
          // Prevent fully surrounding an orb
          const neighbors = [
            [r - 1, c],
            [r + 1, c],
            [r, c - 1],
            [r, c + 1]
          ];
          const surrounded = neighbors.every(([nr, nc]) => maze[nr]?.[nc] === 0 || nr === 0 || nr === rows - 1 || nc === 0 || nc === cols - 1);
          row.push(surrounded ? 1 : 0); // Place orb if surrounded
        } else {
          row.push(Math.random() < 0.5 ? 1 : 2); // 1 = orb, 2 = empty
        }
      }
      maze.push(row);
    }
    return maze;
  }

  // Check if tile is walkable (not wall)
  function canMoveTo(x, y) {
    return x >= 0 && x < cols && y >= 0 && y < rows && maze[y][x] !== 0;
  }

  // Initialize ghosts
  function initGhosts() {
    ghosts = [];
    let count = 6;
    if (difficultySelect.value === 'easy') count = 4;
    else if (difficultySelect.value === 'hard') count = 8;
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    for (let i = 0; i < count; i++) {
      ghosts.push({
        x: centerX + (i % 5) * 2 - 4,
        y: centerY + Math.floor(i / 5) * 2 - 1,
        pixelX: (centerX + (i % 5) * 2 - 4) * tileSize,
        pixelY: (centerY + Math.floor(i / 5) * 2 - 1) * tileSize,
        dx: 1,
        dy: 0,
        color: ['red', 'pink', 'cyan', 'orange', 'green', 'purple', 'blue', 'magenta'][i % 8],
      });
    }
  }

  // Draw maze
  function drawMaze() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (maze[r][c] === 0) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
        } else if (maze[r][c] === 1) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(c * tileSize + tileSize / 2, r * tileSize + tileSize / 2, tileSize / 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Draw Pacman smoothly at pixel coords
  function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    let px = pacman.pixelX + tileSize / 2;
    let py = pacman.pixelY + tileSize / 2;
    let startAngle, endAngle;
    switch (pacman.dir) {
      case 'up':
        startAngle = 1.75 * Math.PI;
        endAngle = 1.25 * Math.PI;
        break;
      case 'down':
        startAngle = 0.75 * Math.PI;
        endAngle = 0.25 * Math.PI;
        break;
      case 'left':
        startAngle = 1.25 * Math.PI;
        endAngle = 0.75 * Math.PI;
        break;
      case 'right':
      default:
        startAngle = 0.25 * Math.PI;
        endAngle = 1.75 * Math.PI;
        break;
    }
    ctx.arc(px, py, tileSize / 2, startAngle, endAngle);
    ctx.lineTo(px, py);
    ctx.fill();
  }

  // Draw ghosts smoothly
  function drawGhost(ghost) {
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    let px = ghost.pixelX + tileSize / 2;
    let py = ghost.pixelY + tileSize / 2;
    ctx.arc(px, py, tileSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(px - 6, py - 5, 6, 0, Math.PI * 2);
    ctx.arc(px + 6, py - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(px - 6, py - 5, 3, 0, Math.PI * 2);
    ctx.arc(px + 6, py - 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Change bullets to red color for differentiation
  function drawBullets() {
    ctx.fillStyle = 'red'; // Change bullet color to red
    for (const bullet of bullets) {
      ctx.beginPath();
      ctx.arc(bullet.pixelX + tileSize / 2, bullet.pixelY + tileSize / 2, tileSize / 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Movement interpolation for Pacman
  function updatePacman() {
    if (pacman.targetX === undefined) return;

    const targetPixelX = pacman.targetX * tileSize;
    const targetPixelY = pacman.targetY * tileSize;

    const diffX = targetPixelX - pacman.pixelX;
    const diffY = targetPixelY - pacman.pixelY;

    const dist = Math.sqrt(diffX * diffX + diffY * diffY);

    if (dist < pacmanSpeed) {
      // Snap to target tile pixel position
      pacman.pixelX = targetPixelX;
      pacman.pixelY = targetPixelY;
      pacman.x = pacman.targetX;
      pacman.y = pacman.targetY;
      pacman.targetX = undefined;
      pacman.targetY = undefined;
    } else {
      // Move towards target pixel position
      pacman.pixelX += (diffX / dist) * pacmanSpeed;
      pacman.pixelY += (diffY / dist) * pacmanSpeed;
    }
  }

  // Movement interpolation for ghosts
  function updateGhosts(deltaTime) {
    for (const ghost of ghosts) {
      if (ghost.targetX === undefined) {
        // Choose new target tile for ghost based on random direction
        const directions = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }
        ];
        const validDirs = directions.filter(d => canMoveTo(ghost.x + d.dx, ghost.y + d.dy));
        if (validDirs.length > 0) {
          const choice = validDirs[Math.floor(Math.random() * validDirs.length)];
          ghost.targetX = ghost.x + choice.dx;
          ghost.targetY = ghost.y + choice.dy;
        }
      }

      if (ghost.targetX !== undefined) {
        const targetPixelX = ghost.targetX * tileSize;
        const targetPixelY = ghost.targetY * tileSize;
        const diffX = targetPixelX - ghost.pixelX;
        const diffY = targetPixelY - ghost.pixelY;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist < ghostSpeed) {
          ghost.pixelX = targetPixelX;
          ghost.pixelY = targetPixelY;
          ghost.x = ghost.targetX;
          ghost.y = ghost.targetY;
          ghost.targetX = undefined;
          ghost.targetY = undefined;
        } else {
          ghost.pixelX += (diffX / dist) * ghostSpeed;
          ghost.pixelY += (diffY / dist) * ghostSpeed;
        }
      }
    }
  }

  // Update bullets positions smoothly
  function updateBullets() {
    bullets = bullets.filter(bullet => {
      if (bullet.targetX === undefined) {
        bullet.targetX = bullet.x + bullet.dx;
        bullet.targetY = bullet.y + bullet.dy;
        bullet.pixelX = bullet.x * tileSize;
        bullet.pixelY = bullet.y * tileSize;
      }

      const targetPixelX = bullet.targetX * tileSize;
      const targetPixelY = bullet.targetY * tileSize;

      const diffX = targetPixelX - bullet.pixelX;
      const diffY = targetPixelY - bullet.pixelY;
      const dist = Math.sqrt(diffX * diffX + diffY * diffY);

      const bulletSpeed = 8; // pixels per frame, bullets are fast

      if (dist < bulletSpeed) {
        bullet.pixelX = targetPixelX;
        bullet.pixelY = targetPixelY;
        bullet.x = bullet.targetX;
        bullet.y = bullet.targetY;

        // Check collisions
        if (!canMoveTo(bullet.x, bullet.y)) return false; // hits wall - remove

        for (let i = 0; i < ghosts.length; i++) {
          if (ghosts[i].x === bullet.x && ghosts[i].y === bullet.y) {
            const killedGhost = ghosts.splice(i, 1)[0]; // Remove ghost and store it
            respawnGhost(killedGhost); // Respawn ghost after 10 seconds
            return false; // bullet disappears
          }
        }

        // Move bullet forward one tile again next update
        bullet.targetX = bullet.x + bullet.dx;
        bullet.targetY = bullet.y + bullet.dy;
      } else {
        bullet.pixelX += (diffX / dist) * bulletSpeed;
        bullet.pixelY += (diffY / dist) * bulletSpeed;
      }
      return true;
    });
  }

  // Eat pellets
  function eatPellet() {
    if (maze[pacman.y][pacman.x] === 1) {
      maze[pacman.y][pacman.x] = 2;
    }
  }

  // Check if all orbs are collected
  function checkWinCondition() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (maze[r][c] === 1) return false; // Orb still exists
      }
    }
    return true; // All orbs collected
  }

  // Update checkCollisions to show "You Win!" if all orbs are collected
  function checkCollisions() {
    for (const ghost of ghosts) {
      const px = Math.round(pacman.pixelX / tileSize);
      const py = Math.round(pacman.pixelY / tileSize);
      if (ghost.x === px && ghost.y === py) {
        gameOver = true;
        ctx.fillStyle = 'red';
        ctx.font = '48px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2); // Only show restart text
      }
    }

    if (checkWinCondition()) {
      gameOver = true;
      ctx.fillStyle = 'green';
      ctx.font = '48px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2); // Show win text
    }
  }

  // Respawn ghosts near the middle after 10 seconds
  function respawnGhost(ghost) {
    setTimeout(() => {
      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 2);
      let newX, newY;

      // Ensure the ghost spawns at least 10 tiles away from Pacman and not on walls
      do {
        newX = centerX + Math.floor(Math.random() * 5) - 2;
        newY = centerY + Math.floor(Math.random() * 5) - 2;
      } while (
        Math.abs(newX - pacman.x) < 10 &&
        Math.abs(newY - pacman.y) < 10 &&
        !canMoveTo(newX, newY)
      );

      ghosts.push({
        x: newX,
        y: newY,
        pixelX: newX * tileSize,
        pixelY: newY * tileSize,
        dx: 1,
        dy: 0,
        color: ghost.color, // Same color as the ghost killed
      });
    }, 10000); // 10 seconds delay
  }

  // Handle keyboard input
  let inputDir = null;

  // Prevent space key from scrolling the page and allow shooting
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    const key = e.key.toLowerCase();

    const directionMap = {
      'w': { dx: 0, dy: -1, dir: 'up' },
      'a': { dx: -1, dy: 0, dir: 'left' },
      's': { dx: 0, dy: 1, dir: 'down' },
      'd': { dx: 1, dy: 0, dir: 'right' },
    };

    if (key === 'r') {
      resetGame();
      return;
    }

    if (key in directionMap) {
      inputDir = directionMap[key];
    }

    if (e.code === 'Space') {
      e.preventDefault(); // Prevent page from scrolling down
      // Shoot bullet in Pacman's current direction
      if (pacman.dx !== 0 || pacman.dy !== 0) {
        bullets.push({
          x: pacman.x,
          y: pacman.y,
          dx: pacman.dx,
          dy: pacman.dy,
          pixelX: pacman.pixelX,
          pixelY: pacman.pixelY,
          targetX: undefined,
          targetY: undefined,
        });
      }
    }
  });

  // Ensure pressing 'R' restarts the level after collision
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r' && gameOver) {
      resetGame();
    }
  });

  // Game reset logic
  function resetGame() {
    gameOver = false;
    gameStarted = true;
    maze = generateMaze(difficultySelect.value);
    pacman.x = 1;
    pacman.y = 1;
    pacman.pixelX = pacman.x * tileSize;
    pacman.pixelY = pacman.y * tileSize;
    pacman.dir = 'right';
    pacman.dx = 0;
    pacman.dy = 0;
    pacman.targetX = undefined;
    pacman.targetY = undefined;
    inputDir = null;
    bullets = [];
    initGhosts();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  }

  difficultySelect.addEventListener('change', resetGame);
  document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
  });

  // Main game loop using requestAnimationFrame
  function gameLoop() {
    if (!gameStarted) {
      resetGame();
      gameStarted = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMaze();

    if (!gameOver) {
      // Move Pacman tile if reached target tile or no target
      if (pacman.targetX === undefined && inputDir) {
        const newX = pacman.x + inputDir.dx;
        const newY = pacman.y + inputDir.dy;
        if (canMoveTo(newX, newY)) {
          pacman.targetX = newX;
          pacman.targetY = newY;
          pacman.dir = inputDir.dir;
          pacman.dx = inputDir.dx;
          pacman.dy = inputDir.dy;
        } else {
          pacman.dx = 0;
          pacman.dy = 0;
        }
      }
    }

    updatePacman();
    eatPellet();
    updateGhosts();
    updateBullets();

    drawBullets();

    for (const ghost of ghosts) {
      drawGhost(ghost);
    }

    drawPacman();

    checkCollisions();

    if (gameOver) {
      ctx.fillStyle = 'red';
      ctx.font = '48px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2); // Only show "Game Over!" text
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
</script>


