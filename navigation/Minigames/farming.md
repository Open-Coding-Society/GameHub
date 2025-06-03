---
layout: base
title: Farming
description: Farming Game
permalink: /farming
Author: Ian & Zach
---

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Harvest Haven</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
  body {
    background-color: #f8f9fa;
    font-family: 'Arial', sans-serif;
  }
  #gameCanvas {
    width: 960px; /* Increased width by 1.25x */
    height: 700px; /* Increased height by 1.25x */
    border: 3px solid #495057;
    border-radius: 5px;
    background-color: #8b9d83;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    image-rendering: pixelated;
    margin-left: -450px; /* Keep the left margin unchanged */
  }
  .inventory-slot {
    width: 60px;
    height: 60px;
    border: 2px solid #6c757d;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 3px;
    background-color: #e9ecef;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 2rem;
    position: relative;
    overflow: hidden;
  }
  .inventory-slot.selected-slot {
    border: 3px solid #0d6efd;
    background-color: #cfe2ff;
    animation: slotPulse 0.5s;
  }
  @keyframes slotPulse {
    0% { box-shadow: 0 0 0 0 #0d6efd44; }
    100% { box-shadow: 0 0 10px 5px #0d6efd22; }
  }
  .inventory-slot .slot-label {
    font-size: 0.8rem; /* Slightly smaller font size */
    text-align: center; /* Center the text */
    max-width: 15ch; /* Limit text to 15 characters */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    bottom: 50%; /* Center vertically */
    left: 50%; /* Center horizontally */
    transform: translate(-50%, 50%); /* Adjust for perfect centering */
    color: #495057;
    background: #fff8;
    border-radius: 3px;
    padding: 0 2px;
  }
  .card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  .card-header {
    font-weight: bold;
    background-color: #e9ecef;
  }
  .controls {
    background-color: #e9ecef;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
  }
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  .modal-content {
    border-radius: 10px;
  }
  .merchant-item {
    transition: all 0.2s;
  }
  .merchant-item:hover {
    transform: translateY(-3px);
  }
  .btn-coins {
    background: #28a745 !important; /* Green button */
    color: #ffffff !important;
    border: none !important;
    margin-left: 5px; /* Adjusted spacing */
    padding: 8px 12px; /* Slightly smaller size */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .btn-coins:hover {
    background: #218838 !important; /* Darker green on hover */
  }
  .popup-modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border: 2px solid #28a745;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  .popup-modal .close-btn {
    background: #dc3545;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    float: right;
  }
  .popup-modal .close-btn:hover {
    background: #c82333;
  }
  .title-section {
    margin-left: -800px; /* Move title 1500px to the left */
  }
  hr {
    width: 100%; /* Make the horizontal rule span the full width of the screen */
    margin: 0; /* Remove default margins */
  }
  .crafting-menu {
    display: none; /* Hide crafting menu */
  }
</style>

<div class="container py-4">
  <div class="text-center mb-4 title-section"> <!-- Updated margin for left alignment -->
    <h1 class="display-4">Harvest Haven</h1>
    <p class="lead d-inline">A Farming Adventure Game -</p>
    <button class="btn-coins d-inline" id="coinsBtn">Controls</button> <!-- Added Controls button -->
  </div>

  <!-- Controls Popup -->
  <div id="controlsPopup" class="popup-modal">
    <button class="close-btn" onclick="closePopup('controlsPopup')">&times;</button>
    <h4>Controls</h4>
    <ul style="margin-bottom:0;">
      <li><span style="color:gray;">Movement</span>: Use WASD to move</li>
      <li><span style="color:green;">Interact</span>: Click E or an object when next to it to interact</li>
      <li><span style="color:#003366;">Inventory</span>: Click I to open inventory</li>
      <li><span style="color:purple;">Select</span>: Click on items from inventory to select</li>
      <li><span style="color:orange;">Merchant</span>: Click E or on the merchant to buy items</li>
      <li><span style="color:red;">Gold</span>: Collect Gold to progress through the game</li>
      <li><span style="color:#00bfff;">Resources</span>: Gain resources through farming, breaking, and storing items</li>
    </ul>
  </div>

  <div class="row">
    <div class="col-lg-7">
      <canvas id="gameCanvas" width="1000" height="750" tabindex="0"></canvas> <!-- Updated dimensions -->
    </div>
    <div class="col-lg-5 d-flex flex-column">
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>Player Inventory</span>
          <span class="badge bg-primary">12 slots</span>
        </div>
        <div class="card-body" id="inventory">
          <!-- Inventory slots will be generated by JS -->
        </div>
      </div>
      <div class="card mb-3">
        <div class="card-header">Stats</div>
        <div class="card-body">
          <p><strong>Gold:</strong> <span id="coins" class="badge bg-success">100</span></p>
          <p><strong>Day:</strong> <span id="day" class="badge bg-info">1</span></p>
          <p><strong>Time:</strong> <span id="time" class="badge bg-secondary">12:00 AM</span></p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">Shipping Bin</div>
        <div class="card-body">
          <p id="currentTool">None selected</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Merchant Modal -->
<div class="modal fade" id="merchantModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Merchant's Shop</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="alert alert-info">
          "Hello farmer! What can I do for you today?"
        </div>
        <h6 class="mt-3 mb-2">Buy Items</h6>
        <div class="row" id="merchantItems">
          <!-- Merchant items will be populated by JS -->
        </div>
        <hr>
        <h6 class="mt-3 mb-2">Sell Items</h6>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <button class="btn btn-success sell-btn">Sell All Crops</button>
            <button class="btn btn-success sell-btn ms-2">Sell All Ores</button>
          </div>
          <div>
            <button class="btn btn-danger sell-btn">Sell Everything</button>
          </div>
        </div>
        <div id="sellPreview" class="bg-light p-2 rounded">
          <!-- Items to sell will appear here -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
  // Ensure the Controls button functionality works
  document.getElementById('coinsBtn').onclick = function() {
    const coinsPopup = document.getElementById('controlsPopup');
    if (coinsPopup) {
      coinsPopup.style.display = 'block';
    } else {
      console.error('Controls popup element not found.');
    }
  };

  function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.style.display = 'none';
    } else {
      console.error(`Popup with ID "${popupId}" not found.`);
    }
  }

  // --- Emoji assets ---
  const EMOJIS = {
    player: "👨‍🌾",
    merchant: "🧑‍🦳",
    wheat: "🌾",
    carrot: "🥕",
    pumpkin: "🎃",
    copper: "🟤",
    iron: "⚪",
    gold: "🟡",
    diamond: "💎",
    tilled: "⬛",
    grass: "🟩",
    water: "🟦",
    dirt: "🟫",
    house: "🏠",
    mailbox: "📬",
    bed: "🛏️",
    chest: "📦"
  };
