---
layout: bootstrap
title: Survive
description: Survive Game 
permalink: /survive
Author: Zach & Ian
---

<h2>Zombie Survival</h2>
<div style="display: flex; align-items: center; justify-content: flex-start; gap: 20px; margin-bottom: 8px;">
  <div>
    <span>Press <b>Q</b> or <b>Space</b> to shoot. Use WASD to move. Press <b>E</b> to send laser. Survive as long as possible!</span>
  </div>
  <div id="laserStatus" style="font-weight: bold; color: #FFD600; margin-left: 20px;"></div>
</div>
<canvas id="gameCanvas" width="800" height="600"></canvas>
<script>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Entity {
    constructor(x, y, color, damage = 5, isZombie = false) {
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
let spawnRate = 120;
let timer = 0;
let gameOver = false;

let lastAimAngle = 0;
let laserCooldown = 0;
const LASER_COOLDOWN_FRAMES = 600;
const LASER_DAMAGE = 50;

// Auto-shoot mechanism
let shootHeld = false;
let lastShotTime = 0;
const SHOOT_INTERVAL = 200; // ms

function tryShoot() {
    const now = Date.now();
    if (player.cooldown > 0 || now - lastShotTime < SHOOT_INTERVAL) return;
    if (zombies.length === 0) return;
    let closest = null;
    let minDist = Infinity;
    for (let t of zombies) {
        const d = player.distanceTo(t);
        if (d < minDist) {
            minDist = d;
            closest = t;
        }
    }
    if (closest) {
        const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
        bullets.push(new Bullet(player.x, player.y, angle));
        player.cooldown = 15;  // Faster bullet rate (for legacy, but we use time now)
        lastShotTime = now;
    }
}

// Handle WASD movement and laser
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "w") keys.w = true;
    if (key === "a") keys.a = true;
    if (key === "s") keys.s = true;
    if (key === "d") keys.d = true;
    if (key === "q" || key === " ") {
        shootHeld = true;
        tryShoot();
    }
    if (key === "e" && laserCooldown === 0) {
        fireLaser();
        laserCooldown = LASER_COOLDOWN_FRAMES;
    }
});

