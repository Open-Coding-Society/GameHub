---
layout: post
title: Genomic Architects
description: Building, Editing, Blackjack
permalink: /world1
Author: Zach, Ian, Aarush
---

<style>
  body {
    background-image: url('{{site.baseurl}}/images/homebackground.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
  h1 {
    margin-top: 20px;
    font-family: 'Open Sans', sans-serif;
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

  #home-btn-container {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 2;
    /* Make sure it's above the canvas */
    pointer-events: auto;
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
  position: relative; 
  margin: 20px auto 0; 
  display: block; 
  text-transform: uppercase; 
}
  #skin-options {
    position: relative;
    width: 70%; 
    height: 70%; 
    margin: 0 auto; 
    margin-top: 20px; 
    display: grid; 
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: repeat(2, 1fr); 
    gap: 40px; 
    justify-content: center;
    align-items: center.
  }
  .skin-option {
    position: relative; 
    width: 180px; 
    height: 180px; 
    background: white;
    border-radius: 15px; 
    cursor: pointer;
    background-size: cover;
    background-position: center;
  }
  .skin-option .points {
    position: absolute;
    top: 5px;
    left: 5px; 
    font-size: 1.2em;
    font-weight: bold;
    color: black;
    background: rgba(255, 255, 255, 0.8);
    padding: 2px 5px;
    border-radius: 5px;
  }
  .skin-option:nth-child(1) {
    background-image: url('https://i.postimg.cc/PxDYNLjG/Default.png'); 
  }
  .skin-option:nth-child(2) {
    background-image: url('https://i.postimg.cc/C5gp0YzS/True-Gold-Melodie.png'); 
  }
  .skin-option:nth-child(3) {
    background-image: url('https://i.postimg.cc/K8wLmvh6/Dialga.png'); 
  }
  .skin-option:nth-child(4) {
    background-image: url('https://i.postimg.cc/VsKW3w58/Jett.png'); 
  }
  .skin-option:nth-child(5) {
    background-image: url('https://i.postimg.cc/VsF0hWG0/Goku.png'); 
  }
  .skin-option:nth-child(6) {
    background-image: url('https://i.postimg.cc/rygC4TLH/Boss-Bandit.png'); 
  }
  .skin-option .checkmark {
    display: none; 
    position: absolute;
    top: -20px; 
    left: -18px; 
    width: 50px;
    height: 50px;
    background: url('https://i.postimg.cc/WDxvjnPY/checkmark.png') no-repeat center center; 
    background-size: contain;
    z-index: 10;
  }
  .skin-option.selected .checkmark {
    display: block; 
  }
</style>

<div id="loading">Loading game assets...</div>
<div id="canvas-container">
  <div id="points-display">Points: 0</div>
  <div id="home-btn-container">
    <a href="{{site.baseurl}}/" id="home-btn" class="btn btn-warning" style="font-size: 1.3em; padding: 10px 28px; border-radius: 8px;">
      Back to Home
    </a>
  </div>
  <canvas id="gameCanvas" width="960" height="720"></canvas>
</div>

<div id="skin-modal">
  <div id="skin-modal-content">
    <button id="close-modal">X</button>
    <p>Customize your outfit here!</p>
    <div id="skin-options">
      <div class="skin-option selected">
        <div class="points">Free</div>
        <div class="checkmark"></div>
      </div>
      <div class="skin-option">
        <div class="points">200</div>
        <div class="checkmark"></div>
      </div>
      <div class="skin-option">
        <div class="points">500</div>
        <div class="checkmark"></div>
      </div>
      <div class="skin-option">
        <div class="points">1000</div>
        <div class="checkmark"></div>
      </div>
      <div class="skin-option">
        <div class="points">1500</div>
        <div class="checkmark"></div>
      </div>
      <div class="skin-option">
        <div class="points">2000</div>
        <div class="checkmark"></div>
      </div>
    </div>
    <button id="confirm-button">Confirm</button>
  </div>
</div>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/bringitinguys.mp3'); // Change path as needed
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


<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const roomImage = new Image();
roomImage.src = '{{site.baseurl}}/images/worldbackground1.png';

const spriteImages = [
  'https://i.postimg.cc/PxDYNLjG/Default.png', // Default Character
  'https://i.postimg.cc/C5gp0YzS/True-Gold-Melodie.png', // Melodie
  'https://i.postimg.cc/K8wLmvh6/Dialga.png', // Dialga
  'https://i.postimg.cc/VsKW3w58/Jett.png', // Jett
  'https://i.postimg.cc/VsF0hWG0/Goku.png', // Goku
  'https://i.postimg.cc/rygC4TLH/Boss-Bandit.png'  // Boss Bandit
];

let currentSpriteIndex = 0;
const spriteImage = new Image();
spriteImage.src = spriteImages[currentSpriteIndex];

const objectImages = {
   outbreak: '{{site.baseurl}}/images/icon1.png', // left 1
   building: '{{site.baseurl}}/images/icon2.png', // left 2
   editing: '{{site.baseurl}}/images/icon3.png', // left 3
   blackjack: '{{site.baseurl}}/images/icon4.png', // left 4
   exploration: '{{site.baseurl}}/images/icon5.png', // left 5
   adventure: '{{site.baseurl}}/images/icon6.png', // left 6
   racing: '{{site.baseurl}}/images/icon7.png', // top 1
   party: '{{site.baseurl}}/images/icon8.png', // top 2
   flappy: '{{site.baseurl}}/images/icon9.png', // top 3
   pacman: '{{site.baseurl}}/images/icon10.png', // top 4
   slot: '{{site.baseurl}}/images/icon11.png', // top 5
   farming: '{{site.baseurl}}/images/icon12.png', // top 6
   battle: '{{site.baseurl}}/images/icon13.png', // top 7
   tests: '{{site.baseurl}}/images/icon14.png', // top 8
   stealth: '{{site.baseurl}}/images/icon15.png', // top 9
   strategy: '{{site.baseurl}}/images/icon16.png', // bottom 1
   survive: '{{site.baseurl}}/images/icon17.png', // bottom 2
   simulation: '{{site.baseurl}}/images/icon18.png', // bottom 3
   tennis: '{{site.baseurl}}/images/icon19.png', // bottom 4
   tower: '{{site.baseurl}}/images/icon20.png', // bottom 5
   clicker: '{{site.baseurl}}/images/icon21.png', // bottom 6
   skin: '{{site.baseurl}}/images/icon22.png', // right 1
   aboutus: '{{site.baseurl}}/images/icon23.png', // right 2
   outline: '{{site.baseurl}}/images/icon24.png', // right 3
   format: '{{site.baseurl}}/images/icon25.png', // right 4
   jump: '{{site.baseurl}}/images/icon26.png', // middle 1
   pack: '{{site.baseurl}}/images/icon27.png', // middle 2
   skirmish: '{{site.baseurl}}/images/icon28.png' // middle 3
};


const loadedObjectImages = {};
for (const game in objectImages) {
  const img = new Image();
  img.src = objectImages[game];
  loadedObjectImages[game] = img;
}

const player = {
  x: 445,
  y: 470,
  width: 75,
  height: 75,
  speed: 4
};

const keys = {};

const objects = [
  { x: 95, y: 250, width: 40, height: 40, game: 'building' }, // left 2
  { x: 850, y: 225, width: 40, height: 40, game: 'editing' }, // left 3
  { x: 680, y: 540, width: 40, height: 40, game: 'blackjack' } // left 4
  ];

const walls = [
  { x: 0, y: 0, width: 25, height: 720 }, 
  { x: 0, y: 0, width: 960, height: 25 }, 
  { x: 935, y: 0, width: 25, height: 720 }, 
  { x: 0, y: 695, width: 960, height: 25 },
];

const borderThickness = 10;
walls.push(
{ x: 0, y: 0, width: canvas.width, height: borderThickness }, // top
{ x: 0, y: canvas.height - borderThickness, width: canvas.width, height: borderThickness }, // bottom
{ x: 0, y: 0, width: borderThickness, height: canvas.height }, // left
{ x: canvas.width - borderThickness, y: 0, width: borderThickness, height: canvas.height } // right
);

const topRightBox = { x: 675, y: 500, width: 40, height: 40 }; 
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
        case 'pacman':
          window.location.href = '{{site.baseurl}}/pacman';
          break;
        case 'slot':
          window.location.href = '{{site.baseurl}}/slot';
          break;
        case 'farming':
          window.location.href = '{{site.baseurl}}/farming';
          break;
        case 'tennis':
          window.location.href = '{{site.baseurl}}/tennis';
          break;
        case 'tower':
          window.location.href = '{{site.baseurl}}/tower';
          break;
        case 'format':
          window.location.href = '{{site.baseurl}}/format';
          break;  
        case 'racing':
          window.location.href = '{{site.baseurl}}/racing';
          break;
        case 'party':
          window.location.href = '{{site.baseurl}}/party';
          break; 
        case 'flappy':
          window.location.href = '{{site.baseurl}}/flappy';
          break;
        case 'battle':
          window.location.href = '{{site.baseurl}}/battle';
          break;
        case 'tests':
          window.location.href = '{{site.baseurl}}/tests';
          break;
        case 'stealth':
          window.location.href = '{{site.baseurl}}/stealth';
          break;  
        case 'strategy':
          window.location.href = '{{site.baseurl}}/strategy';
          break;
        case 'survive':
          window.location.href = '{{site.baseurl}}/survive';
          break;
        case 'jump':
          window.location.href = '{{site.baseurl}}/jump';
          break;
        case 'pack':
          window.location.href = '{{site.baseurl}}/pack';
          break;
        case 'skirmish':
          window.location.href = '{{site.baseurl}}/skirmish';
          break;      
        case 'simulation':
          window.location.href = '{{site.baseurl}}/simulation';
          break;                       
        case 'clicker':
          window.location.href = '{{site.baseurl}}/clicker';
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

  const baseWidth = 40 * 0.9; 
  const baseHeight = 40 * 0.9; 
  const scaledWidth = baseWidth * 3; 
  const scaledHeight = baseHeight * 3; 

  objects.forEach(obj => {
    let img = loadedObjectImages[obj.game];
    if (img && img.complete && img.naturalWidth !== 0) {
      let scaledWidth = 40 * 0.9 * 3; 
      let scaledHeight = 40 * 0.9 * 3;

      if (obj.game === 'blackjack') { 
        scaledWidth *= 1.3;
        scaledHeight *= 1.3;
      } else if (obj.game === 'editing') { 
        scaledWidth *= 1.1;
        scaledHeight *= 1.1;
      } else if (obj.game === 'adventure') { 
        scaledWidth *= 0.9;
        scaledHeight *= 0.9;
      } else if (obj.game === 'outline') { 
        scaledWidth *= 1.8;
        scaledHeight *= 1.8;
      } else if (obj.game === 'building') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;
      } else if (obj.game === 'pacman') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;
      } else if (obj.game === 'slot') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;
      } else if (obj.game === 'farming') { 
        scaledWidth *= 0.8;
        scaledHeight *= 0.8;
      } else if (obj.game === 'tennis') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;
      } else if (obj.game === 'format') { 
        scaledWidth *= 0.6;
        scaledHeight *= 0.6;  
      } else if (obj.game === 'racing') { 
        scaledWidth *= 0.8;
        scaledHeight *= 0.8; 
      } else if (obj.game === 'party') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7; 
      } else if (obj.game === 'flappy') { 
        scaledWidth *= 1.2;
        scaledHeight *= 1.2;
      } else if (obj.game === 'stealth') { 
        scaledWidth *= 0.6;
        scaledHeight *= 0.6;  
      } else if (obj.game === 'battle') { 
        scaledWidth *= 0.5;
        scaledHeight *= 0.5;
      } else if (obj.game === 'strategy') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;    
      } else if (obj.game === 'survive') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;  
      } else if (obj.game === 'tests') { 
        scaledWidth *= 0.8;
        scaledHeight *= 0.8; 
      } else if (obj.game === 'jump') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;  
      } else if (obj.game === 'pack') { 
        scaledWidth *= 0.6;
        scaledHeight *= 0.6;
      } else if (obj.game === 'skirmish') { 
        scaledWidth *= 0.8;
        scaledHeight *= 0.8;            
      } else if (obj.game === 'simulation') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;       
      } else if (obj.game === 'clicker') { 
        scaledWidth *= 0.8;
        scaledHeight *= 0.8;
      }

      const offsetX = (scaledWidth - obj.width) / 2; 
      const offsetY = (scaledHeight - obj.height) / 2; 
      ctx.drawImage(img, obj.x - offsetX, obj.y - offsetY, scaledWidth, scaledHeight);
    } else {
      ctx.fillStyle = 'blue';
      ctx.fillRect(
        obj.x - (scaledWidth - obj.width) / 2,
        obj.y - (scaledHeight - obj.height) / 2,
        scaledWidth,
        scaledHeight
      ); 
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
  skinOptions.forEach(opt => opt.classList.remove('selected'));
  skinOptions[confirmedSelection].classList.add('selected');
  skinModal.style.display = 'none';
  isModalOpen = false; 
});

confirmButton.addEventListener('click', () => {
  skinOptions.forEach((option, index) => {
    if (option.classList.contains('selected')) {
      confirmedSelection = index;
      currentSpriteIndex = index;
      spriteImage.src = spriteImages[currentSpriteIndex];
    }
  });
  skinModal.style.display = 'none';
  isModalOpen = false; 
});

const skinOptions = document.querySelectorAll('.skin-option');
let confirmedSelection = 0; 

skinOptions.forEach((option, index) => {
  option.addEventListener('click', () => {
    skinOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
  });

  if (index === 0) {
    option.classList.add('selected');
  }
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