const TILE_SIZE = 32;
  const PLAYER_SIZE = 32;
const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const coinsDisplay = document.getElementById('coins');
  const dayDisplay = document.getElementById('day');
  const timeDisplay = document.getElementById('time');
  const inventoryDiv = document.getElementById('inventory');
  const currentToolDisplay = document.getElementById('currentTool');
  let merchantModal = null;
  // --- Game State ---
  const gameState = {
    player: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      speed: 4,
      direction: 'down',
      inventory: Array(36).fill(null), // 36 slots
      coins: 100,
      selectedSlot: null,
      inventoryPage: 0, // Tracks the current inventory page (0, 1, 2)
      tools: {
        woodenPickaxe: { name: 'Wooden Pickaxe', type: 'tool', uses: Infinity, action: 'mine', emoji: "⛏️" },
        woodenAxe: { name: 'Wooden Axe', type: 'tool', uses: Infinity, action: 'chop', emoji: "🪓" },
        woodenShovel: { name: 'Wooden Shovel', type: 'tool', uses: Infinity, action: 'dig', emoji: "<img src='{{ site.baseurl }}/images/shovel.png' alt='Shovel' style='width: 48px; height: 48px; position: relative; top: 10px;'>" },
        woodenHoe: { name: 'Wooden Hoe', type: 'tool', uses: Infinity, action: 'till', emoji: "<img src='{{ site.baseurl }}/images/hoe.png' alt='Hoe' style='width: 48px; height: 48px; position: relative; top: 10px;'>" },
        woodenWateringCan: { name: 'Wooden Watering Can', type: 'tool', uses: Infinity, action: 'water', emoji: "<img src='{{ site.baseurl }}/images/can.png' alt='Watering Can' style='width: 48px; height: 48px; position: relative; top: 10px;'>"},
      }
    },
    map: {
      tiles: [],
      width: Math.floor(canvas.width / TILE_SIZE),
      height: Math.floor(canvas.height / TILE_SIZE),
      tileSize: TILE_SIZE,
      homeBase: { x: 12, y: 9 },
      mailboxPosition: { x: 13, y: 9 },
      bedPosition: { x: 12, y: 10 },
      chestPosition: { x: 11, y: 9 },
      merchantPosition: { x: 3, y: 3 }
    },
    crops: [],
    ores: [],
    merchant: {
      items: [
        { name: 'Wheat Seed', type: 'seed', price: 10, rarity: 'common', growthTime: 3, produces: 'Wheat', emoji: EMOJIS.wheat },
        { name: 'Carrot Seed', type: 'seed', price: 20, rarity: 'uncommon', growthTime: 5, produces: 'Carrot', emoji: EMOJIS.carrot },
        { name: 'Pumpkin Seed', type: 'seed', price: 50, rarity: 'rare', growthTime: 8, produces: 'Pumpkin', emoji: EMOJIS.pumpkin },
        { name: 'Fertilizer', type: 'item', price: 30, effect: 'growthSpeed', value: 0.8, emoji: "💩" }
      ]
    },
    time: {
      day: 1, // Start at day 1
      hour: 12, // Start at 12:00 AM
      minute: 0,
      isPM: false, // Start at AM
      paused: true // Start paused for 5 seconds
    },
    keys: { w: false, a: false, s: false, d: false, e: false }
  };
