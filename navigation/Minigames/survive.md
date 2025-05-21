---
layout: bootstrap
title: Survive
description: Survive Game 
permalink: /survive
Author: Ian
---

<h2>Zombie Survival</h2>
<p>Press <b>Q</b> to shoot. Use WASD to move. Survive as long as possible!</p>
<canvas id="gameCanvas" width="800" height="600"></canvas>
<script>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Entity {
    constructor(x, y, color, damage = 10, isZombie = false) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 20;
    this.color = color;
    this.hp = 100;
    this.damage = damage;
    this.cooldown = 0;
    this.isZombie = isZombie;
    }

    draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - this.size, this.y - this.size - 10, 40, 5);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x - this.size, this.y - this.size - 10, 40 * (this.hp / 100), 5);
    }

    distanceTo(other) {
    return Math.hypot(this.x - other.x, this.y - other.y);
    }

    move() {
    this.x += this.vx;
    this.y += this.vy;
    }

    setDirection(dx, dy) {
    this.vx = dx;
    this.vy = dy;
    }

    // Add moveToward method for zombies
    moveToward(target, speed) {
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.move();
    }
}

class Bullet {
    constructor(x, y, angle, color = "yellow", speed = 6, damage = 20) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.size = 6;
    this.damage = damage;
    this.hit = false;
    }

    update() {
    this.x += this.vx;
    this.y += this.vy;
    }

    draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    }
}

const player = new Entity(400, 300, "blue");
let zombies = [];
let bullets = [];
let keys = { w: false, a: false, s: false, d: false };
let spawnRate = 120;  // initial spawn rate for zombies
let timer = 0;
let gameOver = false;

// Auto-shoot mechanism
function autoShootAt(targets) {
    if (player.cooldown > 0) return;
    let closest = null;
    let minDist = Infinity;
    for (let t of targets) {
    const d = player.distanceTo(t);
    if (d < minDist) {
        minDist = d;
        closest = t;
    }
    }
    if (closest) {
    const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
    bullets.push(new Bullet(player.x, player.y, angle));
    player.cooldown = 15;  // Faster bullet rate
    }
}

// Handle WASD movement
document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "w") keys.w = true;
    if (e.key.toLowerCase() === "a") keys.a = true;
    if (e.key.toLowerCase() === "s") keys.s = true;
    if (e.key.toLowerCase() === "d") keys.d = true;
    if (e.key.toLowerCase() === "q") {
    autoShootAt(zombies);
    }
});

document.addEventListener("keyup", e => {
    if (e.key.toLowerCase() === "w") keys.w = false;
    if (e.key.toLowerCase() === "a") keys.a = false;
    if (e.key.toLowerCase() === "s") keys.s = false;
    if (e.key.toLowerCase() === "d") keys.d = false;
});

// Player movement
function movePlayer() {
    const speed = 3;
    let dx = 0;
    let dy = 0;
    if (keys.w) dy = -speed;
    if (keys.s) dy = speed;
    if (keys.a) dx = -speed;
    if (keys.d) dx = speed;
    player.setDirection(dx, dy);
    player.move();
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    timer += 1;

    // Spawn zombies periodically and increase spawn rate every 10 seconds
    if (timer % spawnRate === 0 && zombies.length < 20) {
    const zx = Math.random() * canvas.width;
    const zy = Math.random() * canvas.height;
    zombies.push(new Entity(zx, zy, "green", 10, true));
    }

    // Increase zombie spawn rate every 10 seconds
    if (timer % 600 === 0) {
    spawnRate = Math.max(60, spawnRate - 10);  // Decrease spawn rate but not less than 60
    }

    // Update bullets
    for (let b of bullets) b.update();

    // Move zombies and melee attack if close
    for (let z of zombies) {
    z.moveToward(player, 0.6);
    if (z.cooldown > 0) z.cooldown--;
    if (z.distanceTo(player) < 30 && z.cooldown <= 0) {
        player.hp -= z.damage;
        z.cooldown = 60;
    }
    }

    // Bullet collisions
    for (let b of bullets) {
    for (let z of zombies) {
        if (Math.hypot(b.x - z.x, b.y - z.y) < z.size) {
        z.hp -= b.damage;
        b.hit = true;
        }
    }
    }

    // Clean up bullets and zombies
    bullets = bullets.filter(b => !b.hit && b.x >= 0 && b.y >= 0 && b.x <= canvas.width && b.y <= canvas.height);
    zombies = zombies.filter(z => z.hp > 0);

    // Draw all
    player.draw();
    for (let z of zombies) z.draw();
    for (let b of bullets) b.draw();

    // Move player
    movePlayer();

    if (player.cooldown > 0) player.cooldown--;

    // Display the auto-aim arrow
    if (zombies.length > 0) {
    let closest = zombies.reduce((a, b) => player.distanceTo(a) < player.distanceTo(b) ? a : b);
    const angle = Math.atan2(closest.y - player.y, closest.x - player.x);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + Math.cos(angle) * 30, player.y + Math.sin(angle) * 30);
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(player.x + Math.cos(angle) * 30, player.y + Math.sin(angle) * 30);
    ctx.lineTo(player.x + Math.cos(angle + Math.PI / 8) * 15, player.y + Math.sin(angle + Math.PI / 8) * 15);
    ctx.moveTo(player.x + Math.cos(angle) * 30, player.y + Math.sin(angle) * 30);
    ctx.lineTo(player.x + Math.cos(angle - Math.PI / 8) * 15, player.y + Math.sin(angle - Math.PI / 8) * 15);
    ctx.stroke();
    }

    // Display information
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Time: ${Math.floor(timer / 60)}s`, 10, 20);
    ctx.fillText(`Health: ${player.hp}`, 10, 40);

    // Check for game over condition (after 60 seconds)
    if (timer >= 3600 || player.hp <= 0) {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "48px sans-serif";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    } else {
    requestAnimationFrame(update);
    }
}

update();
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/smashbrosmaintheme.mp3'); // Change path as needed
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