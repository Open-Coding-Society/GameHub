---
layout: post
title: Game Hub
description: >
  <div style="text-align: center; font-family: 'Open Sans', sans-serif;">
    Move your character around with WASD to enter different worlds, minigames, and experiences on this map.<br>
    Click Game Hub in the top left to go back to this page.
  </div>
Author: Lars, Zach & Aarush
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

<!-- NPC Modal for world entry with dialogue -->
<div id="npc-modal" style="display:none; position:fixed; top:30%; left:30%; width:40%; background:#001f3f; color:white; z-index:2000; border-radius:10px; text-align:center; padding:30px;">
  <div id="npc-message" style="font-size:1.5em; margin-bottom:20px;"></div>
  <div id="npc-dialogue" style="font-size:1.1em; margin-bottom:20px; min-height:40px;"></div>
  <button id="npc-talk-btn" style="background:#0074D9; color:white; border:none; padding:10px 20px; border-radius:10px; font-size:1em; cursor:pointer; margin-bottom:10px;">Talk</button>
  <br>
  <button id="npc-enter-btn" style="background:#d4af37; color:white; border:none; padding:15px 30px; border-radius:10px; font-size:1.2em; cursor:pointer;">Enter</button>
  <button id="npc-cancel-btn" style="background:#333; color:white; border:none; padding:10px 20px; border-radius:10px; font-size:1em; cursor:pointer; margin-left:20px;">Cancel</button>
</div>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/rooftoprun.mp3'); // Change path as needed
music.loop = true;
music.volume = 0.5;

// Ensure music starts on user interaction
function enableMusicPlayback() {
  music.play().catch(() => {
    console.error('Audio playback failed. Ensure user interaction occurs.');
  });
}

// Add event listeners for user interaction
document.addEventListener('click', enableMusicPlayback, { once: true });
document.addEventListener('keydown', enableMusicPlayback, { once: true });
</script>

<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const roomImage = new Image();
roomImage.src = 'https://i.postimg.cc/4xLtFzbV/Screenshot-2025-04-04-at-10-24-02-AM.png';

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
   world0: '{{site.baseurl}}/images/symbol0.png', // left 1
   world1: '{{site.baseurl}}/images/symbol1.png', // left 2
   world2: '{{site.baseurl}}/images/symbol2.png', // left 3
   world3: '{{site.baseurl}}/images/symbol3.png', // left 4
   world4: '{{site.baseurl}}/images/symbol4.png', // left 5
   world5: '{{site.baseurl}}/images/symbol5.png', // left 6
   world6: '{{site.baseurl}}/images/symbol6.png', // top 1
   world7: '{{site.baseurl}}/images/symbol7.png', // top 2
   world8: '{{site.baseurl}}/images/symbol8.png' // top 3 
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
  { x: 140, y: 140, width: 40, height: 40, game: 'world0', icon: true }, // left 1
  { x: 95, y: 300, width: 40, height: 40, game: 'world1' }, // left 2
  { x: 105, y: 450, width: 40, height: 40, game: 'world2' }, // left 3
  { x: 220, y: 580, width: 40, height: 40, game: 'world3' }, // left 4
  { x: 410, y: 580, width: 40, height: 40, game: 'world4' }, // left 5
  { x: 580, y: 580, width: 40, height: 40, game: 'world5' }, // left 6
  { x: 660, y: 250, width: 40, height: 40, game: 'world6' }, // top 1
  { x: 510, y: 100, width: 40, height: 40, game: 'world7' }, // top 2
  { x: 330, y: 100, width: 40, height: 40, game: 'world8' } // top 3

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
  { x: 0, y: 0, width: 75, height: 720 }, 
  { x: 0, y: 0, width: 960, height: 75 }, 
  { x: 885, y: 0, width: 75, height: 720 }, 
  { x: 0, y: 670, width: 690, height: 50 },
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

