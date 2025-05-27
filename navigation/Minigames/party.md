---
layout: bootstrap
title: Party
description: Party Game
permalink: /party
Author: Zach & Ian
---

<div class="container my-5">
  <div class="row justify-content-center">
    <div class="col-md-10 col-lg-8">
      <div class="card shadow border-success robinhood-card">
        <div class="card-header bg-success text-white text-center">
          <h1 class="display-5 mb-0">🎉 Party Game</h1>
        </div>
        <div class="card-body bg-light">
          <canvas id="gameCanvas" width="600" height="600" class="border border-success rounded mb-4 w-100"></canvas>
          <div id="status" class="alert alert-success text-center mb-3"></div>
          <button id="rollButton" class="btn btn-success btn-lg w-100">Roll Dice 🎲</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
/* Robinhood-inspired styling */
.robinhood-card {
  border-radius: 1.25rem;
  border-width: 2px !important;
  background: linear-gradient(135deg, #e9f5ec 0%, #f4f8fb 100%);
}
.card-header.bg-success {
  background: linear-gradient(90deg, #00c805 0%, #00b86b 100%) !important;
  border-top-left-radius: 1.25rem !important;
  border-top-right-radius: 1.25rem !important;
}
#gameCanvas {
  background: #f4f8fb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.alert-success {
  background: #e9f5ec;
  color: #00b86b;
  border: 1px solid #00c805;
}
.btn-success {
  background: linear-gradient(90deg, #00c805 0%, #00b86b 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-success:hover, .btn-success:focus {
  background: linear-gradient(90deg, #00b86b 0%, #00c805 100%);
  color: #fff;
}
</style>

<script>
// --- Board Pathing: Standard Snaking 10x10 Grid ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusDiv = document.getElementById("status");
const rollButton = document.getElementById("rollButton");

// Generate a snaking board path in a 10x10 grid (left-right, right-left)
function generateBoardPath() {
  const path = [];
  const rows = 10, cols = 10;
  const cellSize = 50;
  const offsetX = 25, offsetY = 25;
  for (let row = rows - 1; row >= 0; row--) {
    if ((rows - 1 - row) % 2 === 0) {
      // Left to right
      for (let col = 0; col < cols; col++) {
        path.push([offsetX + col * cellSize, offsetY + row * cellSize]);
      }
    } else {
      // Right to left
      for (let col = cols - 1; col >= 0; col--) {
        path.push([offsetX + col * cellSize, offsetY + row * cellSize]);
      }
    }
  }
  return path;
}

const boardPath = generateBoardPath();

const players = [
  { name: "You", color: "#00c805", pos: 0, coins: 10 },
  { name: "NPC 1", color: "#ff4b4b", pos: 0, coins: 10 },
  { name: "NPC 2", color: "#00b86b", pos: 0, coins: 10 },
  { name: "NPC 3", color: "#7d5fff", pos: 0, coins: 10 }
];

let currentPlayer = 0;
let round = 1;
const maxRounds = 10;

// Define "move back 2" spaces (e.g., every 7th space except start)
const moveBackSpaces = [];
for (let i = 7; i < boardPath.length; i += 10) {
  moveBackSpaces.push(i);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#d0e6d8";
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(25, 25 + i * 50);
    ctx.lineTo(25 + 10 * 50, 25 + i * 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(25 + i * 50, 25);
    ctx.lineTo(25 + i * 50, 25 + 10 * 50);
    ctx.stroke();
  }

  // Draw spaces
  boardPath.forEach(([x, y], index) => {
    // Highlight move-back spaces
    if (moveBackSpaces.includes(index)) {
      ctx.fillStyle = "#ffe5e5";
      ctx.strokeStyle = "#ff4b4b";
    } else if (index % 10 === 0) {
      ctx.fillStyle = "#e9f5ec";
      ctx.strokeStyle = "#00b86b";
    } else {
      ctx.fillStyle = "#f4f8fb";
      ctx.strokeStyle = "#00b86b";
    }
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#00b86b";
    ctx.font = "bold 12px Arial";
    ctx.fillText(index, x - 10, y + 5);

    // Draw move-back icon
    if (moveBackSpaces.includes(index)) {
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#ff4b4b";
      ctx.fillText("↩", x + 6, y - 8);
    }
  });

  // Draw players in the center of the space, with slight offsets to avoid overlap
  const playerOffsets = [
    {dx: 0, dy: 0},
    {dx: 16, dy: 0},
    {dx: 0, dy: 16},
    {dx: 16, dy: 16}
  ];
  players.forEach((player, idx) => {
    const [x, y] = boardPath[player.pos];
    const offset = playerOffsets[idx] || {dx: 0, dy: 0};
    ctx.save();
    ctx.shadowColor = "#00c805";
    ctx.shadowBlur = 6;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(x + offset.dx - 8, y + offset.dy - 8, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Draw "You" label above the player if it's the user
    if (player.name === "You") {
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#00c805";
      ctx.textAlign = "center";
      ctx.fillText("You", x + offset.dx - 8, y + offset.dy - 22);
      ctx.textAlign = "start";
    }
  });
}

function updateStatus() {
  const player = players[currentPlayer];
  statusDiv.innerHTML = `
    <h5 class="mb-2">🎲 <span class="text-success">Round ${round}</span></h5>
    <p class="mb-0"><strong class="text-success">${player.name}'s turn</strong> - Coins: <span class="fw-bold">${player.coins}</span></p>
  `;
}

function applyTileEffect(player) {
  // Bonus on multiples of 10 (except start), penalty on multiples of 15 (except start)
  if (player.pos % 10 === 0 && player.pos !== 0) {
    player.coins += 2;
  } else if (player.pos % 15 === 0 && player.pos !== 0) {
    player.coins = Math.max(0, player.coins - 2);
  }
  // Move back 2 spaces if on a move-back space (except start)
  if (moveBackSpaces.includes(player.pos) && player.pos !== 0) {
    player.pos = Math.max(0, player.pos - 2);
    // Optional: show a message for move-back
    statusDiv.innerHTML += `<p class="mt-2 text-danger">${player.name} landed on a <b>↩ Move Back</b> space and moves back 2!</p>`;
  }
}

function rollDice() {
  const player = players[currentPlayer];
  const roll = Math.floor(Math.random() * 6) + 1;
  player.pos = Math.min(player.pos + roll, boardPath.length - 1);
  drawBoard();

  // Show roll result
  statusDiv.innerHTML += `<p class="mt-2">${player.name} rolled a <span class="badge bg-success fs-6">${roll}</span> 🎲</p>`;

  // Apply tile effects (after moving)
  applyTileEffect(player);
  drawBoard();

  // Advance turn
  currentPlayer++;
  if (currentPlayer >= players.length) {
    currentPlayer = 0;
    round++;
  }

  if (round > maxRounds) {
    endGame();
  } else {
    setTimeout(() => {
      updateStatus();
      if (players[currentPlayer].name.startsWith("NPC")) {
        setTimeout(() => rollDice(), 500);
      }
    }, 300);
  }
}

function endGame() {
  rollButton.disabled = true;
  let standings = players
    .slice()
    .sort((a, b) => b.coins - a.coins)
    .map(p => `<span class="fw-bold text-success">${p.name}</span>: <span class="badge bg-success">${p.coins} coins</span>`)
    .join("<br>");

  statusDiv.innerHTML = `<h4 class="mb-3">🏁 <span class="text-success">Game Over</span></h4><p>${standings}</p>`;
}

rollButton.addEventListener("click", () => {
  if (!players[currentPlayer].name.startsWith("NPC")) {
    rollDice();
  }
});

// Start game
drawBoard();
updateStatus();
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/9starjump.mp3'); // Change path as needed
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