document.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();
    if (key === "w") keys.w = false;
    if (key === "a") keys.a = false;
    if (key === "s") keys.s = false;
    if (key === "d") keys.d = false;
    if (key === "q" || key === " ") {
        shootHeld = false;
    }
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

    // Clamp player position to stay within canvas borders
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function drawBorder() {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// Laser beam logic
function fireLaser() {
    let angle = lastAimAngle;
    if (zombies.length > 0) {
        let closest = zombies.reduce((a, b) => player.distanceTo(a) < player.distanceTo(b) ? a : b);
        angle = Math.atan2(closest.y - player.y, closest.x - player.x);
    }
    // Find intersection with canvas border
    let lx = player.x, ly = player.y;
    let dx = Math.cos(angle), dy = Math.sin(angle);
    let tMax = Infinity;
    // Calculate intersection with each border
    if (dx !== 0) {
        let tx1 = (0 - player.x) / dx;
        let tx2 = (canvas.width - player.x) / dx;
        tMax = Math.min(tMax, ...[tx1, tx2].filter(t => t > 0));
    }
    if (dy !== 0) {
        let ty1 = (0 - player.y) / dy;
        let ty2 = (canvas.height - player.y) / dy;
        tMax = Math.min(tMax, ...[ty1, ty2].filter(t => t > 0));
    }
    const lx2 = player.x + dx * tMax;
    const ly2 = player.y + dy * tMax;

    // Draw laser beam (yellow)
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(lx2, ly2);
    ctx.stroke();
    ctx.restore();

    // Damage zombies that intersect the laser
    for (let z of zombies) {
        // Distance from zombie center to laser line segment
        const A = {x: player.x, y: player.y}, B = {x: lx2, y: ly2};
        const ABx = B.x - A.x, ABy = B.y - A.y;
        const APx = z.x - A.x, APy = z.y - A.y;
        const ab2 = ABx*ABx + ABy*ABy;
        const ap_ab = APx*ABx + APy*ABy;
        const t = Math.max(0, Math.min(1, ab2 === 0 ? 0 : ap_ab / ab2));
        const closestX = A.x + ABx * t;
        const closestY = A.y + ABy * t;
        const dist = Math.hypot(z.x - closestX, z.y - closestY);
        if (dist < z.size + 6) {
            const dmg = Math.min(LASER_DAMAGE, z.hp / 2);
            z.hp -= dmg;
        }
    }
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw border first
    drawBorder();

    timer += 1;

    // Spawn zombies periodically and increase spawn rate every 10 seconds
    if (timer % spawnRate === 0 && zombies.length < 20) {
    const zx = Math.random() * canvas.width;
    const zy = Math.random() * canvas.height;
    zombies.push(new Entity(zx, zy, "green", 5, true));
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
    let zombiesKilled = 0;
    for (let z of zombies) {
        if (z.hp <= 0) {
            zombiesKilled++;
        }
    }
    bullets = bullets.filter(b => !b.hit && b.x >= 0 && b.y >= 0 && b.x <= canvas.width && b.y <= canvas.height);
    zombies = zombies.filter(z => z.hp > 0);

    // Reward player with 1 health per kill (max 100)
    if (zombiesKilled > 0) {
        player.hp = Math.min(100, player.hp + zombiesKilled);
    }

    // Draw all
    player.draw();
    for (let z of zombies) z.draw();
    for (let b of bullets) b.draw();

    // Move player
    movePlayer();

    if (player.cooldown > 0) player.cooldown--;

    // Display the auto-aim arrow and update lastAimAngle
    if (zombies.length > 0) {
        let closest = zombies.reduce((a, b) => player.distanceTo(a) < player.distanceTo(b) ? a : b);
        const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
        lastAimAngle = angle;

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

    // Display information (time and health)
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Time: ${Math.floor(timer / 60)}s`, 10, 20);
    ctx.fillText(`Health: ${Math.max(0, player.hp)}`, 10, 40);

    // Laser cooldown display (move to above canvas, right of description)
    const laserStatusDiv = document.getElementById("laserStatus");
    if (laserCooldown === 0) {
        laserStatusDiv.textContent = "Laser: CHARGED (Press E)";
        laserStatusDiv.style.color = "#FFD600";
    } else {
        laserStatusDiv.textContent = `Laser: ${Math.ceil(laserCooldown / 60)}s`;
        laserStatusDiv.style.color = "red";
    }

    // Check for win/lose condition (after 120 seconds)
    if (timer >= 7200 || player.hp <= 0) {
        gameOver = true;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        if (player.hp > 0 && timer >= 7200) {
            ctx.fillStyle = "lime";
            ctx.font = "48px sans-serif";
            ctx.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
        } else {
            ctx.fillStyle = "red";
            ctx.font = "48px sans-serif";
            ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
        }

        // Draw Restart button styled exactly like Outbreak
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#4caf50";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 90, canvas.height / 2 + 40, 180, 50, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🔁 Play Again", canvas.width / 2, canvas.height / 2 + 65);

        // Remove any previous handler to avoid stacking
        canvas.style.cursor = "pointer";
        if (!canvas._restartHandlerActive) {
            canvas._restartHandlerActive = true;
            function restartHandler(e) {
                const rect = canvas.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                if (
                    mx >= canvas.width / 2 - 90 && mx <= canvas.width / 2 + 90 &&
                    my >= canvas.height / 2 + 40 && my <= canvas.height / 2 + 90
                ) {
                    canvas.removeEventListener("click", restartHandler);
                    canvas._restartHandlerActive = false;
                    canvas.style.cursor = "";
                    restartGame();
                }
            }
            // Remove any previous click handlers
            canvas.onclick = null;
            canvas.addEventListener("click", restartHandler);
        }
    } else {
        if (laserCooldown > 0) laserCooldown--;
        requestAnimationFrame(update);
    }
}

update();
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/14heartofthemountain.mp3'); // Change path as needed
music.loop = true;
music.volume = 0.7;

// Play music after first user interaction (required by browsers)
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>