// --- NPC Modal logic and world mapping with personality, game hints, and dialogue ---
const worldNPCs = {
  world0: {
    message: "👨‍🔬 Professor Oak: Welcome to World 0, the Science Lab! Here you'll find quiz games and brain teasers. Ready to test your knowledge?",
    url: '{{site.baseurl}}/world0',
    dialogue: [
      "Professor Oak: Science is about curiosity! Ask me anything.",
      "Professor Oak: You can earn points by solving quizzes here.",
      "Professor Oak: If you get stuck, try talking to other NPCs for hints.",
      "Professor Oak: Remember, every mistake is a chance to learn!"
    ]
  },
  world1: {
    message: "🧙‍♂️ Merlin: Ah, World 1, the Realm of Magic! Puzzle games and logic await. Can you outsmart the enchanted riddles?",
    url: '{{site.baseurl}}/world1',
    dialogue: [
      "Merlin: Magic is just science we don't understand yet.",
      "Merlin: Some puzzles here require creative thinking.",
      "Merlin: If you need a hint, just ask!",
      "Merlin: May your mind be as sharp as your wand."
    ]
  },
  world2: {
    message: "🤠 Sheriff Bandit: Howdy, partner! World 2 is the Wild West Arcade. Fast-paced minigames and quick reflexes rule here. Saddle up?",
    url: '{{site.baseurl}}/world2',
    dialogue: [
      "Sheriff Bandit: Quick on the draw? You'll need it here!",
      "Sheriff Bandit: Try to beat your best time in the minigames.",
      "Sheriff Bandit: Don't forget to collect your rewards.",
      "Sheriff Bandit: If you lose, dust yourself off and try again!"
    ]
  },
  world3: {
    message: "🦸‍♀️ Captain Pixel: Welcome to World 3, the Hero's Arena! Battle games and action challenges await. Only the brave may enter!",
    url: '{{site.baseurl}}/world3',
    dialogue: [
      "Captain Pixel: Heroes never give up!",
      "Captain Pixel: Try different strategies to win battles.",
      "Captain Pixel: Power-ups can turn the tide in your favor.",
      "Captain Pixel: Remember, teamwork makes the dream work."
    ]
  },
  world4: {
    message: "👾 Glitch: World 4 is the Retro Zone! Classic arcade games and high scores. Can you beat the leaderboard?",
    url: '{{site.baseurl}}/world4',
    dialogue: [
      "Glitch: Retro games are all about skill and timing.",
      "Glitch: Watch out for hidden easter eggs!",
      "Glitch: High scores are meant to be broken.",
      "Glitch: Sometimes, the simplest games are the hardest."
    ]
  },
  world5: {
    message: "🌱 Farmer Willow: World 5 is the Farming Fields! Relax with simulation and strategy games. Ready to grow your skills?",
    url: '{{site.baseurl}}/world5',
    dialogue: [
      "Farmer Willow: Patience is the key to a good harvest.",
      "Farmer Willow: Try planning ahead for the best results.",
      "Farmer Willow: Take your time and enjoy the process.",
      "Farmer Willow: Every crop you grow brings you closer to mastery."
    ]
  },
  world6: {
    message: "🎾 Coach Ace: Welcome to World 6, the Sports Complex! Compete in tennis, soccer, and more. Are you game?",
    url: '{{site.baseurl}}/world6',
    dialogue: [
      "Coach Ace: Practice makes perfect!",
      "Coach Ace: Try to beat your own records.",
      "Coach Ace: Sportsmanship is just as important as winning.",
      "Coach Ace: Stay hydrated and have fun!"
    ]
  },
  world7: {
    message: "🧑‍🚀 Commander Nova: World 7 is the Space Frontier! Explore adventure and platformer games. Prepare for liftoff?",
    url: '{{site.baseurl}}/world7',
    dialogue: [
      "Commander Nova: The universe is full of secrets.",
      "Commander Nova: Explore every corner for hidden bonuses.",
      "Commander Nova: Gravity can be your friend or your foe.",
      "Commander Nova: Don't be afraid to take a leap of faith!"
    ]
  },
  world8: {
    message: "🐉 Elder Drakon: World 8, the Final Frontier! The toughest challenges and boss battles await. Only legends enter here!",
    url: '{{site.baseurl}}/world8',
    dialogue: [
      "Elder Drakon: Only the strongest survive here.",
      "Elder Drakon: Study your opponents for victory.",
      "Elder Drakon: Every defeat is a lesson.",
      "Elder Drakon: Prove yourself, and glory will be yours!"
    ]
  }
};

