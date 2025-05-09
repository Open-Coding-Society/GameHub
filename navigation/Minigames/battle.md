---
layout: base
title: Battle
description: Battle Game (like Brawl Stars)
permalink: /battle
Author: Ian
---

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Battle Game</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJX3eE+2PHZHHWwI5T9K7+60b7Z6EK+NK+Gq5Vb3IuXqztmXM7MNBzH3H8YZ" crossorigin="anonymous">
<style>
  body {
    background: #222;
    margin: 0;
    overflow: hidden;
    height: 100vh;
  }
 #gameCanvas {
    background: #333;
    display: block;
    margin: auto;
    border: 3px solid #fff;
    width: 100%;
    height: 100%;
  }
.info {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    font-family: Arial, sans-serif;
  }
.info p {
    margin: 5px 0;
    font-size: 18px;
  }
h2 {
    font-size: 2rem;
    color: white;
  }
.start-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 24px;
  }
.start-menu button {
    padding: 15px 30px;
    font-size: 18px;
  }
#victory {
    display: none;
    color: lime;
    font-size: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: Arial, sans-serif;
  }
#loseMenu {
    display: none;
    color: white;
    font-size: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
#loseMenu button {
    padding: 10px 20px;
    font-size: 18px;
  }
/* Confetti styles */
  .confetti {
    position: absolute;
    background-color: #ff0;
    width: 10px;
    height: 10px;
    opacity: 0.8;
    border-radius: 50%;
    pointer-events: none;
    animation: confetti-fall 0.25s forwards;
  }
@keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(300px) rotate(360deg);
      opacity: 0;
    }
  }
</style>

<!-- Start Menu -->
<div id="startMenu" class="start-menu">
<h2>Brawl Stars Mini Game</h2>
<button id="startButton" class="btn btn-primary btn-lg">Start Game</button>
</div>

<!-- Game Area -->
<div id="gameArea" style="display:none;">
<div class="info">
  <p id="score">Score: 0</p>
  <p id="timer">Time: 0s</p>
</div>
<p id="victory">You Win!</p>


<canvas id="gameCanvas"></canvas>
</div>

<!-- Loose Menu -->
<div id="loseMenu">
<p>You Lost! Do you want to restart?</p>
<button id="restartButton" class="btn btn-danger">Restart</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pzjw8f+ua7Kw1TIq0n5gpaMd5nE04Sbq5V5lGzF6pg4+z+QZp2RTfzm++66dF6F8" crossorigin="anonymous"></script>
<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const PLAYER_DAMAGE = 4000;
const NPC_DAMAGE = 1000;
const BASE_HP = 8000;
const MOVE_SPEED = 3;
let score = 0, timer = 0, playerHealth = BASE_HP;
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const victoryDisplay = document.getElementById('victory');
const loseMenu = document.getElementById('loseMenu');
const restartButton = document.getElementById('restartButton');
// Adjust canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
class Entity {
  constructor(x, y, color, damage, isNPC = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 20;
    this.maxHp = BASE_HP + (isNPC ? 2000 : 0);
    this.hp = this.maxHp;
    this.cooldown = 0;
    this.vx = 0;
    this.vy = 0;
    this.isDead = false;
    this.alpha = 1;
    this.isNPC = isNPC;
    this.damage = damage;
  }
draw() {
    if (this.isDead) {
      this.alpha -= 0.02;
      if (this.alpha <= 0) return;
    }
ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
ctx.fillStyle = 'red';
    ctx.fillRect(this.x - 25, this.y - 35, 50, 6);
    ctx.fillStyle = 'lime';
    const hpPercent = Math.max(0, this.hp / this.maxHp);
    ctx.fillRect(this.x - 25, this.y - 35, 50 * hpPercent, 6);
    ctx.globalAlpha = 1.0;
  }
move() {
    this.x += this.vx;
    this.y += this.vy;
    this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
  }
distanceTo(other) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }
}
class Bullet {
  constructor(x, y, dx, dy, angle, owner) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.angle = angle;
    this.owner = owner;
    this.length = 30;
    this.width = 8;
  }
update() {
    this.x += this.dx;
    this.y += this.dy;
  }
draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.owner.color;
    ctx.fillRect(-this.length / 2, -this.width / 2, this.length, this.width);
    ctx.restore();
  }
