---
layout: bootstrap
title: Strategy
description: Strategy Game
permalink: /strategy
Author: Zach
---

<canvas id="gameCanvas" width="900" height="450" style="border:1px solid #333; display:block; margin:auto;"></canvas>
<button id="restartBtn" style="display:none; margin:auto; display:block;">Restart</button>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/15delfinosquare.mp3');
music.loop = true;
music.volume = 0.5;
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);

// --- Game Setup ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load Images
const birdImg = new Image(); birdImg.src = "{{site.baseurl}}/images/item1.png";
const enemyImg = new Image(); enemyImg.src = "{{site.baseurl}}/images/item2.png";
const tntImg = new Image(); tntImg.src = "{{site.baseurl}}/images/item3.png";
const woodImg = new Image(); woodImg.src = "{{site.baseurl}}/images/item4.png";
const bgImg = new Image(); bgImg.src = "{{site.baseurl}}/images/item5.png";

// Game Variables
let gravity = 0.5;
let launched = false;
let dragging = false;
let gameEnded = false;
let starsEarned = 0;

const bird = {
  x: 150, y: 300, radius: 20,
  vx: 0, vy: 0,
  img: birdImg,
  dragStart: null,
  reset() {
    this.x = 150; this.y = 300;
    this.vx = 0; this.vy = 0;
    launched = false;
    dragging = false;
    gameEnded = false;
    starsEarned = 0;
    document.getElementById('restartBtn').style.display = 'none';
    setupGame();
  }
};

let enemies = [];
let blocks = [];
let tnts = [];

// Setup Game Elements
function setupGame() {
  enemies = [
    { x: 700, y: 360, w: 40, h: 40, alive: true, img: enemyImg },
    { x: 750, y: 360, w: 40, h: 40, alive: true, img: enemyImg }
  ];

  blocks = [];
  tnts = [];
  let blockCount = 0;
  for (let i = 0; i < 10; i++) {
    blocks.push({ x: 600, y: 380 - i * 20, w: 100, h: 20, broken: false, img: woodImg });
    blockCount++;
    if (blockCount % 10 === 0) {
      tnts.push({ x: 600, y: 380 - (i + 1) * 20, w: 30, h: 30, exploded: false, img: tntImg });
    }
  }
}

setupGame();

// Input
canvas.addEventListener("mousedown", (e) => {
  if (!launched && !gameEnded) {
    let dx = e.offsetX - bird.x;
    let dy = e.offsetY - bird.y;
    if (Math.sqrt(dx * dx + dy * dy) < bird.radius) {
      dragging = true;
      bird.dragStart = { x: e.offsetX, y: e.offsetY };
    }
  }
});
canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    bird.dragStart = { x: e.offsetX, y: e.offsetY };
  }
});
canvas.addEventListener("mouseup", (e) => {
  if (dragging) {
    dragging = false;
    let dx = bird.x - e.offsetX;
    if (dx > 0) {
      launched = true;
      bird.vx = dx * 0.2;
      bird.vy = (bird.y - e.offsetY) * 0.2;
    }
  }
});

document.getElementById('restartBtn').addEventListener('click', () => {
  bird.reset();
});

// Collision Detection
function checkCollision(a, b) {
  return a.x < b.x + b.w && a.x + bird.radius * 2 > b.x &&
         a.y < b.y + b.h && a.y + bird.radius * 2 > b.y;
}

function explodeTNT(tnt) {
  tnt.exploded = true;
  enemies.forEach(e => {
    if (Math.abs(bird.x - e.x) < 80 && Math.abs(bird.y - e.y) < 80) e.alive = false;
  });
  blocks.forEach(b => {
    if (Math.abs(bird.x - b.x) < 60 && Math.abs(bird.y - b.y) < 60) b.broken = true;
  });
}

// Game Loop
function update() {
  if (launched && !gameEnded) {
    bird.vy += gravity;
    bird.x += bird.vx;
    bird.y += bird.vy;

    // ground bounce
    if (bird.y + bird.radius > canvas.height) {
      bird.y = canvas.height - bird.radius;
      bird.vy *= -0.3;
      bird.vx *= 0.6;
    }

    // enemy hit
    enemies.forEach(e => {
      if (e.alive && checkCollision(bird, e)) e.alive = false;
    });

    // tnt hit
    tnts.forEach(tnt => {
      if (!tnt.exploded && checkCollision(bird, tnt)) explodeTNT(tnt);
    });

    // block break
    blocks.forEach(b => {
      if (!b.broken && checkCollision(bird, b)) b.broken = true;
    });

    // stop if speed too low
    if (Math.abs(bird.vx) < 0.1 && Math.abs(bird.vy) < 0.1 && bird.y + bird.radius >= canvas.height) {
      setTimeout(() => endGame(), 1500);
    }
  }
}

function endGame() {
  gameEnded = true;
  let destroyedEnemies = enemies.filter(e => !e.alive).length;
  let destroyedBlocks = blocks.filter(b => b.broken).length;

  if (destroyedEnemies === 0 && destroyedBlocks === 0) starsEarned = 0;
  else if (destroyedEnemies === enemies.length && destroyedBlocks === blocks.length) starsEarned = 3;
  else if (destroyedEnemies === enemies.length) starsEarned = 2;
  else starsEarned = 1;

  document.getElementById('restartBtn').style.display = 'block';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Draw Slingshot Line
  if (dragging) {
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bird.x, bird.y);
    ctx.lineTo(bird.dragStart.x, bird.dragStart.y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw Bird
  ctx.drawImage(bird.img, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);

  // Draw Enemies
  enemies.forEach(e => {
    if (e.alive)
      ctx.drawImage(e.img, e.x, e.y, e.w, e.h);
  });

  // Draw Blocks
  blocks.forEach(b => {
    if (!b.broken)
      ctx.drawImage(b.img, b.x, b.y, b.w, b.h);
  });

  // Draw TNT
  tnts.forEach(tnt => {
    if (!tnt.exploded)
      ctx.drawImage(tnt.img, tnt.x, tnt.y, tnt.w, tnt.h);
  });

  // Draw Stars
  if (gameEnded) {
    ctx.font = "32px Arial";
    ctx.fillStyle = "gold";
    ctx.fillText(`Stars Earned: ${starsEarned}`, canvas.width / 2 - 100, 50);
  }

  update();
  requestAnimationFrame(draw);
}

draw();
</script>