let pendingWorld = null; // Track which world the player is interacting with

const npcModal = document.getElementById('npc-modal');
const npcMessage = document.getElementById('npc-message');
const npcDialogue = document.getElementById('npc-dialogue');
const npcTalkBtn = document.getElementById('npc-talk-btn');
const npcEnterBtn = document.getElementById('npc-enter-btn');
const npcCancelBtn = document.getElementById('npc-cancel-btn');
let npcModalOpen = false;
let npcDialogueIndex = 0;

function showNPCModal(worldKey) {
  pendingWorld = worldKey;
  npcMessage.textContent = worldNPCs[worldKey].message;
  npcDialogue.textContent = ""; // Clear previous dialogue
  npcDialogueIndex = 0;
  npcModal.style.display = 'block';
  npcModalOpen = true;
}

npcTalkBtn.onclick = function() {
  if (pendingWorld && worldNPCs[pendingWorld] && worldNPCs[pendingWorld].dialogue) {
    const lines = worldNPCs[pendingWorld].dialogue;
    npcDialogue.textContent = lines[npcDialogueIndex % lines.length];
    npcDialogueIndex++;
  }
};

npcEnterBtn.onclick = function() {
  if (pendingWorld && worldNPCs[pendingWorld]) {
    window.location.href = worldNPCs[pendingWorld].url;
  }
};

npcCancelBtn.onclick = function() {
  npcModal.style.display = 'none';
  npcModalOpen = false;
  pendingWorld = null;
  npcDialogue.textContent = "";
  npcDialogueIndex = 0;
};

// Prevent player from overlapping with world object
function resolveTouch(player, obj) {
  // Simple axis-aligned separation
  const dx = (player.x + player.width / 2) - (obj.x + obj.width / 2);
  const dy = (player.y + player.height / 2) - (obj.y + obj.height / 2);
  const absDX = Math.abs(dx);
  const absDY = Math.abs(dy);

  if (absDX > absDY) {
    // Move horizontally
    if (dx > 0) player.x = obj.x + obj.width;
    else player.x = obj.x - player.width;
  } else {
    // Move vertically
    if (dy > 0) player.y = obj.y + obj.height;
    else player.y = obj.y - player.height;
  }
}

// --- MODIFIED update() function ---
function update() {
  let nextX = player.x;
  let nextY = player.y;

  if (!isModalOpen && !npcModalOpen) { 
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

  // World/NPC collision
  let collidedWorld = null;
  objects.forEach(obj => {
    if (worldNPCs[obj.game] && isColliding(player, obj)) {
      collidedWorld = obj.game;
    }
  });

  if (collidedWorld && !npcModalOpen) {
    // Move player back so they only touch, not overlap
    resolveTouch(player, objects.find(o => o.game === collidedWorld));
    showNPCModal(collidedWorld);
  }
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

      if (obj.game === 'world3') { 
        scaledWidth *= 0.9;
        scaledHeight *= 0.9;
      } else if (obj.game === 'world2') { 
        scaledWidth *= 0.9;
        scaledHeight *= 0.9;
      } else if (obj.game === 'world5') { 
        scaledWidth *= 0.9;
        scaledHeight *= 0.9;
      } else if (obj.game === 'outline') { 
        scaledWidth *= 1.8;
        scaledHeight *= 1.8;
      } else if (obj.game === 'world1') { 
        scaledWidth *= 0.9;
        scaledHeight *= 0.9;
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
      } else if (obj.game === 'world6') { 
        scaledWidth *= 0.8;
        scaledHeight *= 0.8; 
      } else if (obj.game === 'world7') { 
        scaledWidth *= 1.1;
        scaledHeight *= 1.1; 
      } else if (obj.game === 'world8') { 
        scaledWidth *= 0.9;
        scaledHeight *= 0.9;
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