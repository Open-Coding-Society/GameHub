---
layout: bootstrap
title: Skirmish
description: Skirmish Game 
permalink: /skirmish
Author: Ian
---

<!-- ROBINHOOD-STYLE SKIRMISH GAME WITH CLASSES, ENEMIES, STORY -->

<style>
  body {
    background: linear-gradient(135deg, #f4f1ee 0%, #e7e4df 100%);
    color: #222;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
  }
  h2, h4, h5 {
    color: #1a7f37;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 1.25rem;
    box-shadow: 0 2px 12px rgba(34, 197, 94, 0.08);
    transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1);
  }
  .card:hover {
    transform: scale(1.025);
    box-shadow: 0 6px 24px rgba(34, 197, 94, 0.18);
    border-color: #1a7f37;
    cursor: pointer;
  }
  .btn {
    border-radius: 1.25rem;
    font-weight: 600;
    font-size: 1.05rem;
    padding: 0.5rem 1.5rem;
    letter-spacing: 0.01em;
    box-shadow: 0 1px 4px rgba(34, 197, 94, 0.08);
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .btn-outline-success {
    color: #1a7f37;
    border-color: #1a7f37;
    background: #fff;
  }
  .btn-outline-success:hover, .btn-outline-success:focus {
    background: #1a7f37;
    color: #fff;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.12);
  }
  .btn-outline-warning {
    color: #b45309;
    border-color: #fbbf24;
    background: #fff;
  }
  .btn-outline-warning:hover, .btn-outline-warning:focus {
    background: #fbbf24;
    color: #fff;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.12);
  }
  .btn-outline-secondary {
    color: #374151;
    border-color: #d1d5db;
    background: #fff;
  }
  .btn-outline-secondary:hover, .btn-outline-secondary:focus {
    background: #d1d5db;
    color: #222;
    box-shadow: 0 2px 8px rgba(209, 213, 219, 0.12);
  }
  .text-danger {
    font-weight: bold;
    color: #e11d48 !important;
    animation: blink 0.3s ease;
  }
  @keyframes blink {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  #playerStats, #enemyStats {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1rem 1.25rem;
    margin-top: 0.5rem;
    font-size: 1.05rem;
    color: #222;
    min-width: 180px;
  }
  #storyText {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: #1a7f37;
    background: #e7f9ef;
    border-radius: 0.75rem;
    padding: 0.75rem 0;
    border: 1px solid #bbf7d0;
    box-shadow: 0 1px 4px rgba(34, 197, 94, 0.06);
  }
  #gameArea .card {
    border-left: 5px solid #1a7f37;
    border-top: 2px solid #bbf7d0;
  }
  .container.mt-5 { margin-top: 3.5rem !important; }
  .class-card {
    border: 2px solid #e5e7eb;
    background: #f9fafb;
    color: #222;
    transition: border 0.18s, background 0.18s, color 0.18s;
  }
  .class-card[data-class="warrior"]:hover {
    border-color: #1a7f37;
    background: #e7f9ef;
    color: #1a7f37;
  }
  .class-card[data-class="mage"]:hover {
    border-color: #2563eb;
    background: #e0e7ff;
    color: #2563eb;
  }
  .class-card[data-class="rogue"]:hover {
    border-color: #374151;
    background: #f3f4f6;
    color: #374151;
  }
  .class-card .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .class-card p {
    font-size: 1.05rem;
    color: #374151;
  }
  @media (max-width: 768px) {
    .container.mt-5 { margin-top: 1.5rem !important; }
    #storyText { font-size: 1.1rem; }
    .class-card .card-title { font-size: 1.1rem; }
    #playerStats, #enemyStats { font-size: 0.98rem; }
  }
</style>

<!-- Character Selection Screen -->
<div class="container mt-5" id="classSelect">
  <h2 class="text-center mb-4">Choose Your Class</h2>
  <div class="row justify-content-center">
    <div class="col-md-3">
      <div class="card class-card mb-3" data-class="warrior">
        <div class="card-body">
          <h5 class="card-title">🛡️ Warrior</h5>
          <p>High HP, strong melee attacks, good defense</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card class-card mb-3" data-class="mage">
        <div class="card-body">
          <h5 class="card-title">🔮 Mage</h5>
          <p>Powerful spells, low HP, regenerates mana</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card class-card mb-3" data-class="rogue">
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
          <button class="btn btn-outline-success m-2" id="attackBtn" onclick="attackEnemy()" disabled>Attack</button>
          <button class="btn btn-outline-warning m-2" id="abilityBtn" onclick="useAbility()" disabled>Use Ability</button>
          <button class="btn btn-outline-secondary m-2" id="itemBtn" onclick="useItem()" disabled>Use Item</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let player = {}, enemy = {}, storyIndex = 0, stage = 0, canAct = true;

