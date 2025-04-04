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

<h1>🎮 Welcome to the Mini Games Hub</h1>
<div id="loading">Loading game assets...</div>
<canvas id="gameCanvas" width="800" height="600"></canvas>

<script>
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const roomImage = new Image();
  roomImage.src = 'https://i.postimg.cc/4xLtFzbV/Screenshot-2025-04-04-at-10-24-02-AM.png'; // ✅ Update this
  const spriteImage = new Image();
  spriteImage.src = 'https://i.postimg.cc/g0DphJ09/image-2025-04-04-104141001.png'; // ✅ Update this

  const player = {
    x: 100,
    y: 100,
    width: 64,
    height: 64,
    speed: 4
  };

  const keys = {};
  const objects = [
    { x: 300, y: 150, width: 40, height: 40, game: 'game1.html' },
    { x: 500, y: 300, width: 40, height: 40, game: 'game2.html' }
  ];

  function update() {
    if (keys['w']) player.y -= player.speed;
    if (keys['s']) player.y += player.speed;
    if (keys['a']) player.x -= player.speed;
    if (keys['d']) player.x += player.speed;

    objects.forEach(obj => {
      if (isColliding(player, obj)) {
        window.location.href = obj.game;
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fallback if room image not loaded
    if (roomImage.complete && roomImage.naturalWidth !== 0) {
      ctx.drawImage(roomImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(spriteImage, player.x, player.y, player.width, player.height);

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

  // Wait until both images load before starting game
  let imagesLoaded = 0;
  const tryStartGame = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      document.getElementById('loading').style.display = 'none';
      gameLoop();
    }
  };
  roomImage.onload = tryStartGame;
  spriteImage.onload = tryStartGame;

  // Error fallback
  roomImage.onerror = () => alert('Failed to load room image');
  spriteImage.onerror = () => alert('Failed to load sprite image');
</script>

</body>
</html>