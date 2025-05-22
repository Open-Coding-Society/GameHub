---
layout: bootstrap
title: Tower Defense
description: Tower Defense Game
permalink: /tower
Author: Ian
---

<meta charset="UTF-8">
<title>Bunker Defense - Tower Defense Game</title>
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<style>
body {
    background-color: #212529;
    color: #f8f9fa;
    font-family: 'Arial', sans-serif;
}
.navbar {
    background-color: #343a40;
}
.card {
    background-color: #1c1e22;
    border-radius: 10px;
    border: none;
}
.btn-custom {
    background-color: #28a745;
    border: none;
    border-radius: 10px;
    color: white;
}
.btn-custom:hover {
    background-color: #218838;
}
.zombie {
    width: 40px;
    height: 40px;
    background-color: #dc3545;
    border-radius: 50%;
    position: absolute;
    animation: moveZombie 3s linear infinite;
    transition: all 0.2s;
}
.health-bar {
    width: 40px;
    height: 5px;
    background-color: #28a745;
    position: absolute;
    top: -8px;
    left: 0;
    border-radius: 2px;
}
@keyframes moveZombie {
    0% { left: 0; }
    100% { left: 100%; }
}
#gameArea {
    display: none;
    padding: 10px;
}
.tower {
    cursor: pointer;
}
</style>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark">
<a class="navbar-brand" href="#">Bunker Defense</a>
</nav>

<!-- Start Screen -->
<div class="container mt-5 text-center" id="startScreen">
<h1>Welcome to Bunker Defense</h1>
<p>Defend your bunker from waves of zombies!</p>
<button class="btn btn-custom btn-lg" onclick="startGame()">Start Game</button>
</div>

<!-- Game Area -->
<div class="container mt-5" id="gameArea">
<h2>Wave <span id="waveNumber">1</span> | Coins: $<span id="coins">0</span></h2>
<div id="gameCanvas" class="position-relative" style="width: 100%; height: 400px; background-color: #343a40;">
    <!-- Towers and Zombies will be rendered here -->
</div>

<div class="mt-4">
    <h4>Buy Towers</h4>
    <button class="btn btn-custom tower" onclick="buyCannon()">Cannon - $50</button>
    <button class="btn btn-custom tower" onclick="buyWizard()">Wizard Tower - $100</button>
    <button class="btn btn-custom tower" onclick="buyFlameThrower()">Flame Thrower - $150</button>
</div>

<div class="mt-4">
    <button class="btn btn-secondary" onclick="nextWave()">Next Wave</button>
</div>
</div>

<script>
// Game State
let wave = 1;
let coins = 0;
let zombies = [];
let towers = [];
let bossWave = 10;
let bossHP = 100;

// Starting the game
function startGame() {
    $('#startScreen').hide();
    $('#gameArea').show();
    spawnZombie();
    updateUI();
}

// Game Update
function updateUI() {
    document.getElementById('waveNumber').innerText = wave;
    document.getElementById('coins').innerText = coins;
}

// Zombie Spawning
function spawnZombie() {
    const zombieCount = wave + (wave > bossWave ? 2 : 0);
    for (let i = 0; i < zombieCount; i++) {
    const zombie = document.createElement('div');
    zombie.classList.add('zombie');
    zombie.style.top = `${Math.random() * 100}%`;
    $('#gameCanvas').append(zombie);

    // Add health bar
    const healthBar = document.createElement('div');
    healthBar.classList.add('health-bar');
    zombie.appendChild(healthBar);

    let zombieHP = wave >= bossWave ? bossHP : 15;
    zombie.dataset.hp = zombieHP; // Assign health to zombie
    zombie.style.animationDuration = `${3 + wave / 10}s`;

    zombies.push(zombie);
    moveZombie(zombie, healthBar);
    }
}

// Move Zombie and handle health reduction
function moveZombie(zombie, healthBar) {
    const moveZombieInterval = setInterval(() => {
    if (parseInt(zombie.style.left) >= 100) {
        clearInterval(moveZombieInterval);
        alert("The bunker is destroyed!");
        location.reload();
    }

    // Decrease health when cannon hits
    if (parseInt(zombie.dataset.hp) > 0) {
        zombie.dataset.hp -= 5; // Decrease HP by 5 (cannon damage)
        healthBar.style.width = `${(zombie.dataset.hp / 15) * 40}px`; // Update health bar width
        if (zombie.dataset.hp <= 0) {
        clearInterval(moveZombieInterval);
        killZombie(zombie);
        }
    }
    }, 1000);
}

// Killing zombies (update coins)
function killZombie(zombie) {
    zombies = zombies.filter(z => z !== zombie);
    zombie.remove();
    coins += 10;
    updateUI();
}

// Next wave function
function nextWave() {
    if (wave >= 100) {
    alert("You have completed all 100 waves!");
    location.reload();
    }
    wave++;
    zombies = [];
    spawnZombie();
    bossHP += 100; // Increase boss HP each wave
    updateUI();
}

// Buying towers
function buyCannon() {
    if (coins >= 50) {
    coins -= 50;
    towers.push({ type: 'cannon' });
    updateUI();
    } else {
    alert('Not enough coins!');
    }
}

function buyWizard() {
    if (coins >= 100) {
    coins -= 100;
    towers.push({ type: 'wizard' });
    updateUI();
    } else {
    alert('Not enough coins!');
    }
}

function buyFlameThrower() {
    if (coins >= 150) {
    coins -= 150;
    towers.push({ type: 'flamethrower' });
    updateUI();
    } else {
    alert('Not enough coins!');
    }
}

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