---
layout: base
title: Farming
description: Farming Game
permalink: /farming
Author: Zach & Ian
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Farming Game</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f8f9fa;
      padding: 2rem;
    }

    .farm-container {
      display: grid;
      grid-template-columns: repeat(5, 80px);
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .plot {
      width: 80px;
      height: 80px;
      background-color: #a0d468;
      border: 2px solid #6c757d;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: background-color 0.3s;
      user-select: none;
    }

    .tilled { background-color: #c3e6cb; }
    .watered { background-color: #ffeeba; }
    .planted { background-color: #f5c6cb; }
    .grown { background-color: #d4edda; }

    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border: 1px solid #ccc;
      padding: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      display: none;
    }

    .popup ul {
      text-align: left;
    }

    .popup .close-btn {
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;
      font-size: 1.2rem;
      color: red;
    }
  </style>
</head>
<body>
  <div class="container text-center">
    <h1 class="mb-4">🌻 Simple Farming Game 🧑‍🌾</h1>

    <div class="mb-3">
      <span id="gold">Gold: 50</span>
    </div>

    <div class="mb-3 d-flex justify-content-center">
      <button class="btn btn-secondary me-2" onclick="selectTool('hoe')">Hoe</button>
      <button class="btn btn-primary me-2" onclick="selectTool('water')">Water</button>
      <button class="btn btn-success me-2" onclick="buySeed('parsnip', 1)">Buy Parsnip Seed (Cost: 1 gold)</button>
      <button class="btn btn-success me-2" onclick="buySeed('tomato', 2)">Buy Tomato Seed (Cost: 2 gold)</button>
      <button class="btn btn-success" onclick="buySeed('carrot', 3)">Buy Carrot Seed (Cost: 3 gold)</button>
    </div>

    <div class="farm-container" id="farm"></div>

    <div class="mt-3 d-flex justify-content-center">
      <button class="btn btn-info me-2" onclick="showInstructions()">How to Play</button>
      <button class="btn btn-warning me-2" onclick="sellCrops()">Sell Crops</button>
      <button class="btn btn-danger" onclick="buyPortal()">Buy Portal (1000 Gold)</button>
    </div>

    <div class="mt-3" id="message"></div>
  </div>

  <div class="popup" id="instructionsPopup">
    <span class="close-btn" onclick="closeInstructions()">✖</span>
    <h3>How to Play</h3>
    <ul>
      <li>Use the Hoe to till soil.</li>
      <li>Buy seeds and plant them in tilled soil.</li>
      <li>Water planted seeds to start growth.</li>
      <li>Wait for crops to grow.</li>
      <li>Sell grown crops for gold.</li>
      <li>Buy the Portal for 1000 gold to win the game!</li>
    </ul>
  </div>

  <div class="popup" id="portalPopup" style="display: none;">
    <h3>Congratulations! You bought the Portal!</h3>
    <button class="btn btn-success me-2" onclick="continuePlaying()">Continue Playing</button>
    <button class="btn btn-danger" onclick="restartGame()">Restart Game</button>
  </div>

  <div class="popup" id="goldPopup" style="display: none;">
    <h3>Out of Gold!</h3>
    <p>You have been given 20 gold to buy more crops.</p>
    <button class="btn btn-primary" onclick="closeGoldPopup()">OK</button>
  </div>

  <script>
    const farm = document.getElementById('farm');
    const goldDisplay = document.getElementById('gold');
    const messageDisplay = document.getElementById('message');
    const instructionsPopup = document.getElementById('instructionsPopup');
    const portalPopup = document.getElementById('portalPopup');
    const goldPopup = document.getElementById('goldPopup');

    let gold = 50; // Start with 50 gold
    let selectedTool = 'hoe';
    let seedAvailable = null; // Track the type of seed available to plant
    let portalPurchased = false; // Track if the Portal has been purchased

    const cropData = {
      parsnip: { emoji: '🥬', value: 5, growTime: 5000 },
      tomato: { emoji: '🍅', value: 12, growTime: 10000 },
      carrot: { emoji: '🥕', value: 24, growTime: 20000 }
    };

    const plots = [];

    function selectTool(tool) {
      selectedTool = tool;
      messageDisplay.textContent = `Selected tool: ${tool}`;
    }

    function updateGold(amount) {
      gold += amount;
      goldDisplay.textContent = `Gold: ${gold}`;
      if (gold <= 0) {
        gold = 20; // Give user 20 gold
        updateGold(0); // Update display
        goldPopup.style.display = 'block';
      }
    }

    function buySeed(seedType, cost) {
      if (gold >= cost) {
        selectedTool = seedType;
        seedAvailable = seedType; // Allow planting the seed
        gold -= cost;
        updateGold(0); // Update display
        messageDisplay.textContent = `Bought ${seedType} seed for ${cost} gold.`;
      } else {
        messageDisplay.textContent = `Not enough gold to buy ${seedType} seed.`;
      }
    }

    function createFarm() {
      farm.innerHTML = ''; // Clear existing plots
      plots.length = 0; // Reset plots array
      for (let i = 0; i < 15; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.dataset.state = 'empty';
        plot.dataset.crop = '';
        plot.innerText = '';
        plot.addEventListener('click', () => interact(plot));
        farm.appendChild(plot);
        plots.push(plot);
      }
    }

    function interact(plot) {
      const state = plot.dataset.state;
      const crop = plot.dataset.crop;

      if (selectedTool === 'hoe' && state === 'empty') {
        plot.dataset.state = 'tilled';
        plot.className = 'plot tilled';
        plot.innerText = '';
      } else if (cropData[selectedTool] && state === 'tilled' && seedAvailable === selectedTool) {
        plot.dataset.state = 'planted';
        plot.dataset.crop = selectedTool;
        plot.className = 'plot planted';
        plot.innerText = cropData[selectedTool].emoji;
        seedAvailable = null; // Reset seed availability after planting
      } else if (selectedTool === 'water' && state === 'planted') {
        growCrop(plot, plot.dataset.crop);
        plot.dataset.state = 'watered';
        plot.className = 'plot watered';
        plot.innerText = cropData[plot.dataset.crop].emoji;
      } else if (state === 'grown') {
        const cropType = plot.dataset.crop;
        const value = cropData[cropType].value;
        updateGold(value);
        plot.dataset.state = 'empty';
        plot.dataset.crop = '';
        plot.className = 'plot';
        plot.innerText = '';
        messageDisplay.textContent = `Sold ${cropType} for ${value} gold.`;
      } else {
        messageDisplay.textContent = 'Invalid action.';
      }
    }

    function growCrop(plot, cropType) {
      setTimeout(() => {
        if (plot.dataset.state === 'watered' && plot.dataset.crop === cropType) {
          plot.dataset.state = 'grown';
          plot.className = 'plot grown';
          plot.innerText = cropData[cropType].emoji;
        }
      }, cropData[cropType].growTime);
    }

    function sellCrops() {
      let total = 0;
      plots.forEach(plot => {
        if (plot.dataset.state === 'grown') {
          const cropType = plot.dataset.crop;
          const value = cropData[cropType].value;
          total += value;
          plot.dataset.state = 'empty';
          plot.dataset.crop = '';
          plot.className = 'plot';
          plot.innerText = '';
        }
      });
      if (total > 0) {
        updateGold(total);
        messageDisplay.textContent = `Sold crops for ${total} gold.`;
      } else {
        messageDisplay.textContent = 'No crops to sell.';
      }
    }

    function buyPortal() {
      if (portalPurchased) {
        portalPopup.style.display = 'block';
        return;
      }
      if (gold >= 1000) {
        gold -= 1000;
        updateGold(0); // Update display
        portalPopup.style.display = 'block';
        portalPurchased = true; // Mark Portal as purchased
      } else {
        messageDisplay.textContent = 'Not enough gold to buy the Portal.';
      }
    }

    function continuePlaying() {
      portalPopup.style.display = 'none';
      messageDisplay.textContent = 'You chose to continue playing!';
    }

    function restartGame() {
      gold = 50; // Reset gold
      selectedTool = 'hoe'; // Reset tool
      seedAvailable = null; // Reset seed availability
      portalPurchased = false; // Reset portal purchase status
      updateGold(0); // Update gold display
      messageDisplay.textContent = ''; // Clear message
      createFarm(); // Reset farm plots
    }

    function showInstructions() {
      instructionsPopup.style.display = 'block';
    }

    function closeInstructions() {
      instructionsPopup.style.display = 'none';
    }

    function closeGoldPopup() {
      goldPopup.style.display = 'none';
    }

    createFarm();
  </script>
</body>
</html>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/27mariocircuit.mp3'); // Change path as needed
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