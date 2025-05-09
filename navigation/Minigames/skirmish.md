---
layout: bootstrap
title: Skirmish
description: Skirmish Game 
permalink: /skirmish
Author: Ian
---

<!-- BOOTSTRAP-STYLE ROBINHOOD SKIRMISH GAME WITH CLASSES, ENEMIES, STORY -->

<style>
  /* Global dark theme */
  body {
    background-color: #0e1111;
    color: #d1d5db;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  h2, h4, h5 {
    color: #f3f4f6;
  }

  .card {
    background-color: #1f2937;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 16px rgba(0, 255, 136, 0.3);
    cursor: pointer;
  }

  .btn {
    border-radius: 1rem;
    font-weight: 500;
  }

  .btn-outline-success {
    color: #10b981;
    border-color: #10b981;
  }

  .btn-outline-success:hover {
    background-color: #10b981;
    color: #0e1111;
  }

  .btn-outline-warning {
    color: #f59e0b;
    border-color: #f59e0b;
  }

  .btn-outline-warning:hover {
    background-color: #f59e0b;
    color: #0e1111;
  }

  .btn-outline-secondary {
    color: #6b7280;
    border-color: #6b7280;
  }

  .btn-outline-secondary:hover {
    background-color: #6b7280;
    color: #fff;
  }

  /* Animations */
  .text-danger {
    font-weight: bold;
    color: #ef4444 !important;
    animation: blink 0.3s ease;
  }

  @keyframes blink {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }

  /* Stat blocks */
  #playerStats, #enemyStats {
    background-color: #111827;
    border: 1px solid #374151;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-top: 0.5rem;
    font-size: 0.95rem;
  }

  /* Centered story text */
  #storyText {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: #fef3c7;
  }

  /* Custom highlight for story progress */
  #gameArea .card {
    border-left: 5px solid #10b981;
  }

  /* Fix selection screen layout */
  .container.mt-5 {
    margin-top: 3rem !important;
  }
</style>


<!-- Character Selection Screen -->
<div class="container mt-5">
  <h2 class="text-center mb-4">Choose Your Class</h2>
  <div class="row justify-content-center">
    <div class="col-md-3">
      <div class="card text-white bg-success mb-3" onclick="selectClass('warrior')">
        <div class="card-body">
          <h5 class="card-title">🛡️ Warrior</h5>
          <p>High HP, strong melee attacks, good defense</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card text-white bg-primary mb-3" onclick="selectClass('mage')">
        <div class="card-body">
          <h5 class="card-title">🔮 Mage</h5>
          <p>Powerful spells, low HP, regenerates mana</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card text-white bg-dark mb-3" onclick="selectClass('rogue')">
        <div class="card-body">
          <h5 class="card-title">🗡️ Rogue</h5>
          <p>Fast attacks, crit chance, balanced stats</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Game Area -->
<div class="container d-none" id="gameArea">
  <div class="row mt-4">
    <div class="col-md-8">
      <div class="card shadow-sm p-3 mb-3">
        <h4 id="storyText">A dark forest looms ahead...</h4>
        <div class="d-flex justify-content-between mt-3">
          <div>
            <h5>Your Stats</h5>
            <p id="playerStats"></p>
          </div>
          <div>
            <h5>Enemy</h5>
            <p id="enemyStats"></p>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-outline-success m-2" onclick="attackEnemy()">Attack</button>
          <button class="btn btn-outline-warning m-2" onclick="useAbility()">Use Ability</button>
          <button class="btn btn-outline-secondary m-2" onclick="useItem()">Use Item</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let player = {}, enemy = {}, storyIndex = 0, stage = 0;

const classes = {
  warrior: { hp: 150, attack: 20, ability: "Block" },
  mage: { hp: 80, attack: 30, ability: "Fireball" },
  rogue: { hp: 100, attack: 15, crit: 0.25, ability: "Backstab" },
};

const story = [
  "You enter a misty forest and face your first foe...",
  "A darker path emerges. A necromancer blocks your way...",
  "The earth shakes. A golem rises from the ground...",
  "A fierce roar echoes. The dragon descends...",
  "Victory is yours! But new secrets await...",
];

const enemies = [
  { name: "Bandit", hp: 50, attack: 10 },
  { name: "Necromancer", hp: 60, attack: 8, ability: "Drain" },
  { name: "Golem", hp: 100, attack: 12, defense: 5 },
  { name: "Dragon", hp: 150, attack: 20, ability: "Flame Breath" },
];

function selectClass(cls) {
  player = { ...classes[cls], name: cls, maxHp: classes[cls].hp };
  document.querySelector(".container").classList.add("d-none");
  document.getElementById("gameArea").classList.remove("d-none");
  nextStage();
}

function updateUI() {
  document.getElementById("storyText").innerText = story[storyIndex];
  document.getElementById("playerStats").innerText = `HP: ${player.hp}/${player.maxHp} | Ability: ${player.ability}`;
  document.getElementById("enemyStats").innerText = `Name: ${enemy.name} | HP: ${enemy.hp}`;
}

function nextStage() {
  if (stage >= enemies.length) return alert("Story complete! 🎉");
  enemy = { ...enemies[stage] };
  storyIndex = stage;
  updateUI();
  stage++;
}

function attackEnemy() {
  let damage = player.attack;
  if (player.crit && Math.random() < player.crit) damage *= 2;
  enemy.hp -= damage;
  animateHit("enemyStats");
  if (enemy.hp <= 0) {
    alert(`${enemy.name} defeated!`);
    nextStage();
  } else {
    enemyTurn();
  }
  updateUI();
}

function useAbility() {
  if (player.ability === "Fireball") {
    enemy.hp -= 40;
  } else if (player.ability === "Block") {
    player.hp += 20;
    if (player.hp > player.maxHp) player.hp = player.maxHp;
  } else if (player.ability === "Backstab") {
    enemy.hp -= 25;
    if (Math.random() < 0.2) enemy.hp -= 25;
  }
  animateHit("enemyStats");
  if (enemy.hp <= 0) {
    alert(`${enemy.name} defeated!`);
    nextStage();
  } else {
    enemyTurn();
  }
  updateUI();
}

function useItem() {
  player.hp += 30;
  if (player.hp > player.maxHp) player.hp = player.maxHp;
  updateUI();
  enemyTurn();
}

function enemyTurn() {
  let damage = enemy.attack || 10;
  player.hp -= damage;
  animateHit("playerStats");
  if (player.hp <= 0) {
    alert("You were defeated. Game over.");
    location.reload();
  }
}

function animateHit(id) {
  const el = document.getElementById(id);
  el.classList.add("text-danger");
  setTimeout(() => el.classList.remove("text-danger"), 300);
}
</script>

<style>
.card:hover { cursor: pointer; transform: scale(1.05); transition: 0.2s; }
.text-danger { font-weight: bold; animation: blink 0.3s ease; }
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.2; }
  100% { opacity: 1; }
}
</style>
