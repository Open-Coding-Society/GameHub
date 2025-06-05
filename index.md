---
layout: post
title: Game Hub
description: >
  <div style="text-align: center; font-family: 'Open Sans', sans-serif;">
    Move your character around with WASD to enter different worlds, minigames, and experiences on this map.<br>
    Click Game Hub in the top left to go back to this page.
  </div>
Author: Zach, Ian, Aarush, Lars
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
    align-items: center;
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

  .npc-modal-btn {
    background: #d4af37;
    color: white;
    border: none;
    padding: 15px 30px;
    cursor: pointer;
    font-size: 1.2em;
    border-radius: 10px;
    text-transform: uppercase;
    margin: 0 0 0 0;
    min-width: 120px;
    transition: background 0.2s;
  }
  #npc-talk-btn.npc-modal-btn {
    background: #0074D9;
  }
  #npc-cancel-btn.npc-modal-btn {
    background: #333;
  }
  .npc-modal-btn:not(:last-child) {
    margin-right: 0;
  }

  /* Add styles for the navigation popup */
.popup-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 260px;
  background: #fff;
  color: #222;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  z-index: 9999;
  padding: 24px 20px 16px 20px;
  text-align: left;
  font-size: 1.1em;
  display: none;
}
.popup-modal h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.15em;
  font-weight: bold;
}
.popup-modal ul {
  padding-left: 18px;
  margin-bottom: 0;
}
</style>

<div id="loading">Loading game assets...</div>
<div id="canvas-container">
  <div id="points-display">Points: 0</div>
  <canvas id="gameCanvas" width="960" height="720"></canvas>
</div>

<!-- Skin Modal -->
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
  <div style="display:flex; justify-content:center; gap:20px; margin-top:10px;">
    <button id="npc-enter-btn" class="npc-modal-btn">Enter</button>
    <button id="npc-talk-btn" class="npc-modal-btn">Talk</button>
    <button id="npc-cancel-btn" class="npc-modal-btn">Cancel</button>
  </div>
</div>

<!-- Navigation Popup -->
<div id="navPopup" class="popup-modal">
  <h4>Navigation Help</h4>
  <ul style="margin-bottom:0;">
     <li><span style="color:gray;">Movement</span>: Use the <strong> WASD </strong>keys to move</li>
      <li><span style="color:green;">Menu</span>: Click the <strong> Game Hub </strong>button in the top left to go to this page</li>
      <li><span style="color:#003366;">Search</span>: Click the <strong> Search </strong>button in the top right to find help and planning pages</li>
      <li><span style="color:purple;">Cosmetics</span>: Go to the <strong> Clotheshanger </strong>above this button and click confirm to change your outfit</li>
      <li><span style="color:orange;">Worlds</span>: Click <strong> Cancel </strong>to move away from the world, talk to see different messages, and enter to go into the world</li>
      <li><span style="color:red;">Home Button</span>: Click the <strong> Home </strong>icon in the top right of the worlds pages to go back to this page</li>
      <li><span style="color:#00bfff;">Music</span>: Find the <strong> Music </strong>note in the top/bottom right of your screen to mute, fast forward, or pause the music</li>
      <li><span style="color:#FFC0CB;">Form</span>: Scan the <strong> QR </strong>code below or click the link here to respond to our google form: <a href="https://docs.google.com/forms/d/e/1FAIpQLSdRLBVL1xN1hCwacCcyTCNTNFdA7TTKn8pG9Wqpx25znM590A/viewform?usp=sharing&ouid=104967620423493227675" target="_blank" rel="noopener noreferrer">Google Form</a></li>
  </ul>
  <div style="text-align:center; margin-top:12px; position:relative;">
    <img width="220" alt="Google Form" src="https://github.com/user-attachments/assets/1097107f-c5ac-4a91-8384-6a9b6043c2de" style="position:relative; left:300px;" />
  </div>
</div>

<script>
function closePopup(id) {
  const popup = document.getElementById(id);
  if (popup) {
    popup.style.display = 'none';
    // Do not set isModalOpen here!
  }
}

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
   world8: '{{site.baseurl}}/images/symbol8.png', // top 3 
   skin: '{{site.baseurl}}/images/icon22.png', // skin
   nav: '{{site.baseurl}}/images/icon34.png', // navigation
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

const SPAWN_POINT = { x: 400, y: 325 };


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
  { x: 330, y: 100, width: 40, height: 40, game: 'world8' }, // top 3
  { x: 730, y: 410, width: 40, height: 40, game: 'skin' }, // skin icon
  { x: 740, y: 590, width: 40, height: 40, game: 'nav' } // navigation
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

