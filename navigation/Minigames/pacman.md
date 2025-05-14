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

<script>
  const canvas = document.getElementById('pacmanCanvas');
  const ctx = canvas.getContext('2d');

  const tileSize = 32; // Use the current tile size
  const rows = Math.floor(canvas.height / tileSize); // 960/32 = 30
  const cols = Math.floor(canvas.width / tileSize);  // 896/32 = 28

  // Fill the maze with a border of walls and pellets inside
  const maze = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        row.push(0); // wall
      } else if ((r % 4 === 0 && c % 4 === 0) || (r % 6 === 0 && c % 6 === 0)) {
        row.push(0); // add some internal walls for interest
      } else {
        row.push(1); // pellet
      }
    }
    maze.push(row);
  }

  const pacman = { x: 1, y: 1, dx: 0, dy: 0 };
  const ghosts = [
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2), dx: 1, dy: 0, color: 'red' },
    { x: Math.floor(cols / 2) + 2, y: Math.floor(rows / 2), dx: -1, dy: 0, color: 'pink' },
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2) + 2, dx: 0, dy: 1, color: 'cyan' },
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2) - 2, dx: 0, dy: -1, color: 'orange' },
  ];

  let pacmanDirection = 'right';

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
      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.arc(
        ghost.x * tileSize + tileSize / 2,
        ghost.y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  function updatePacman() {
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
    ghosts.forEach((ghost) => {
      const nextX = ghost.x + ghost.dx;
      const nextY = ghost.y + ghost.dy;

      if (maze[nextY][nextX] === 0) {
        ghost.dx = -ghost.dx;
        ghost.dy = -ghost.dy;
      } else {
        ghost.x = nextX;
        ghost.y = nextY;
      }

      // Check collision with Pacman
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        alert('Game Over! You were caught by a squid!');
        resetGame();
      }
    });
  }

  function resetGame() {
    pacman.x = 1;
    pacman.y = 1;
    pacman.dx = 0;
    pacman.dy = 0;
    pacmanDirection = 'right';
    ghosts.forEach((ghost, index) => {
      ghost.x = Math.floor(cols / 2) + index * 2;
      ghost.y = Math.floor(rows / 2);
    });
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    updatePacman();
    drawPacman();
    updateGhosts();
    drawGhosts();
  }

  document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
      case 'w': // Move up
        pacman.dx = 0;
        pacman.dy = -1;
        pacmanDirection = 'up';
        break;
      case 's': // Move down
        pacman.dx = 0;
        pacman.dy = 1;
        pacmanDirection = 'down';
        break;
      case 'a': // Move left
        pacman.dx = -1;
        pacman.dy = 0;
        pacmanDirection = 'left';
        break;
      case 'd': // Move right
        pacman.dx = 1;
        pacman.dy = 0;
        pacmanDirection = 'right';
        break;
    }
  });

  setInterval(gameLoop, 200);
</script>