---
layout: post
title: Scripps Biotech ML-Based Game
description: Move your character around to enter different mini games on this map.
Author: Everyone
---

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
    background: #444; 
    position: relative;
  }
  #points-display {
    position: absolute;
    top: 22px; 
    left: 10px;
    font-size: 1.5em;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 5px;
    z-index: 1;
  }
  #canvas-container {
    position: relative;
    display: inline-block;
  }
</style>


<div id="loading">Loading game assets...</div>
<div id="canvas-container">
<div id="points-display">Points: 0</div>
<canvas id="gameCanvas" width="960" height="720"></canvas>
</div>

<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const roomImage = new Image();
roomImage.src = 'https://i.postimg.cc/4xLtFzbV/Screenshot-2025-04-04-at-10-24-02-AM.png';

const spriteImage = new Image();
spriteImage.src = 'https://i.postimg.cc/LsFpbWXV/image-2025-04-04-104816749.png';

//doesnt work YET save for later
const iconImage = new Image();
iconImage.src = 'https://i.postimg.cc/8PG3nSh7/image-2025-04-08-105328050.png'; 

const player = {
  x: 170,
  y: 335,
  width: 75,
  height: 75,
  speed: 4
};

const keys = {};

const objects = [
  { x: 100, y: 100, width: 40, height: 40, game: 'blackjack', icon: true }, // top left
  { x: 450, y: 100, width: 40, height: 40, game: 'building' }, // top middle
  { x: 755, y: 250, width: 40, height: 40, game: 'editing' }, // top right
  { x: 100, y: 600, width: 40, height: 40, game: 'exploration' }, // bottom left
  { x: 450, y: 620, width: 40, height: 40, game: 'outbreak' }, // bottom middle
  { x: 735, y: 585, width: 40, height: 40, game: 'aboutus' }  // bottom right
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

  objects.forEach(obj => {
    if (isColliding(player, obj)) {
      switch (obj.game) {
        case 'blackjack':
          window.location.href = '{{site.baseurl}}/blackjack';
          break;
        case 'building':
          window.location.href = '{{site.baseurl}}/building';
          break;
        case 'editing':
          window.location.href = '{{site.baseurl}}/editing';
          break;
        case 'exploration':
          window.location.href = '{{site.baseurl}}/exploration';
          break;
        case 'outbreak':
          window.location.href = '{{site.baseurl}}/outbreak';
          break;
        case 'aboutus':
          window.location.href = '{{site.baseurl}}/aboutus';
          break;
      }
    }
  });

  objects.forEach(obj => {
    if (obj.icon && iconImage.complete) {
      ctx.drawImage(iconImage, obj.x, obj.y, obj.width, obj.height);
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
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
<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
async function fetchPoints() {
  try {
    const response = await fetch(`${pythonURI}/api/points`, {
      ...fetchOptions,
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('points-display').textContent = `Points: ${data.points.points}`;
    } else {
      const error = await response.json();
      document.getElementById('points-display').textContent = `Points: ${error.message || 'Error fetching points'}`;
    }
  } catch (err) {
    document.getElementById('points-display').textContent = 'Points: Failed to fetch points';
  }
}


fetchPoints();
</script>