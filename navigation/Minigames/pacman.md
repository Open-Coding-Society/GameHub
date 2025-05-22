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
    /* Pacman blue gradient */
    border: 2px solid #ffd700; /* Pacman yellow border */
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
<p style="text-align: center;">Use W, A, S, D keys to move Pacman! Avoid the squids!</p>

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

  const tileSize = 32; // Use the current tile size
  const rows = Math.floor(canvas.height / tileSize); // 960/32 = 30
  const cols = Math.floor(canvas.width / tileSize);  // 896/32 = 28

  let bullets = [];
  let lastPacmanMove = 0;
  let lastGhostMove = 0;
  let lastBulletMove = 0;
  let pacmanMoveInterval = 10; // ms, extremely fast
  let ghostMoveInterval = 20;  // ms, extremely fast
  const bulletMoveInterval = 10; // ms, extremely fast

  let pacmanPixelX, pacmanPixelY;
  let ghostPixelPositions = [];
  const moveAnimSteps = 4; // fewer steps for snappier fast movement
  let pacmanAnimStep = 0;
  let ghostAnimSteps = [];
  let pacmanTargetX = 1, pacmanTargetY = 1;

  let desiredDirection = null;

  // Map generator based on difficulty, now with random generation
  function generateMaze(difficulty) {
    const maze = [];
    let wallChance;
    if (difficulty === 'easy') wallChance = 0.07;
    else if (difficulty === 'medium') wallChance = 0.15;
    else wallChance = 0.25; // hard

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        // Always border walls
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          row.push(0);
          continue;
        }
        // Don't block the starting area for Pacman and ghosts
        const safeZone =
          (Math.abs(r - 1) <= 1 && Math.abs(c - 1) <= 1) ||
          (Math.abs(r - Math.floor(rows / 2)) <= 2 && Math.abs(c - Math.floor(cols / 2)) <= 2);

        // Randomly place walls, but not in the safe zones
        if (!safeZone && Math.random() < wallChance) {
          row.push(0); // wall
        } else {
          row.push(1); // pellet
        }
      }
      maze.push(row);
    }
    return maze;
  }

  let maze = generateMaze(document.getElementById('difficulty').value);

  const pacman = { x: 1, y: 1, dx: 0, dy: 0 };
  const ghostColors = ['red', 'pink', 'cyan', 'orange', 'green', 'purple', 'blue', 'magenta', 'lime', 'yellow'];
  let ghosts = [];
  let pacmanDirection = 'right';
  let gameOver = false;
  let gameStarted = false;

  // Difficulty logic
  function getGhostCount() {
    const diff = (document.getElementById('difficulty') || {}).value || 'medium';
    if (diff === 'easy') return 4;
    if (diff === 'hard') return 8;
    return 6; // medium
  }

  function initGhosts() {
    ghosts = [];
    const count = getGhostCount();
    for (let i = 0; i < count; i++) {
      ghosts.push({
        x: Math.floor(cols / 2) + (i % 5) * 2 - 4,
        y: Math.floor(rows / 2) + Math.floor(i / 5) * 2 - 1,
        dx: [1, -1, 0, 0][i % 4],
        dy: [0, 0, 1, -1][i % 4],
        color: ghostColors[i % ghostColors.length]
      });
    }
  }

  initGhosts();

  function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
        if (maze[row][col] === 0) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        } else if (maze[row][col] === 1) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(
            col * tileSize + tileSize / 2,
            row * tileSize + tileSize / 2,
            tileSize / 8,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }

  function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    // Use pixel position for smooth animation
    let px = pacmanPixelX + tileSize / 2;
    let py = pacmanPixelY + tileSize / 2;
    let startAngle, endAngle;
    switch (pacmanDirection) {
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

  function drawGhosts() {
    ghosts.forEach((ghost, i) => {
      ctx.save();
      // Use pixel position for smooth animation
      let gx = ghostPixelPositions[i]?.x ?? ghost.x * tileSize;
      let gy = ghostPixelPositions[i]?.y ?? ghost.y * tileSize;
      ctx.translate(gx + tileSize / 2, gy + tileSize / 2);
      // Body base
      ctx.beginPath();
      ctx.moveTo(-tileSize / 2, tileSize / 4);
      ctx.lineTo(-tileSize / 2, 0);
      ctx.arc(0, 0, tileSize / 2, Math.PI, 0, false);
      ctx.lineTo(tileSize / 2, tileSize / 4);
      let waveCount = 4;
      let waveWidth = tileSize / waveCount;
      for (let j = waveCount - 1; j >= 0; j--) {
        let x = -tileSize / 2 + j * waveWidth;
        let y = tileSize / 4 + (j % 2 === 0 ? tileSize / 8 : 0);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = ghost.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-tileSize / 6, -tileSize / 8, tileSize / 8, 0, Math.PI * 2);
      ctx.arc(tileSize / 6, -tileSize / 8, tileSize / 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      let px = pacman.x - ghost.x;
      let py = pacman.y - ghost.y;
      let mag = Math.sqrt(px * px + py * py) || 1;
      let pupilOffsetX = (px / mag) * tileSize / 16;
      let pupilOffsetY = (py / mag) * tileSize / 16;
      ctx.beginPath();
      ctx.arc(-tileSize / 6 + pupilOffsetX, -tileSize / 8 + pupilOffsetY, tileSize / 20, 0, Math.PI * 2);
      ctx.arc(tileSize / 6 + pupilOffsetX, -tileSize / 8 + pupilOffsetY, tileSize / 20, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.restore();
    });
  }

  function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
      ctx.beginPath();
      ctx.arc(
        bullet.x * tileSize + tileSize / 2,
        bullet.y * tileSize + tileSize / 2,
        tileSize / 6,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  function updateBullets(force) {
    const now = performance.now();
    if (!force && now - lastBulletMove < bulletMoveInterval) return;
    lastBulletMove = now;

    bullets.forEach(bullet => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;
    });

    bullets = bullets.filter(bullet => {
      if (
        bullet.x < 0 || bullet.x >= cols ||
        bullet.y < 0 || bullet.y >= rows ||
        maze[bullet.y][bullet.x] === 0
      ) {
        return false;
      }
      // Remove ghosts hit by bullet
      let hitIndex = -1;
      for (let i = 0; i < ghosts.length; i++) {
        if (
          Math.round(ghostPixelPositions[i]?.x / tileSize) === bullet.x &&
          Math.round(ghostPixelPositions[i]?.y / tileSize) === bullet.y
        ) {
          hitIndex = i;
          break;
        }
      }
      if (hitIndex !== -1) {
        ghosts.splice(hitIndex, 1);
        ghostPixelPositions.splice(hitIndex, 1);
        ghostAnimSteps.splice(hitIndex, 1);
        return false; // Remove bullet only if it hit a ghost
      }
      return true; // Keep bullet if it didn't hit a ghost
    });
  }

  // Smooth movement for Pacman
  function updatePacman(force) {
    if (gameOver) return;
    const now = performance.now();
    if (!force && now - lastPacmanMove < pacmanMoveInterval) return;
    lastPacmanMove = now;

    // Try to change direction if possible, even while moving
    if (desiredDirection) {
      const testX = pacman.x + desiredDirection.dx;
      const testY = pacman.y + desiredDirection.dy;
      // Allow direction change if the next tile in the desired direction is open and Pacman is aligned to the grid
      if (pacmanAnimStep === 0 && maze[testY][testX] !== 0) {
        pacman.dx = desiredDirection.dx;
        pacman.dy = desiredDirection.dy;
        pacmanDirection = desiredDirection.dir;
      }
      desiredDirection = null;
    }

    // Only move to next tile if not already animating
    if (pacmanAnimStep === 0) {
      const nextX = pacman.x + pacman.dx;
      const nextY = pacman.y + pacman.dy;
      if (maze[nextY][nextX] !== 0) {
        pacmanTargetX = nextX;
        pacmanTargetY = nextY;
        pacmanAnimStep = moveAnimSteps;
      } else {
        pacman.dx = 0;
        pacman.dy = 0;
      }
      if (maze[pacman.y][pacman.x] === 1) {
        maze[pacman.y][pacman.x] = 2; // Eat pellet
      }
    }
    // Animate pixel position
    if (pacmanAnimStep > 0) {
      const dx = (pacmanTargetX - pacman.x) * tileSize / moveAnimSteps;
      const dy = (pacmanTargetY - pacman.y) * tileSize / moveAnimSteps;
      pacmanPixelX += dx;
      pacmanPixelY += dy;
      pacmanAnimStep--;
      if (pacmanAnimStep === 0) {
        pacman.x = pacmanTargetX;
        pacman.y = pacmanTargetY;
        pacmanPixelX = pacman.x * tileSize;
        pacmanPixelY = pacman.y * tileSize;
      }
    }
  }

  // Smooth movement for ghosts
  function updateGhosts(force) {
    if (gameOver) return;
    const now = performance.now();
    if (!force && now - lastGhostMove < ghostMoveInterval) return;
    lastGhostMove = now;

    ghosts.forEach((ghost, i) => {
      if (!ghostAnimSteps[i]) ghostAnimSteps[i] = 0;
      if (ghostAnimSteps[i] === 0) {
        let possibleDirs = [
          { dx: 1, dy: 0 },   // right
          { dx: -1, dy: 0 },  // left
          { dx: 0, dy: 1 },   // down
          { dx: 0, dy: -1 }   // up
        ];
        const nextX = ghost.x + ghost.dx;
        const nextY = ghost.y + ghost.dy;
        if (
          maze[nextY][nextX] === 0 ||
          Math.random() < 0.1
        ) {
          const validDirs = possibleDirs.filter(dir => {
            const tx = ghost.x + dir.dx;
            const ty = ghost.y + dir.dy;
            return maze[ty][tx] !== 0 && !(dir.dx === -ghost.dx && dir.dy === -ghost.dy);
          });
          if (validDirs.length > 0) {
            const newDir = validDirs[Math.floor(Math.random() * validDirs.length)];
            ghost.dx = newDir.dx;
            ghost.dy = newDir.dy;
          }
        }
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;
        ghostAnimSteps[i] = moveAnimSteps;
      }
      // Animate pixel position
      if (!ghostPixelPositions[i]) ghostPixelPositions[i] = { x: ghost.x * tileSize, y: ghost.y * tileSize };
      if (ghostAnimSteps[i] > 0) {
        ghostPixelPositions[i].x += (ghost.dx * tileSize) / moveAnimSteps;
        ghostPixelPositions[i].y += (ghost.dy * tileSize) / moveAnimSteps;
        ghostAnimSteps[i]--;
        if (ghostAnimSteps[i] === 0) {
          ghostPixelPositions[i].x = ghost.x * tileSize;
          ghostPixelPositions[i].y = ghost.y * tileSize;
        }
      }
      // Check collision with Pacman
      if (
        Math.round(ghostPixelPositions[i].x / tileSize) === pacman.x &&
        Math.round(ghostPixelPositions[i].y / tileSize) === pacman.y
      ) {
        gameOver = true;
        setTimeout(() => {
          alert('Game Over! You were caught by a squid!');
        }, 10);
      }
    });
  }

  function resetGame() {
    pacman.x = 1;
    pacman.y = 1;
    pacman.dx = 0;
    pacman.dy = 0;
    pacmanDirection = 'right';
    maze = generateMaze(document.getElementById('difficulty').value);
    initGhosts();
    bullets = [];
    gameOver = false;
    pacmanPixelX = pacman.x * tileSize;
    pacmanPixelY = pacman.y * tileSize;
    pacmanAnimStep = 0;
    pacmanTargetX = pacman.x;
    pacmanTargetY = pacman.y;
    ghostPixelPositions = ghosts.map(g => ({ x: g.x * tileSize, y: g.y * tileSize }));
    ghostAnimSteps = ghosts.map(() => 0);
  }

  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      resetGame();
      requestAnimationFrame(gameLoop);
    }
  }

  // Hide canvas and controls until difficulty is chosen
  canvas.style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';

  // Show start button and wait for difficulty selection
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start Game';
  startBtn.style.fontSize = '1.1em';
  startBtn.style.marginLeft = '10px';
  const diffDiv = document.getElementById('difficulty').parentElement;
  diffDiv.appendChild(startBtn);

  startBtn.addEventListener('click', () => {
    canvas.style.display = '';
    document.getElementById('restartBtn').style.display = '';
    startBtn.style.display = 'none';
    document.getElementById('difficulty').disabled = true;
    startGame();
  });
  let currentDirection = { dx: 0, dy: 0, dir: null };  // persistent current direction

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
      resetGame();
      return;
    }
    if (gameOver) return;
    if (!gameStarted) return;

    switch (e.key.toLowerCase()) {
      case 'w':
        currentDirection = { dx: 0, dy: -1, dir: 'up' };
        break;
      case 's':
        currentDirection = { dx: 0, dy: 1, dir: 'down' };
        break;
      case 'a':
        currentDirection = { dx: -1, dy: 0, dir: 'left' };
        break;
      case 'd':
        currentDirection = { dx: 1, dy: 0, dir: 'right' };
        break;
                               }
  });

  function updatePacman(force) {
    if (gameOver) return;
    const now = performance.now();
    if (!force && now - lastPacmanMove < pacmanMoveInterval) return;
    lastPacmanMove = now;

    // Instead of desiredDirection, use currentDirection persistently
    if (currentDirection.dir) {
      const testX = pacman.x + currentDirection.dx;
      const testY = pacman.y + currentDirection.dy;
      if (pacmanAnimStep === 0 && maze[testY][testX] !== 0) {
        pacman.dx = currentDirection.dx;
        pacman.dy = currentDirection.dy;
        pacmanDirection = currentDirection.dir;
      }
    }

    if (pacmanAnimStep === 0) {
      const nextX = pacman.x + pacman.dx;
      const nextY = pacman.y + pacman.dy;
      if (maze[nextY][nextX] !== 0) {
        pacmanTargetX = nextX;
        pacmanTargetY = nextY;
        pacmanAnimStep = moveAnimSteps;
      } else {
        pacman.dx = 0;
        pacman.dy = 0;
      }
      if (maze[pacman.y][pacman.x] === 1) {
        maze[pacman.y][pacman.x] = 2; // Eat pellet
      }
    }

    if (pacmanAnimStep > 0) {
      const dx = (pacmanTargetX - pacman.x) * tileSize / moveAnimSteps;
      const dy = (pacmanTargetY - pacman.y) * tileSize / moveAnimSteps;
      pacmanPixelX += dx;
      pacmanPixelY += dy;
      pacmanAnimStep--;
      if (pacmanAnimStep === 0) {
        pacman.x = pacmanTargetX;
        pacman.y = pacmanTargetY;
        pacmanPixelX = pacman.x * tileSize;
        pacmanPixelY = pacman.y * tileSize;
      }
    }
  }


  function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();

    // Always update movement, even after gameOver, but only allow input/movement if not gameOver
    updatePacman();
    updateBullets();
    updateGhosts();
    drawPacman();
    drawBullets();
    drawGhosts();

    requestAnimationFrame(gameLoop);
  }

  // Only allow difficulty change before game starts
  document.getElementById('difficulty').addEventListener('change', () => {
    if (!gameStarted) {
      maze = generateMaze(document.getElementById('difficulty').value);
      resetGame();
    }
  });
  document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
  });
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/6scatteredandlost.mp3'); // Change path as needed
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