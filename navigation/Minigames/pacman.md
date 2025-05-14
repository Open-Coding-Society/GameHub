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
    background-color: black;
    border: 2px solid #e5e5e5;
  }
</style>

<h1 style="text-align: center;">Pacman Game</h1>
<p style="text-align: center;">Use W, A, S, D keys to move Pacman! Avoid the squids!</p>

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

<script>
  const canvas = document.getElementById('pacmanCanvas');
  const ctx = canvas.getContext('2d');

  const tileSize = 32; // Use the current tile size
  const rows = Math.floor(canvas.height / tileSize); // 960/32 = 30
  const cols = Math.floor(canvas.width / tileSize);  // 896/32 = 28

  // Fill the maze with a border of walls and pellets inside, and add more obstacle shapes
  const maze = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        row.push(0); // wall
      } else if (
        // Squares (existing)
        (r % 4 === 0 && c % 4 === 0) ||
        (r % 6 === 0 && c % 6 === 0) ||
        // Horizontal bars
        (r % 8 === 4 && c > 2 && c < cols - 3 && c % 6 < 4) ||
        // Vertical bars
        (c % 8 === 4 && r > 2 && r < rows - 3 && r % 6 < 4) ||
        // Diagonal line
        (r === c && r > 2 && r < rows - 3) ||
        // Cross in the center
        (Math.abs(r - Math.floor(rows / 2)) < 2 && Math.abs(c - Math.floor(cols / 2)) < 6 && (r === Math.floor(rows / 2) || c === Math.floor(cols / 2)))
      ) {
        row.push(0); // obstacle
      } else {
        row.push(1); // pellet
      }
    }
    maze.push(row);
  }

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

    // Adjust Pacman's mouth direction based on movement
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

    ctx.arc(
      pacman.x * tileSize + tileSize / 2,
      pacman.y * tileSize + tileSize / 2,
      tileSize / 2,
      startAngle,
      endAngle
    );
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fill();
  }

  function drawGhosts() {
    ghosts.forEach((ghost) => {
      // Draw body
      ctx.save();
      ctx.translate(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2);

      // Body base
      ctx.beginPath();
      ctx.moveTo(-tileSize / 2, tileSize / 4);
      ctx.lineTo(-tileSize / 2, 0);
      ctx.arc(0, 0, tileSize / 2, Math.PI, 0, false);
      ctx.lineTo(tileSize / 2, tileSize / 4);

      // Wavy bottom
      let waveCount = 4;
      let waveWidth = tileSize / waveCount;
      for (let i = waveCount - 1; i >= 0; i--) {
        let x = -tileSize / 2 + i * waveWidth;
        let y = tileSize / 4 + (i % 2 === 0 ? tileSize / 8 : 0);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = ghost.color;
      ctx.fill();

      // Eyes
      ctx.beginPath();
      ctx.arc(-tileSize / 6, -tileSize / 8, tileSize / 8, 0, Math.PI * 2);
      ctx.arc(tileSize / 6, -tileSize / 8, tileSize / 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      // Pupils (look in Pacman's direction)
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

  function updatePacman() {
    if (gameOver) return;
    const nextX = pacman.x + pacman.dx;
    const nextY = pacman.y + pacman.dy;

    if (maze[nextY][nextX] !== 0) {
      pacman.x = nextX;
      pacman.y = nextY;

      if (maze[pacman.y][pacman.x] === 1) {
        maze[pacman.y][pacman.x] = 2; // Eat pellet
      }
    }
  }

  function updateGhosts() {
    if (gameOver) return;
    ghosts.forEach((ghost) => {
      // Randomly change direction with a small probability or if hitting a wall
      let possibleDirs = [
        { dx: 1, dy: 0 },   // right
        { dx: -1, dy: 0 },  // left
        { dx: 0, dy: 1 },   // down
        { dx: 0, dy: -1 }   // up
      ];
      const nextX = ghost.x + ghost.dx;
      const nextY = ghost.y + ghost.dy;

      // If about to hit a wall or randomly (10% chance), pick a new direction
      if (
        maze[nextY][nextX] === 0 ||
        Math.random() < 0.1
      ) {
        // Filter directions that are not walls and not directly reversing
        const validDirs = possibleDirs.filter(dir => {
          const tx = ghost.x + dir.dx;
          const ty = ghost.y + dir.dy;
          // Prevent reversing direction
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

      // Check collision with Pacman
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        alert('Game Over! You were caught by a squid!');
        gameOver = true;
      }
    });
  }

  function resetGame() {
    pacman.x = 1;
    pacman.y = 1;
    pacman.dx = 0;
    pacman.dy = 0;
    pacmanDirection = 'right';
    initGhosts();
    gameOver = false;
  }

  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      resetGame();
      setInterval(gameLoop, 200);
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

  document.addEventListener('keydown', (e) => {
    if (gameOver && e.key.toLowerCase() === 'r') {
      resetGame();
      return;
    }
    if (!gameStarted) return;
    switch (e.key.toLowerCase()) {
      case 'w': // Move up
        if (maze[pacman.y - 1][pacman.x] !== 0) {
          pacman.dx = 0;
          pacman.dy = -1;
          pacmanDirection = 'up';
        }
        break;
      case 's': // Move down
        if (maze[pacman.y + 1][pacman.x] !== 0) {
          pacman.dx = 0;
          pacman.dy = 1;
          pacmanDirection = 'down';
        }
        break;
      case 'a': // Move left
        if (maze[pacman.y][pacman.x - 1] !== 0) {
          pacman.dx = -1;
          pacman.dy = 0;
          pacmanDirection = 'left';
        }
        break;
      case 'd': // Move right
        if (maze[pacman.y][pacman.x + 1] !== 0) {
          pacman.dx = 1;
          pacman.dy = 0;
          pacmanDirection = 'right';
        }
        break;
    }
  });

  function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    updatePacman();
    drawPacman();
    updateGhosts();
    drawGhosts();
  }

  // Only allow difficulty change before game starts
  document.getElementById('difficulty').addEventListener('change', () => {
    if (!gameStarted) resetGame();
  });
  document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
  });
</script>