const classes = {
  warrior: { hp: 150, attack: 20, ability: "Block", abilityDesc: "Restore 20 HP (max HP capped)" },
  mage: { hp: 80, attack: 30, ability: "Fireball", abilityDesc: "Deal 40 damage" },
  rogue: { hp: 100, attack: 15, crit: 0.25, ability: "Backstab", abilityDesc: "Deal 25-50 damage" },
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

function setActionButtons(state) {
  document.getElementById("attackBtn").disabled = !state;
  document.getElementById("abilityBtn").disabled = !state;
  document.getElementById("itemBtn").disabled = !state;
}

function selectClass(cls) {
  player = { ...classes[cls], name: cls, maxHp: classes[cls].hp, items: 1 };
  stage = 0;
  storyIndex = 0;
  document.getElementById("classSelect").classList.add("d-none");
  document.getElementById("gameArea").classList.remove("d-none");
  nextStage();
}

function updateUI() {
  document.getElementById("storyText").innerText = story[storyIndex];
  document.getElementById("playerStats").innerHTML = `
    HP: ${player.hp}/${player.maxHp}<br>
    Ability: ${player.ability} (${player.abilityDesc})<br>
    Items: ${player.items || 0}
  `;
  document.getElementById("enemyStats").innerHTML = `
    Name: ${enemy.name}<br>
    HP: ${enemy.hp}
  `;
}

function nextStage() {
  if (stage >= enemies.length) {
    document.getElementById("storyText").innerText = story[story.length - 1];
    setActionButtons(false);
    return;
  }
  enemy = { ...enemies[stage] };
  storyIndex = stage;
  setActionButtons(true);
  updateUI();
  stage++;
}

function attackEnemy() {
  if (!canAct) return;
  canAct = false;
  let damage = player.attack;
  let critMsg = "";
  if (player.crit && Math.random() < player.crit) {
    damage *= 2;
    critMsg = " (Critical!)";
  }
  if (enemy.defense) damage = Math.max(1, damage - enemy.defense);
  enemy.hp -= damage;
  animateHit("enemyStats");
  updateUI();
  setTimeout(() => {
    if (enemy.hp <= 0) {
      alert(`${enemy.name} defeated!`);
      nextStage();
      canAct = true;
    } else {
      enemyTurn();
    }
  }, 400);
}

function useAbility() {
  if (!canAct) return;
  canAct = false;
  let msg = "";
  if (player.ability === "Fireball") {
    enemy.hp -= 40;
    msg = "You cast Fireball!";
  } else if (player.ability === "Block") {
    player.hp += 20;
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    msg = "You block and restore HP!";
  } else if (player.ability === "Backstab") {
    let dmg = 25;
    if (Math.random() < 0.2) dmg += 25;
    enemy.hp -= dmg;
    msg = "You use Backstab!";
  }
  animateHit("enemyStats");
  updateUI();
  setTimeout(() => {
    if (enemy.hp <= 0) {
      alert(`${enemy.name} defeated!`);
      nextStage();
      canAct = true;
    } else {
      enemyTurn();
    }
  }, 400);
}

function useItem() {
  if (!canAct) return;
  if (!player.items || player.items < 1) {
    alert("No items left!");
    return;
  }
  canAct = false;
  player.hp += 30;
  if (player.hp > player.maxHp) player.hp = player.maxHp;
  player.items--;
  animateHit("playerStats");
  updateUI();
  setTimeout(() => {
    enemyTurn();
  }, 400);
}

function enemyTurn() {
  setActionButtons(false);
  setTimeout(() => {
    let damage = enemy.attack || 10;
    let msg = "";
    if (enemy.ability === "Drain" && Math.random() < 0.3) {
      damage += 5;
      msg = "Necromancer drains your life!";
    }
    if (enemy.ability === "Flame Breath" && Math.random() < 0.2) {
      damage += 15;
      msg = "Dragon uses Flame Breath!";
    }
    if (enemy.defense && Math.random() < 0.2) {
      msg = "Golem blocks some damage!";
    }
    player.hp -= damage;
    animateHit("playerStats");
    updateUI();
    if (player.hp <= 0) {
      setTimeout(() => {
        alert("You were defeated. Game over.");
        location.reload();
      }, 300);
    } else {
      setActionButtons(true);
      canAct = true;
    }
  }, 500);
}

function animateHit(id) {
  const el = document.getElementById(id);
  el.classList.add("text-danger");
  setTimeout(() => el.classList.remove("text-danger"), 300);
}

// Initialize UI on load and set up class card click handlers
window.onload = function() {
  setActionButtons(false);
  updateUI();
  // Add event listeners to class cards
  document.querySelectorAll('.class-card').forEach(card => {
    card.addEventListener('click', function() {
      const cls = this.getAttribute('data-class');
      selectClass(cls);
    });
  });
};
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/13reachforthesummit.mp3'); // Change path as needed
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