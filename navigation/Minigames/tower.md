---
layout: bootstrap
title: Tower Defense
description: Tower Defense Game
permalink: /tower
Author: Zach & Ian
---


<meta charset="UTF-8" />
<title>BTD6-Inspired Tower Defense</title>
<style>
    body {
    font-family: Arial, sans-serif;
    user-select: none;
    margin: 10px;
    }
    #gameContainer {
    position: relative;
    }
    #gameCanvas {
    border: 1px solid black;
    background: #e0f7fa;
    display: block;
    }
    #controls {
    margin-top: 10px;
    }
    button {
    margin-right: 10px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    }
    #upgradePanel {
    position: absolute;
    background: #fff;
    border: 1px solid #333;
    padding: 10px;
    display: none;
    z-index: 10;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    }
    #statusBar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    }
    #moneyDisplay, #healthDisplay, #waveDisplay {
    margin: 0 10px;
    }
    #towerTitle {
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0px;
    }
    #towerDesc {
    text-align: center;
    font-size: 1.1em;
    margin-bottom: 15px;
    color: #333;
    }
</style>

<div id="towerTitle">Tower Defense Game</div>
<div id="towerDesc">Spend money to place monkeys down and protect the balloons from making it to the end! Click on troops to upgrade them and make them stronger! (Level 10 is max level)</div>
<div id="statusBar">
  <span id="moneyDisplay">Money: $1000</span>
  <span id="healthDisplay">Health: 20</span>
  <span id="waveDisplay">Wave: 0</span>
</div>

<div id="gameContainer">
  <canvas id="gameCanvas" width="900" height="500"></canvas>

  <div id="upgradePanel">
    <div><button id="upgradeRange">Upgrade Range (-$100)</button></div>
    <div><button id="upgradeDamage">Upgrade Damage (-$100)</button></div>
    <div><button id="upgradeFireRate">Upgrade Fire Rate (-$100)</button></div>
    <div><button id="sellMonkey">Sell Monkey</button></div>
  </div>
</div>

<div id="controls">
  <button id="placeDart">Place Dart Monkey ($200)</button>
  <button id="placeSniper">Place Sniper Monkey ($300)</button>
  <button id="placeBoomerang">Place Boomerang Monkey ($250)</button>
  <button id="startWaveBtn">Start Wave</button>
</div>