const topRightBox = { x: 730, y: 410, width: 40, height: 40 }; 
const skinModal = document.getElementById('skin-modal');
const closeModal = document.getElementById('close-modal');
const confirmButton = document.getElementById('confirm-button');
let isModalOpen = false; 
let hasLeftSkinBox = true; 

// --- NPC Modal logic and world mapping with personality, game hints, and dialogue ---
const worldNPCs = {
  world0: {
    message: "👨‍🔬 Professor Oak: Welcome to Bioverse Central! Explore options like skins, help, outlines, and more to begin your journey.",
    url: '{{site.baseurl}}/world0',
    dialogue: [
      "Professor Oak: This is your launch pad to all worlds.",
      "Professor Oak: Don't forget to check out the About Us section!",
      "Professor Oak: Need help? Click the help page for guidance.",
      "Professor Oak: Skins can be changed here. Style matters!",
      "Professor Oak: Come back often for new updates and info!"
    ]
  },
  world1: {
    message: "🧼 Mr. Bubbles: Welcome to Genomic Architects! Build DNA, edit genes, or relax with a game of blackjack.",
    url: '{{site.baseurl}}/world1',
    dialogue: [
      "Mr. Bubbles: DNA is like a recipe—let’s get creative!",
      "Mr. Bubbles: Ever played blackjack with biology on the line?",
      "Mr. Bubbles: Editing genes? Don’t forget the base pairs!",
      "Mr. Bubbles: Build something groundbreaking today.",
      "Mr. Bubbles: The genome is your playground."
    ]
  },
  world2: {
    message: "🧬 Medic: Welcome to Pathogen Patrol! Predict outbreaks, explore organelles, and play through scientific adventures.",
    url: '{{site.baseurl}}/world2',
    dialogue: [
      "Medic: Every outbreak starts somewhere. Can you stop it?",
      "Medic: Learn the parts of a cell on your next exploration.",
      "Medic: Adventure awaits those curious about biotech!",
      "Medic: Each pathogen behaves differently—stay sharp!",
      "Medic: Ready to patrol the microscopic world?"
    ]
  },
  world3: {
    message: "🦾 Spring Man: Welcome to Arcade Rush! Master fast-paced classics like Pac-Man, Flappy Bird, and Geometry Dash.",
    url: '{{site.baseurl}}/world3',
    dialogue: [
      "Spring Man: Think fast, tap faster!",
      "Spring Man: Reflexes make the difference here!",
      "Spring Man: Want the high score? You've gotta grind!",
      "Spring Man: Just one more try—this could be it!",
      "Spring Man: Classic games, modern thrill."
    ]
  },
  world4: {
    message: "🍌 Peely: Welcome to Party Time! Spin the slot machine, open digital packs, or jump into a party game.",
    url: '{{site.baseurl}}/world4',
    dialogue: [
      "Peely: It's always party time somewhere!",
      "Peely: Luck and laughs await in the blood cell slots!",
      "Peely: Did you pull a legendary? Show me!",
      "Peely: Party games are best with friends!",
      "Peely: Let’s make it a celebration!"
    ]
  },
  world5: {
    message: "🪖 Master Chief: Welcome to Combat Zone. Enter the skirmish, plan your 5v5 tactics, or survive the swarm.",
    url: '{{site.baseurl}}/world5',
    dialogue: [
      "Master Chief: Load up—your squad is counting on you.",
      "Master Chief: Victory comes to those who adapt.",
      "Master Chief: Pick your role and hold the line!",
      "Master Chief: Every battle teaches something new.",
      "Master Chief: Stay alert. The storm is closing in."
    ]
  },
  world6: {
    message: "🌸 Ezili: Welcome to Strategy Core! Fire up the tower defense, simulate a new life, or sling some birds.",
    url: '{{site.baseurl}}/world6',
    dialogue: [
      "Ezili: Strategy is about patience and precision.",
      "Ezili: Simulations are stories you write yourself.",
      "Ezili: Know your enemy, then plan your path.",
      "Ezili: Tower defense is all about timing.",
      "Ezili: Think, plan, win."
    ]
},
  world7: {
    message: "🥊 Matt: Welcome to Skill & React! It's table tennis, crossy road, and reflex challenges galore.",
    url: '{{site.baseurl}}/world7',
    dialogue: [
      "Matt: Test your reflexes—I'm not going easy on you!",
      "Matt: Beat your best time and come back for more!",
      "Matt: Every second counts in the Skill Zone.",
      "Matt: Stay sharp. It’s all about timing.",
      "Matt: Are you quick enough to top the leaderboard?"
    ]
  },
  world8: {
    message: "🏁 Octane: Welcome to Click & Collect! Farm like a pro, race like a champ, and click like there’s no tomorrow.",
    url: '{{site.baseurl}}/world8',
    dialogue: [
      "Octane: Click fast, collect faster!",
      "Octane: Time to grind—farm, race, repeat!",
      "Octane: This is your speed zone!",
      "Octane: Nothing beats a clean drift and a full harvest!",
      "Octane: Turbo mode: ON!"
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
let npcCooldown = false;
let lastNPCInteractionTime = 0;
let typewriterTimeout = null;
let isTyping = false;



function typeDialogue(text, callback) {
  npcDialogue.textContent = "";
  let i = 0;
  isTyping = true;

  function typeNext() {
    if (i < text.length) {
      npcDialogue.textContent += text[i];
      i++;
      typewriterTimeout = setTimeout(typeNext, 18); // Adjust speed here (ms per char)
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }
  typeNext();
}

function showNPCModal(worldKey) {
  pendingWorld = worldKey;
  npcMessage.textContent = worldNPCs[worldKey].message;
  npcDialogue.textContent = "";
  npcDialogueIndex = 0;
  npcModal.style.display = 'block';
  npcModalOpen = true;
  // Start first line animated
  if (worldNPCs[worldKey].dialogue && worldNPCs[worldKey].dialogue.length > 0) {
    typeDialogue(worldNPCs[worldKey].dialogue[0]);
    npcDialogueIndex = 1;
  }
}


npcTalkBtn.onclick = function() {
  if (isTyping) {
    // Instantly finish current line if typing
    clearTimeout(typewriterTimeout);
    const lines = worldNPCs[pendingWorld].dialogue;
    npcDialogue.textContent = lines[(npcDialogueIndex - 1) % lines.length];
    isTyping = false;
    return;
  }
  if (pendingWorld && worldNPCs[pendingWorld] && worldNPCs[pendingWorld].dialogue) {
    const lines = worldNPCs[pendingWorld].dialogue;
    typeDialogue(lines[npcDialogueIndex % lines.length]);
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

npcCancelBtn.addEventListener('click', () => {
  npcModal.style.display = 'none';
  npcModalOpen = false;
  pendingWorld = null;
  npcDialogueIndex = 0;
  clearTimeout(typewriterTimeout);
  isTyping = false;
});

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

  // Only lock movement for skin modal or NPC modal, not for nav modal
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
    if (obj.game === 'skin' && isColliding(player, obj)) {
      if (hasLeftSkinBox && !isModalOpen) {
        skinModal.style.display = 'block';
        isModalOpen = true;
        hasLeftSkinBox = false;
      }
    } else if (obj.game !== 'skin' && worldNPCs[obj.game] && isColliding(player, obj)) {
      collidedWorld = obj.game;
    }
  });

  // Handle leaving skin box
  const skinObj = objects.find(o => o.game === 'skin');
  if (!isColliding(player, skinObj)) {
    hasLeftSkinBox = true;
  }

  // Handle leaving navigation box
  // No longer lock movement for nav modal

  if (collidedWorld && !npcModalOpen) {
    resolveTouch(player, objects.find(o => o.game === collidedWorld));
    showNPCModal(collidedWorld);
  }

  if (!npcModalOpen && !isModalOpen) {
    handleNavInteraction();
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

  // Draw player base sprite
  ctx.drawImage(spriteImage, player.x, player.y, player.width, player.height);

  // Draw world objects
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
      } else if (obj.game === 'nav') { 
        scaledWidth *= 0.7;
        scaledHeight *= 0.7;
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

/* Skin Modal Logic (from world0) */
const skinOptions = document.querySelectorAll('.skin-option');
let confirmedSelection = 0; 

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

skinOptions.forEach((option, index) => {
  option.addEventListener('click', () => {
    skinOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
  });

  if (index === 0) {
    option.classList.add('selected');
  }
});

// Navigation popup logic
const navPopup = document.getElementById('navPopup');
const navObject = objects.find(o => o.game === 'nav'); // Find the navigation object

// Add interaction logic for the navigation icon
function handleNavInteraction() {
  if (isColliding(player, navObject) && navPopup.style.display !== 'block') {
    navPopup.style.display = 'block';
    // Do NOT set isModalOpen here, so movement is never locked for nav popup
  }
  // Auto-close nav popup if player leaves the nav icon area
  if (!isColliding(player, navObject) && navPopup.style.display === 'block') {
    navPopup.style.display = 'none';
  }
};