// Prepopulate first page slots
gameState.player.inventory[0] = gameState.player.tools.woodenAxe;
gameState.player.inventory[1] = gameState.player.tools.woodenPickaxe;
gameState.player.inventory[2] = gameState.player.tools.woodenShovel;
gameState.player.inventory[3] = gameState.player.tools.woodenHoe;
gameState.player.inventory[4] = gameState.player.tools.woodenWateringCan;
// --- Map Generation ---
  function generateMap() {
    for (let y = 0; y < gameState.map.height; y++) {
      gameState.map.tiles[y] = [];
      for (let x = 0; x < gameState.map.width; x++) {
        if (Math.random() < 0.08) {
          gameState.map.tiles[y][x] = 'water';
        } else if (Math.random() < 0.18) {
          gameState.map.tiles[y][x] = 'grass';
        } else {
          gameState.map.tiles[y][x] = 'dirt';
        }
      }
    }
    gameState.map.tiles[gameState.map.homeBase.y][gameState.map.homeBase.x] = 'house';
    gameState.map.tiles[gameState.map.mailboxPosition.y][gameState.map.mailboxPosition.x] = 'mailbox';
    gameState.map.tiles[gameState.map.bedPosition.y][gameState.map.bedPosition.x] = 'bed';
    gameState.map.tiles[gameState.map.chestPosition.y][gameState.map.chestPosition.x] = 'chest';
    for (let y = 7; y < 12; y++) {
      for (let x = 10; x < 18; x++) {
        gameState.map.tiles[y][x] = 'tilled_soil';
      }
    }
    gameState.map.tiles[gameState.map.merchantPosition.y][gameState.map.merchantPosition.x] = 'dirt';
  }
// --- Ore Generation ---
  function generateOres() {
    gameState.ores = [];
    const oreTypes = [
      { name: 'Copper Ore', rarity: 'common', value: 20, spawnChance: 0.08, emoji: EMOJIS.copper },
      { name: 'Iron Ore', rarity: 'uncommon', value: 50, spawnChance: 0.04, emoji: EMOJIS.iron },
      { name: 'Gold Ore', rarity: 'rare', value: 100, spawnChance: 0.015, emoji: EMOJIS.gold },
      { name: 'Diamond', rarity: 'legendary', value: 500, spawnChance: 0.005, emoji: EMOJIS.diamond }
    ];
    for (let y = 0; y < gameState.map.height; y++) {
      for (let x = 0; x < gameState.map.width; x++) {
        if (gameState.map.tiles[y][x] === 'dirt' || gameState.map.tiles[y][x] === 'grass') {
          for (const ore of oreTypes) {
            if (Math.random() < ore.spawnChance) {
              gameState.ores.push({
                x: x * gameState.map.tileSize,
                y: y * gameState.map.tileSize,
                type: ore.name,
                rarity: ore.rarity,
                value: ore.value,
                emoji: ore.emoji
              });
              break;
            }
          }
        }
      }
    }
  }