<script>
(() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const moneyDisplay = document.getElementById("moneyDisplay");
  const healthDisplay = document.getElementById("healthDisplay");
  const waveDisplay = document.getElementById("waveDisplay");
  const upgradePanel = document.getElementById("upgradePanel");
  const upgradeRangeBtn = document.getElementById("upgradeRange");
  const upgradeDamageBtn = document.getElementById("upgradeDamage");
  const upgradeFireRateBtn = document.getElementById("upgradeFireRate");
  const sellMonkeyBtn = document.getElementById("sellMonkey");
  const startWaveBtn = document.getElementById("startWaveBtn");

  let money = 1000;
  let health = 20;
  let currentWave = 0;
  let waveInProgress = false;
  let balloonsToSpawn = 0;
  let balloonSpawnInterval = null;
  let gameOver = false;

  let placingType = null; // "dart", "sniper", "boomerang"
  let selectedMonkey = null;

  // Path points (longer and more detailed)
  const path = [
    {x: 0, y: 240},
    {x: 120, y: 240},
    {x: 120, y: 100},
    {x: 250, y: 100},
    {x: 250, y: 380},
    {x: 400, y: 380},
    {x: 400, y: 180},
    {x: 550, y: 180},
    {x: 550, y: 420},
    {x: 700, y: 420},
    {x: 700, y: 120},
    {x: 850, y: 120},
    {x: 900, y: 120}
  ];

  // Utility distance function
  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
  }

  // Monkey Base Class
  class Monkey {
    constructor(x, y, price) {
      this.x = x;
      this.y = y;
      this.range = 100;
      this.damage = 1;
      this.fireRate = 60; // frames between shots
      this.fireCooldown = 0;
      this.price = price;
      this.selected = false;
      this.type = "base";
      this.levels = { range: 0, damage: 0, fireRate: 0 }; // Levels for upgrades
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.selected ? "yellow" : "orange";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.type.charAt(0).toUpperCase(), 0, 5);
      ctx.restore();

      // Draw range circle if selected
      if (this.selected) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    update() {
      if (this.fireCooldown > 0) this.fireCooldown--;
      if (this.fireCooldown === 0) {
        const target = balloons.find(b => dist(this.x, this.y, b.x, b.y) <= this.range);
        if (target) {
          shootProjectile(this, target);
          this.fireCooldown = this.fireRate;
        }
      }
    }
  }

  class DartMonkey extends Monkey {
    constructor(x, y) {
      super(x, y, 200);
      this.type = "dart";
      this.damage = 1;
      this.range = 90;
      this.fireRate = 25; // fast fire
    }
  }

  class SniperMonkey extends Monkey {
    constructor(x, y) {
      super(x, y, 300);
      this.type = "sniper";
      this.damage = 6;
      this.range = 250;
      this.fireRate = 80; // slow fire
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.selected ? "yellow" : "blue";
      ctx.beginPath();
      ctx.rect(-10, -15, 20, 30);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("S", 0, 6);
      ctx.restore();

      // Draw range circle if selected
      if (this.selected) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 255, 0.4)";
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  class BoomerangMonkey extends Monkey {
    constructor(x, y) {
      super(x, y, 250);
      this.type = "boomerang";
      this.damage = 2;
      this.range = 140;
      this.fireRate = 45; // medium fire
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.selected ? "yellow" : "green";
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(0, -15);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("B", 0, 6);
      ctx.restore();

      // Draw range circle if selected
      if (this.selected) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 0, 0.4)";
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    shoot(target) {
      // Hit up to 3 balloons in a row within range
      const pierce = 3;
      const inRange = balloons.filter(b => dist(this.x, this.y, b.x, b.y) <= this.range && !b.isPopped);
      if (inRange.length > 0) {
        for (let i = 0; i < Math.min(pierce, inRange.length); i++) {
          shootProjectile(this, inRange[i]);
        }
      }
    }
  }

  // Store base HP for each balloon type
  const BASE_BALLOON_HP = {
    red: 3,
    blue: 6,
    green: 10,
    gray: 5
  };

  // Balloon class with different types and HP
  class Balloon {
    constructor(type) {
      this.type = type;
      this.x = path[0].x;
      this.y = path[0].y;
      this.pathIndex = 0;

      // Double HP every wave (wave 1 = x2, wave 2 = x4, etc.)
      const hpMultiplier = Math.pow(2, Math.max(0, currentWave - 1));
      if (type === "red") {
        this.hp = BASE_BALLOON_HP.red * hpMultiplier;
        this.maxHp = this.hp;
        this.color = "red";
        this.reward = 100;
        this.speed = (1 + currentWave * 0.1) * 3;
      } else if (type === "blue") {
        this.hp = BASE_BALLOON_HP.blue * hpMultiplier;
        this.maxHp = this.hp;
        this.color = "blue";
        this.reward = 150;
        this.speed = (1 + currentWave * 0.1) * 2;
      } else if (type === "green") {
        this.hp = BASE_BALLOON_HP.green * hpMultiplier;
        this.maxHp = this.hp;
        this.color = "green";
        this.reward = 200;
        this.speed = 1 + currentWave * 0.1;
      } else {
        this.hp = BASE_BALLOON_HP.gray * hpMultiplier;
        this.maxHp = this.hp;
        this.color = "gray";
        this.reward = 100;
        this.speed = 1 + currentWave * 0.1;
      }
      this.radius = 12;
      this.isPopped = false;
    }
    update() {
      if (this.pathIndex >= path.length - 1) return false; // reached end

      // Move toward next path point
      const target = path[this.pathIndex + 1];
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distToTarget = Math.sqrt(dx*dx + dy*dy);
      if (distToTarget < this.speed) {
        this.x = target.x;
        this.y = target.y;
        this.pathIndex++;
      } else {
        this.x += (dx / distToTarget) * this.speed;
        this.y += (dy / distToTarget) * this.speed;
      }
      return true;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw HP bar above balloon
      ctx.fillStyle = "black";
      ctx.fillRect(this.x - this.radius, this.y - this.radius - 10, this.radius * 2, 5);
      ctx.fillStyle = "lime";
      ctx.fillRect(
        this.x - this.radius,
        this.y - this.radius - 10,
        this.radius * 2 * (this.hp / this.maxHp),
        5
      );
    }
  }

  // Projectile class
  class Projectile {
    constructor(monkey, target) {
      this.x = monkey.x;
      this.y = monkey.y;
      this.target = target;
      this.speed = 8;
      this.damage = monkey.damage;
      this.radius = 4;
      this.type = monkey.type;
      this.isExpired = false;
    }
    update() {
      if (this.target.isPopped) {
        this.isExpired = true;
        return;
      }
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distToTarget = Math.sqrt(dx*dx + dy*dy);
      if (distToTarget < this.speed) {
        this.x = this.target.x;
        this.y = this.target.y;
        this.hitTarget();
        this.isExpired = true;
      } else {
        this.x += (dx / distToTarget) * this.speed;
        this.y += (dy / distToTarget) * this.speed;
      }
    }
    hitTarget() {
      this.target.hp -= this.damage;
      if (this.target.hp <= 0) {
        this.target.isPopped = true;
        money += this.target.reward;
        updateMoneyDisplay();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.type === "sniper" ? "purple" : "black";
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let monkeys = [];
  let balloons = [];
  let projectiles = [];

  // Place monkey on valid location
  function placeMonkey(type, x, y) {
    if (money < (type === "dart" ? 200 : type === "sniper" ? 300 : 250)) return false;

    // Check spacing: must be >= 50 pixels away from all other monkeys
    for (const m of monkeys) {
      if (dist(x, y, m.x, m.y) < 50) {
        alert("Too close to another monkey!");
        return false;
      }
    }
    // Check not on path (within 30 pixels of path line points)
    for (let i = 0; i < path.length -1; i++) {
      const a = path[i];
      const b = path[i+1];
      // Calculate distance from point to segment
      if (pointLineDist({x,y}, a, b) < 30) {
        alert("Cannot place on the path!");
        return false;
      }
    }

    let newMonkey;
    if (type === "dart") newMonkey = new DartMonkey(x, y);
    else if (type === "sniper") newMonkey = new SniperMonkey(x, y);
    else if (type === "boomerang") newMonkey = new BoomerangMonkey(x, y);
    else return false;

    monkeys.push(newMonkey);
    money -= newMonkey.price;
    updateMoneyDisplay();
    return true;
  }

  // Distance from point p to line segment ab
  function pointLineDist(p, a, b) {
    const A = p.x - a.x;
    const B = p.y - a.y;
    const C = b.x - a.x;
    const D = b.y - a.y;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = a.x;
      yy = a.y;
    } else if (param > 1) {
      xx = b.x;
      yy = b.y;
    } else {
      xx = a.x + param * C;
      yy = a.y + param * D;
    }

    const dx = p.x - xx;
    const dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Shoot projectile from monkey to target balloon
  function shootProjectile(monkey, balloon) {
    projectiles.push(new Projectile(monkey, balloon));
  }

  // Update money display text
  function updateMoneyDisplay() {
    moneyDisplay.textContent = `Money: $${money}`;
  }
  // Update health display text
  function updateHealthDisplay() {
    healthDisplay.textContent = `Health: ${health}`;
  }
  // Update wave display text
  function updateWaveDisplay() {
    waveDisplay.textContent = `Wave: ${currentWave}`;
  }

  // Start wave spawning balloons
  function startWave() {
    if (waveInProgress || gameOver) return;
    waveInProgress = true;
    startWaveBtn.disabled = true;

    currentWave++;
    updateWaveDisplay();
    // Increase difficulty: 10 + (currentWave-1)*10
    balloonsToSpawn = 10 + (currentWave - 1) * 10;

    balloonSpawnInterval = setInterval(() => {
      if (balloonsToSpawn <= 0) {
        clearInterval(balloonSpawnInterval);
        balloonSpawnInterval = null;
        waveInProgress = false;
        startWaveBtn.disabled = false;
        return;
      }
      balloonsToSpawn--;
      spawnBalloon();
    }, 700);
  }

  // Spawn balloon by wave difficulty (random types)
  function spawnBalloon() {
    let typeChance = Math.random();
    let type;
    if (typeChance < 0.6) type = "red";
    else if (typeChance < 0.85) type = "blue";
    else type = "green";
    balloons.push(new Balloon(type));
  }

  // Update the upgrade panel to show sell price and levels
  function showUpgradePanel(monkey) {
    selectedMonkey = monkey;
    const sellPrice = Math.floor(monkey.price / 2);
    sellMonkeyBtn.textContent = `Sell Monkey (+$${sellPrice})`;

    // Update levels next to each upgrade button
    upgradeRangeBtn.innerHTML = `Upgrade Range (-$100) <span style="${monkey.levels.range === 10 ? 'font-weight:bold;' : ''}">[Lvl ${monkey.levels.range}]</span>`;
    upgradeDamageBtn.innerHTML = `Upgrade Damage (-$100) <span style="${monkey.levels.damage === 10 ? 'font-weight:bold;' : ''}">[Lvl ${monkey.levels.damage}]</span>`;
    upgradeFireRateBtn.innerHTML = `Upgrade Fire Rate (-$100) <span style="${monkey.levels.fireRate === 10 ? 'font-weight:bold;' : ''}">[Lvl ${monkey.levels.fireRate}]</span>`;

    // Position upgrade panel near monkey
    const rect = canvas.getBoundingClientRect();
    const containerRect = document.getElementById("gameContainer").getBoundingClientRect();
    upgradePanel.style.left = (monkey.x + rect.left - containerRect.left + 20) + "px";
    upgradePanel.style.top = (monkey.y + rect.top - containerRect.top - 40) + "px";
    upgradePanel.style.display = "block";
  }

  // Upgrade selected monkey's range, damage, or fire rate
  function upgradeSelectedMonkey(type) {
    if (!selectedMonkey) return;

    if (type === "range" && selectedMonkey.levels.range < 10 && money >= 100) {
      selectedMonkey.range *= 1.10; // Increase range by 10%
      selectedMonkey.levels.range++;
      money -= 100;
    } else if (type === "damage" && selectedMonkey.levels.damage < 10 && money >= 100) {
      selectedMonkey.damage *= 1.10; // Increase damage by 10%
      selectedMonkey.levels.damage++;
      money -= 100;
    } else if (type === "fireRate" && selectedMonkey.levels.fireRate < 10 && money >= 100) {
      selectedMonkey.fireRate = Math.floor(selectedMonkey.fireRate * 0.9); // Increase fire rate by 10%
      selectedMonkey.levels.fireRate++;
      money -= 100;
    }

    // Update levels in the upgrade panel
    showUpgradePanel(selectedMonkey);
    updateMoneyDisplay();
  }

  // Sell selected monkey
  function sellSelectedMonkey() {
    if (!selectedMonkey) return;
    const sellPrice = Math.floor(selectedMonkey.price / 2);
    money += sellPrice;
    monkeys = monkeys.filter(m => m !== selectedMonkey);
    selectedMonkey = null;
    hideUpgradePanel();
    updateMoneyDisplay();
  }

  function hideUpgradePanel() {
    upgradePanel.style.display = "none";
    selectedMonkey = null;
  }

  // Button handlers for upgrades
  upgradeRangeBtn.onclick = () => {
    upgradeSelectedMonkey("range");
  };
  upgradeDamageBtn.onclick = () => {
    upgradeSelectedMonkey("damage");
  };
  upgradeFireRateBtn.onclick = () => {
    upgradeSelectedMonkey("fireRate");
  };
  sellMonkeyBtn.onclick = () => {
    sellSelectedMonkey();
  };

  // Main update function
  function update() {
    if (gameOver) return;
    // Update monkeys
    monkeys.forEach(m => m.update());

    // Update balloons
    balloons = balloons.filter(b => !b.isPopped);
    balloons = balloons.filter(b => {
      const alive = b.update();
      if (!alive) {
        // Balloon reached end - lose 1 health
        health -= 1;
        updateHealthDisplay();
        if (health <= 0 && !gameOver) {
          health = 0;
          updateHealthDisplay();
          gameOver = true;
          setTimeout(() => {
            alert("Game Over! You lost all your health.");
          }, 100);
        }
      }
      return alive;
    });

    // Update projectiles
    projectiles = projectiles.filter(p => !p.isExpired);
    projectiles.forEach(p => p.update());
  }

  // Main draw function
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path as thick gray line
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#bbb";
    ctx.lineJoin = "round";
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    // Draw monkeys
    monkeys.forEach(m => m.draw());

    // Draw balloons
    balloons.forEach(b => b.draw());

    // Draw projectiles
    projectiles.forEach(p => p.draw());
  }

  // Game loop
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  // Button handlers
  document.getElementById("placeDart").onclick = () => {
    if (gameOver) return;
    placingType = "dart";
    hideUpgradePanel();
  };
  document.getElementById("placeSniper").onclick = () => {
    if (gameOver) return;
    placingType = "sniper";
    hideUpgradePanel();
  };
  document.getElementById("placeBoomerang").onclick = () => {
    if (gameOver) return;
    placingType = "boomerang";
    hideUpgradePanel();
  };
  startWaveBtn.onclick = () => {
    if (gameOver) return;
    startWave();
    hideUpgradePanel();
  };

  // Canvas click handler for placing or selecting monkeys
  canvas.addEventListener("click", (e) => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (placingType) {
      const placed = placeMonkey(placingType, clickX, clickY);
      if (placed) {
        placingType = null; // reset placing mode after placement
      }
      return;
    }

    // Check if click on monkey for selection
    let clickedOnMonkey = false;
    for (const m of monkeys) {
      if (dist(clickX, clickY, m.x, m.y) <= 20) {
        // Select this monkey
        monkeys.forEach(monkey => monkey.selected = false);
        m.selected = true;
        showUpgradePanel(m);
        clickedOnMonkey = true;
        break;
      }
    }

    if (!clickedOnMonkey) {
      // Clicked outside monkeys => deselect all
      monkeys.forEach(monkey => monkey.selected = false);
      hideUpgradePanel();
    }
  });

  // Initial draw and start game loop
  updateMoneyDisplay();
  updateHealthDisplay();
  updateWaveDisplay();
  requestAnimationFrame(gameLoop);

})();
</script>


<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/17gcnpeachbeach.mp3'); // Change path as needed
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