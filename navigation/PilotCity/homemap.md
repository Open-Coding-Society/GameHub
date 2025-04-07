---
layout: base
title: GenomeGamers Homepage
search_exclude: true
permalink: /home
---


<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mini Games Hub</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      text-align: center;
      background: #111;
      color: #fff;
    }
    h1 {
      margin-top: 20px;
    }
    #loading {
      font-size: 1.2em;
    }
    canvas {
      display: block;
      margin: 20px auto;
      border: 2px solid white;
      background: #444; /* fallback background color */
    }
  </style>
</head>
<body>

<h1>Welcome to the Mini Games Hub</h1>
<div id="loading">Loading game assets...</div>
<canvas id="gameCanvas" width="960" height="720"></canvas>

<script>
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const roomImage = new Image();
  roomImage.src = 'https://i.postimg.cc/4xLtFzbV/Screenshot-2025-04-04-at-10-24-02-AM.png';

  const spriteImage = new Image();
  spriteImage.src = 'https://i.postimg.cc/LsFpbWXV/image-2025-04-04-104816749.png';

  const player = {
    x: 100,
    y: 100,
    width: 75,
    height: 75,
    speed: 4
  };

  const keys = {};

  const objects = [
    { x: 300, y: 150, width: 40, height: 40, game: 'game1.html' },
    { x: 500, y: 150, width: 40, height: 40, game: 'game2.html' },
    { x: 765, y: 170, width: 40, height: 40, game: 'game3.html' },
    { x: 800, y: 590, width: 40, height: 40, game: 'game4.html' },
    { x: 410, y: 375, width: 40, height: 40, game: 'game5.html' },
  ];

  const walls = [
    { x: 270, y: 250, width: 25, height: 55 },
    { x: 420, y: 250, width: 25, height: 25 },
    { x: 560, y: 250, width: 25, height: 55 },
    { x: 270, y: 450, width: 25, height: 55 },
    { x: 560, y: 450, width: 25, height: 55 },
    { x: 680, y: 400, width: 25, height: 55 },
    { x: 800, y: 400, width: 25, height: 55 },
    { x: 680, y: 590, width: 25, height: 55 },
    { x: 385, y: 360, width: 95, height: 30 },
    // Add more wall blocks here
  ];

  const borderThickness = 10;
walls.push(
  { x: 0, y: 0, width: canvas.width, height: borderThickness }, // top
  { x: 0, y: canvas.height - borderThickness, width: canvas.width, height: borderThickness }, // bottom
  { x: 0, y: 0, width: borderThickness, height: canvas.height }, // left
  { x: canvas.width - borderThickness, y: 0, width: borderThickness, height: canvas.height } // right
);

  function update() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys['w']) nextY -= player.speed;
    if (keys['s']) nextY += player.speed;
    if (keys['a']) nextX -= player.speed;
    if (keys['d']) nextX += player.speed;

    const futureBox = {
      x: nextX,
      y: nextY,
      width: player.width,
      height: player.height
    };

    const hittingWall = walls.some(wall => isColliding(futureBox, wall));

    if (!hittingWall) {
      player.x = nextX;
      player.y = nextY;
    }

    // Check for object collision (trigger mini-games)
    objects.forEach(obj => {
      if (isColliding(player, obj)) {
        window.location.href = obj.game;
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (roomImage.complete && roomImage.naturalWidth !== 0) {
      ctx.drawImage(roomImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw invisible walls (debug) uncomment to see walls
   // ctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
   // walls.forEach(wall => {
   //   ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    //});

    // Draw player sprite
    ctx.drawImage(spriteImage, player.x, player.y, player.width, player.height);

    // Draw interactive objects
    ctx.fillStyle = 'red';
    objects.forEach(obj => {
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  function isColliding(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  // Start game once images are loaded
  let imagesLoaded = 0;
  function tryStartGame() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      const loading = document.getElementById('loading');
      if (loading) loading.style.display = 'none';
      gameLoop();
    }
  }

  roomImage.onload = tryStartGame;
  spriteImage.onload = tryStartGame;

  roomImage.onerror = () => alert('Failed to load room image');
  spriteImage.onerror = () => alert('Failed to load sprite image');
</script>

</body>
</html>