// --- Inventory Management ---
  function setupInventory() {
    inventoryDiv.innerHTML = '';
    const startIndex = gameState.player.inventoryPage * 12;
    const endIndex = startIndex + 12;

    for (let i = startIndex; i < endIndex; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      if (i === gameState.player.selectedSlot) slot.classList.add('selected-slot');
      slot.id = `slot-${i}`;
      slot.addEventListener('click', () => selectItem(i));
      const item = gameState.player.inventory[i];
      if (item) {
        const displayName = getToolDisplayName(item.name);
        slot.innerHTML = `${item.emoji || getItemEmoji(item)}<span class="slot-label">${displayName}</span>`;
        slot.title = item.name; // Full name as tooltip
      }
      inventoryDiv.appendChild(slot);
    }

    // Add navigation buttons for inventory pages
    const navDiv = document.createElement('div');
    navDiv.className = 'inventory-nav d-flex justify-content-between mt-2';
    const prevButton = document.createElement('button');
    prevButton.className = 'btn btn-sm btn-secondary';
    prevButton.textContent = 'Previous';
    prevButton.disabled = gameState.player.inventoryPage === 0;
    prevButton.addEventListener('click', () => changeInventoryPage(-1));
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-sm btn-secondary';
    nextButton.textContent = 'Next';
    nextButton.disabled = gameState.player.inventoryPage === 2;
    nextButton.addEventListener('click', () => changeInventoryPage(1));
    navDiv.appendChild(prevButton);
    navDiv.appendChild(nextButton);
    inventoryDiv.appendChild(navDiv);
coinsDisplay.textContent = gameState.player.coins;
const sel = gameState.player.selectedSlot;
if (sel !== null && gameState.player.inventory[sel]) {
  const selectedItem = gameState.player.inventory[sel];
  currentToolDisplay.innerHTML = `${selectedItem.name}`; // Display only the name
} else {
  currentToolDisplay.innerHTML = 'None selected';
}
  }
function changeInventoryPage(direction) {
    gameState.player.inventoryPage += direction;
    setupInventory();
  }