collidesWith(entity) {
    const dist = Math.hypot(this.x - entity.x, this.y - entity.y);
    return dist < entity.radius + this.length / 2;
  }
}
const player = new Entity(400, 300, 'deepskyblue', PLAYER_DAMAGE);
let npcs = spawnNPCs();
const bullets = [];
function spawnNPCs() {
  return [
    new Entity(100, 100, 'red', NPC_DAMAGE, true),
    new Entity(700, 100, 'orange', NPC_DAMAGE, true),
    new Entity(400, 500, 'purple', NPC_DAMAGE, true),
  ];
}
function autoAimShot(shooter, targets) {
  if (shooter.cooldown > 0 || shooter.hp <= 0) return;
let nearest = null, minDist = Infinity;
  for (let t of targets) {
    if (t.hp > 0 && !t.isDead) {
      const dist = shooter.distanceTo(t);
      if (dist < minDist) {
        minDist = dist;
        nearest = t;
      }
    }
  }
if (nearest) {
    const dx = nearest.x - shooter.x;
    const dy = nearest.y - shooter.y;
    const len = Math.hypot(dx, dy);
    const speed = 6;
    const angle = Math.atan2(dy, dx);
    bullets.push(new Bullet(
      shooter.x, shooter.y,
      (dx / len) * speed,
      (dy / len) * speed,
      angle,
      shooter
    ));
    shooter.cooldown = 30;
  }
}
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'q') {
    autoAimShot(player, npcs);
  }
});
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
function updateHUD() {
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${Math.floor(timer)}s`;
}
function drawAimArrow() {
  let nearest = null, minDist = Infinity;
  for (let t of npcs) {
    if (t.hp > 0 && !t.isDead) {
      const dist = player.distanceTo(t);
      if (dist < minDist) {
        minDist = dist;
        nearest = t;
      }
    }
  }
if (nearest) {
    const dx = nearest.x - player.x;
    const dy = nearest.y - player.y;
    const angle = Math.atan2(dy, dx);
ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(30, 0);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.stroke();
ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(22, -6);
    ctx.lineTo(22, 6);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
  }
}
function createConfettiEffect(x, y) {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${x + Math.random() * 200 - 100}px`;
    confetti.style.top = `${y + Math.random() * 100 - 50}px`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(confetti);
setTimeout(() => confetti.remove(), 250); // Remove after 0.25 seconds
  }
}
function checkWinCondition() {
  if (npcs.every(npc => npc.isDead)) {
    victoryDisplay.style.display = 'block'; // Show victory message
    createConfettiEffect(canvas.width / 2, canvas.height / 2); // Confetti effect
    return true;
  }
  return false;
}
function checkLossCondition() {
  if (player.hp <= 0) {
    loseMenu.style.display = 'block'; // Show loss menu
    return true;
  }
  return false;
}
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
player.vx = player.vy = 0;
  if (keys['w']) player.vy = -MOVE_SPEED;
  if (keys['s']) player.vy = MOVE_SPEED;
  if (keys['a']) player.vx = -MOVE_SPEED;
  if (keys['d']) player.vx = MOVE_SPEED;
  player.move();
if (player.cooldown > 0) player.cooldown--;
  player.draw();
  drawAimArrow();
for (let npc of npcs) {
    if (npc.isDead) {
      npc.draw();
      continue;
    }
    if (npc.hp <= 0 && !npc.isDead) {
      npc.isDead = true;
      score++;
      continue;
    }
if (Math.random() < 0.05) {
      npc.vx = (Math.random() - 0.5) * MOVE_SPEED * 2;
      npc.vy = (Math.random() - 0.5) * MOVE_SPEED * 2;
    }
    npc.move();
if (npc.cooldown > 0) npc.cooldown--;
    if (Math.random() < 0.02) autoAimShot(npc, [player]);
    npc.draw();
  }
for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.update();
    b.draw();
if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
      continue;
    }
const targets = (b.owner === player) ? npcs : [player];
    for (let t of targets) {
      if (!t.isDead && t.hp > 0 && b.collidesWith(t)) {
        t.hp -= b.owner.damage;
        bullets.splice(i, 1);
        break;
      }
    }
  }
timer += 1 / 60;
  if (checkWinCondition() || checkLossCondition()) return; // Check if win or lose
updateHUD();
  requestAnimationFrame(update);
}
document.getElementById('startButton').addEventListener('click', () => {
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  update();
});
restartButton.addEventListener('click', () => {
  // Reset game state
  player.hp = BASE_HP;
  player.isDead = false;
  npcs = spawnNPCs();
  loseMenu.style.display = 'none';
  victoryDisplay.style.display = 'none';
  score = 0;
  timer = 0;
  update();
});
</script>