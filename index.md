---
layout: post
title: Scripps Biotech ML-Based Game
description: Move your character around to enter different minigames and experiences on this map.  
Author: Everyone (Aarush made the cosmetic box)
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

  #skin-modal {
    display: none;
    position: fixed;
    top: 23%; 
    left: 23%; 
    width: 55%;
    height: 65%; 
    background: #001f3f; 
    color: white;
    z-index: 1000;
    text-align: center;
    border-radius: 10px;
  }
  #skin-modal-content {
    position: relative;
    padding: 40px 20px; 
    background: #001f3f; 
    border-radius: 10px;
  }
  #skin-modal-content p {
    font-size: 2em; 
    margin-bottom: 20px;
  }
  #close-modal {
    position: absolute;
    top: 10px; 
    right: 10px; 
    background: black; 
    color: white;
    border: none;
    padding: 15px 22.5px; 
    cursor: pointer;
    border-radius: 5px; 
    font-size: 1.5em; 
  }
  #confirm-button {
  background: #d4af37;
  color: white;
  border: none;
  padding: 15px 30px; 
  cursor: pointer;
  font-size: 1.2em; 
  border-radius: 10px;
  position: relative; /* Change to relative positioning */
  margin: 20px auto 0; /* Add margin to position below the boxes */
  display: block; /* Center the button */
  text-transform: uppercase; 
}
  #skin-options {
    position: relative;
    width: 70%; /* Further reduce width to shift right */
    height: 70%; 
    margin: 0 auto; /* Center horizontally */
    margin-top: 20px; 
    display: grid; 
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: repeat(2, 1fr); 
    gap: 40px; /* Increase space between boxes */
    justify-content: center;
    align-items: center;
  }
  .skin-option {
    width: 180px; /* Further increase box size */
    height: 180px; /* Further increase box size */
    background: white;
    border-radius: 15px; /* Slightly rounder corners */
    cursor: pointer;
  }
</style>

<div id="loading">Loading game assets...</div>
<div id="canvas-container">
<div id="points-display">Points: 0</div>
<canvas id="gameCanvas" width="960" height="720"></canvas>
</div>

<div id="skin-modal">
  <div id="skin-modal-content">
    <button id="close-modal">X</button>
    <p>Customize your skin and outfit here!</p>
    <div id="skin-options">
      <div class="skin-option"></div>
      <div class="skin-option"></div>
      <div class="skin-option"></div>
      <div class="skin-option"></div>
      <div class="skin-option"></div>
      <div class="skin-option"></div>
    </div>
    <button id="confirm-button">Confirm</button>
  </div>
</div>

<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const roomImage = new Image();
roomImage.src = 'https://i.postimg.cc/4xLtFzbV/Screenshot-2025-04-04-at-10-24-02-AM.png';

const spriteImage = new Image();
spriteImage.src = 'https://i.postimg.cc/LsFpbWXV/image-2025-04-04-104816749.png';



const objectImages = {
  blackjack: '{{site.baseurl}}/images/playingcard.png',
  building: '{{site.baseurl}}/images/dnabuilding.png',
  skin: '{{site.baseurl}}/images/cosmeticicon.png',
  editing: '{{site.baseurl}}/images/geneedit.png',
  adventure: '{{site.baseurl}}/images/marioplatformer.png',
  outline: '{{site.baseurl}}/images/chaticon.png',
  exploration: '{{site.baseurl}}/images/joystick.png',
  outbreak: '{{site.baseurl}}/images/outbreakpotion.png',
  aboutus: '{{site.baseurl}}/images/aboutusicon.png'
};


const loadedObjectImages = {};
for (const game in objectImages) {
  const img = new Image();
  img.src = objectImages[game];
  loadedObjectImages[game] = img;
}

const player = {
  x: 400,
  y: 325,
  width: 75,
  height: 75,
  speed: 4
};

const keys = {};

const objects = [
  { x: 100, y: 100, width: 40, height: 40, game: 'blackjack', icon: true }, // top left
  { x: 450, y: 100, width: 40, height: 40, game: 'building' }, // top middle
  { x: 755, y: 250, width: 40, height: 40, game: 'skin' }, // top right
  { x: 100, y: 360, width: 40, height: 40, game: 'editing' }, // middle left
  { x: 560, y: 360, width: 40, height: 40, game: 'adventure' }, // middle
  { x: 735, y: 410, width: 40, height: 40, game: 'outline' }, // middle right
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
  { x: 680, y: 570, width: 25, height: 55 },
  { x: 800, y: 570, width: 25, height: 55 },
  { x: 755, y: 180, width: 25, height: 55 },
  { x: 675, y: 80, width: 250, height: 55 },
];

const borderThickness = 10;
walls.push(
{ x: 0, y: 0, width: canvas.width, height: borderThickness }, // top
{ x: 0, y: canvas.height - borderThickness, width: canvas.width, height: borderThickness }, // bottom
{ x: 0, y: 0, width: borderThickness, height: canvas.height }, // left
{ x: canvas.width - borderThickness, y: 0, width: borderThickness, height: canvas.height } // right
);

const topRightBox = { x: 755, y: 250, width: 40, height: 40 }; 
const skinModal = document.getElementById('skin-modal');
const closeModal = document.getElementById('close-modal');
const confirmButton = document.getElementById('confirm-button');
let isModalOpen = false; 
let hasLeftBox = true; 

function update() {
  let nextX = player.x;
  let nextY = player.y;

  if (!isModalOpen) { 
    if (keys['w']) nextY -= player.speed;
    if (keys['s']) nextY += player.speed;
    if (keys['a']) nextX -= player.speed;
    if (keys['d']) nextX += player.speed;
  }

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

  
  if (isColliding(player, topRightBox)) {
    if (hasLeftBox) { 
      skinModal.style.display = 'block';
      isModalOpen = true;
      hasLeftBox = false; 
    }
  } else {
    hasLeftBox = true; 
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
        case 'outline':
          window.location.href = '{{site.baseurl}}/outline';
          break;
        case 'adventure':
          window.location.href = '{{site.baseurl}}/adventure';
          break; 
      }
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


  objects.forEach(obj => {

    let img = loadedObjectImages[obj.game];
    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);
    } else {

      ctx.fillStyle = 'blue';
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
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

closeModal.addEventListener('click', () => {
  skinModal.style.display = 'none';
  isModalOpen = false; 
});

confirmButton.addEventListener('click', () => {
  alert('Changes saved! (Functionality to be implemented)');
  skinModal.style.display = 'none';
  isModalOpen = false; 
});
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
      if (data.total_points !== undefined) {
        document.getElementById('points-display').textContent = `Points: ${data.total_points}`;
      } else {
        document.getElementById('points-display').textContent = 'Points: 0'; 
      }
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