function selectItem(slotIndex) {
    gameState.player.selectedSlot = slotIndex;
    setupInventory();
  }
  function getToolDisplayName(name) {
    const toolNames = {
      "Wooden Axe": "Axe",
      "Wooden Pickaxe": "Pickaxe",
      "Wooden Shovel": "Shovel",
      "Wooden Hoe": "Hoe",
      "Wooden Watering Can": "Watering Can"
    };
    return toolNames[name] || abbreviateName(name); // Use full name for tools, abbreviate others
  }
  function abbreviateName(name) {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}. ${parts.slice(1).join(' ')}`.slice(0, 15); // Abbreviate and limit to 15 characters
    }
    return name.slice(0, 15); // Limit single-word names to 15 characters
  }
  // --- Time System ---
  function updateTime() {
    const timeIncrement = 20 * 1000; // 20 seconds per hour
    const minutesPerHour = 60;

    gameState.time.minute += minutesPerHour / (timeIncrement / 1000);
    if (gameState.time.minute >= minutesPerHour) {
      gameState.time.minute = 0;
      gameState.time.hour++;
      if (gameState.time.hour > 12) {
        gameState.time.hour = 1; // Reset to 1 after 12
      }
      if (gameState.time.hour === 12) {
        gameState.time.isPM = !gameState.time.isPM; // Toggle AM/PM at 12
        if (!gameState.time.isPM) {
          gameState.time.day++; // Increment day at 12:00 AM
          regenerateMap(); // Reset and regenerate map
          updateCrops();
          if (Math.random() < 0.3) generateOres();
        }
      }
    }

    const hourStr = gameState.time.hour.toString().padStart(2, '0');
    const minuteStr = gameState.time.minute.toString().padStart(2, '0');
    const period = gameState.time.isPM ? 'PM' : 'AM';
    timeDisplay.textContent = `${hourStr}:${minuteStr} ${period}`;
    dayDisplay.textContent = `${gameState.time.day}`; // Display only the day number
  }

  function regenerateMap() {
    gameState.map.tiles = [];
    for (let y = 0; y < gameState.map.height; y++) {
      gameState.map.tiles[y] = [];
      for (let x = 0; x < gameState.map.width; x++) {
        if (Math.random() < 0.08) {
          gameState.map.tiles[y][x] = 'water';
        } else if (Math.random() < 0.18) {
          gameState.map.tiles[y][x] = 'grass';
        } else {
          gameState.map.tiles[y][x] = 'dirt';
        }
      }
    }
    gameState.map.tiles[gameState.map.homeBase.y][gameState.map.homeBase.x] = 'house';
    gameState.map.tiles[gameState.map.mailboxPosition.y][gameState.map.mailboxPosition.x] = 'mailbox';
    gameState.map.tiles[gameState.map.bedPosition.y][gameState.map.bedPosition.x] = 'bed';
    gameState.map.tiles[gameState.map.chestPosition.y][gameState.map.chestPosition.x] = 'chest';
    for (let y = 7; y < 12; y++) {
      for (let x = 10; x < 18; x++) {
        gameState.map.tiles[y][x] = 'tilled_soil';
      }
    }
    gameState.map.tiles[gameState.map.merchantPosition.y][gameState.map.merchantPosition.x] = 'dirt';
    generateOres(); // Regenerate ores for the new map
  }
  // --- Crop Growth ---
  function updateCrops() {
    for (const crop of gameState.crops) {
      if (crop.growth < crop.growthTime) {
        crop.growth++;
        if (crop.growth === crop.growthTime) crop.ready = true;
      }
    }
  }
  // --- Drawing Functions (with emoji and animation) ---
  let playerAnimFrame = 0;
  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw map
    for (let y = 0; y < gameState.map.height; y++) {
      for (let x = 0; x < gameState.map.width; x++) {
        const tile = gameState.map.tiles[y][x];
        let emoji = EMOJIS.dirt;
        if (tile === 'water') emoji = EMOJIS.water;
        else if (tile === 'grass') emoji = EMOJIS.grass;
        else if (tile === 'tilled_soil') emoji = EMOJIS.tilled;
        else if (tile === 'house') emoji = "🏠";
        else if (tile === 'mailbox') emoji = "📬";
        else if (tile === 'bed') emoji = "🛏️";
        else if (tile === 'chest') emoji = "📦";
        drawEmoji(emoji, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE);
      }
    }
    // Merchant
    drawEmoji(EMOJIS.merchant, gameState.map.merchantPosition.x * TILE_SIZE, gameState.map.merchantPosition.y * TILE_SIZE, TILE_SIZE);
    // Ores
    for (const ore of gameState.ores) {
      drawEmoji(ore.emoji, ore.x, ore.y, TILE_SIZE);
    }
    // Crops
    for (const crop of gameState.crops) {
      let emoji = getCropEmoji(crop.type);
      if (!crop.ready) {
        // Animate growing: pulse opacity
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(Date.now()/400 + crop.x);
      }
      drawEmoji(emoji, crop.x, crop.y, TILE_SIZE);
      ctx.globalAlpha = 1;
      // Growth bar
      if (!crop.ready) {
        ctx.fillStyle = "#222";
        ctx.fillRect(crop.x, crop.y + TILE_SIZE - 6, TILE_SIZE, 5);
        ctx.fillStyle = "#6c3";
        ctx.fillRect(crop.x, crop.y + TILE_SIZE - 6, TILE_SIZE * (crop.growth / crop.growthTime), 5);
      }
    }
    // Player (emoji, animated bounce)
    const px = gameState.player.x;
    const py = gameState.player.y;
    const bounce = Math.sin(Date.now()/200) * 3;
    ctx.font = `${PLAYER_SIZE}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(px + PLAYER_SIZE/2, py + PLAYER_SIZE/2 + bounce);
    ctx.rotate(0.05 * Math.sin(Date.now()/300));
    ctx.fillText(EMOJIS.player, 0, 0);
    ctx.restore();
  }
  function drawEmoji(emoji, x, y, size) {
    ctx.font = `${size}px serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(emoji, x, y);
  }
  function getCropEmoji(type) {
    if (type === 'Wheat') return EMOJIS.wheat;
    if (type === 'Carrot') return EMOJIS.carrot;
    if (type === 'Pumpkin') return EMOJIS.pumpkin;
    return EMOJIS.grass;
  }
  function getItemEmoji(item) {
    if (item.type === 'tool') return item.emoji;
    if (item.type === 'seed') return getCropEmoji(item.produces);
    if (item.type === 'crop') return getCropEmoji(item.name);
    if (item.type === 'ore') {
      if (item.name === 'Copper Ore') return EMOJIS.copper;
      if (item.name === 'Iron Ore') return EMOJIS.iron;
      if (item.name === 'Gold Ore') return EMOJIS.gold;
      if (item.name === 'Diamond') return EMOJIS.diamond;
    }
    return "❓";
  }
  // --- Input Handling ---
  gameState.time.paused = true; // Keep the timer paused initially
let hasStartedMoving = false; // Track if the player has started moving

function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  if (key in gameState.keys) {
    gameState.keys[key] = true;
    if (!hasStartedMoving && (key === 'w' || key === 'a' || key === 's' || key === 'd')) {
      hasStartedMoving = true;
      gameState.time.paused = false; // Start the timer when movement begins
    }
    if (key === 'e') interact();
  }
}
function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (key in gameState.keys) gameState.keys[key] = false;
  }
  function updatePlayerPosition() {
    if (gameState.keys.w) { gameState.player.y -= gameState.player.speed; gameState.player.direction = 'up'; }
    if (gameState.keys.s) { gameState.player.y += gameState.player.speed; gameState.player.direction = 'down'; }
    if (gameState.keys.a) { gameState.player.x -= gameState.player.speed; gameState.player.direction = 'left'; }
    if (gameState.keys.d) { gameState.player.x += gameState.player.speed; gameState.player.direction = 'right'; }
    gameState.player.x = Math.max(0, Math.min(canvas.width - PLAYER_SIZE, gameState.player.x));
    gameState.player.y = Math.max(0, Math.min(canvas.height - PLAYER_SIZE, gameState.player.y));
  }
  // --- Mouse/Keyboard Interact ---
  function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const { tileX, tileY } = getTileAtPixel(mouseX, mouseY);
    const obj = getObjectAtTile(tileX, tileY);
    if (!obj) return;
    if (obj.type === 'merchant') openMerchant();
    else if (obj.type === 'crop') harvestCrop(obj.index, true);
    else if (obj.type === 'ore') mineOre(obj.index, true);
    else if (obj.type === 'tilled_soil') plantCrop(tileX, tileY, getSelectedSeed());
  }
  function handleCanvasHover(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const { tileX, tileY } = getTileAtPixel(mouseX, mouseY);
    const obj = getObjectAtTile(tileX, tileY);
    canvas.style.cursor = obj ? 'pointer' : 'default';
  }
  // --- Game Loop ---
  function gameLoop() {
    if (!gameState.time.paused) {
      updateTime();
      updatePlayerPosition();
    }
    drawGame();
    setTimeout(gameLoop, 5 * 1000 / 60); // Adjust game loop for 5 seconds per hour
  }
  // --- Init ---
  function initGame() {
    generateMap();
    generateOres();
    setupInventory();
    gameState.player.inventory.push(gameState.player.tools.sickle);
    gameState.player.inventory.push(gameState.player.tools.pickaxe);
    merchantModal = new bootstrap.Modal(document.getElementById('merchantModal'));
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasHover);

    gameLoop();
  }

  window.onload = initGame;
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/27mariocircuit.mp3');
music.loop = true;
music.volume = 0.5;
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>