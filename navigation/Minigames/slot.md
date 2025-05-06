---
layout: bootstrap
title: Slot Game
description: Slot Game
permalink: /slot
Author: Ian
---

<!-- Bootstrap CDN -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

<style>
  body {
    background-color: #0e1111;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e5e5e5;
  }

  .slot-container {
    max-width: 500px;
    margin: auto;
    margin-top: 80px;
    background-color: #1e2222;
    border-radius: 16px;
    padding: 40px 20px;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
    text-align: center;
  }

  .reel-box {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
  }

  .reel {
    width: 70px;
    height: 70px;
    background-color: #111;
    border: 2px solid #0f0;
    border-radius: 12px;
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 0.6s ease-out;
    color: #0f0;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }

  @keyframes spin {
    0% { transform: rotateX(0deg); }
    100% { transform: rotateX(360deg); }
  }

  .btn-spin {
    background-color: #00c851;
    border: none;
    padding: 12px 30px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 10px;
    color: #fff;
    transition: background 0.3s;
  }

  .btn-spin:disabled {
    background-color: #444;
    cursor: not-allowed;
  }

  .btn-spin:hover:not(:disabled) {
    background-color: #00b44b;
  }

  .result {
    margin-top: 20px;
    font-size: 20px;
    font-weight: 600;
    color: #00ff88;
    min-height: 24px;
  }

  .balance {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 500;
    color: #66ffcc;
  }

  /* Objective text styling */
  .game-objective {
    font-size: 18px;
    color: #ffcc00;
    font-weight: bold;
    margin-bottom: 15px;
    opacity: 1;
    transition: opacity 0.25s ease;
  }

  /* Section titles */
  .upgrade-section {
    font-size: 18px;
    font-weight: bold;
    color: #e5e5e5;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  /* Button customization for upgrades */
  .btn-upgrade {
    font-size: 14px;
    font-weight: 500;
  }

  /* Highlight for the blood transfusion */
  .btn-blood-transfusion {
    background-color: #f1c40f;
    color: #000;
  }

  .btn-blood-transfusion:hover {
    background-color: #f39c12;
  }
</style>

<div class="slot-container">
  <h2 class="mb-4">🧬 Blood Cell Slot Machine</h2>
  <div class="game-objective" id="gameObjective">Objective: Spin the reels and win blood cells! Get up to 1,000,000 to WIN!!!</div>
  <div class="balance">Blood Cells: <span id="balance">100</span></div>
  <div class="reel-box my-4">
    <div class="reel" id="reel1">?</div>
    <div class="reel" id="reel2">?</div>
    <div class="reel" id="reel3">?</div>
  </div>
  <button class="btn btn-spin" id="spinBtn" onclick="spin()">Spin 🎯 (-5)</button>
  <div class="result" id="result"></div>
  
  <!-- Upgrade Buttons -->
  <div class="d-flex flex-column gap-2 mt-3">
    <div class="upgrade-section">Beneficial Upgrades</div>
    <button class="btn btn-outline-success btn-upgrade" onclick="buyUpgrade('speed')" data-bs-toggle="tooltip" title="Spins are 2x faster.">🧠 Dopamine Rush (-50)</button>
    <button class="btn btn-outline-warning btn-upgrade" onclick="buyUpgrade('double')" data-bs-toggle="tooltip" title="Double your rewards on winning spins.">🔥 Caffeine (Double Rewards) (-1,000)</button>
    <button class="btn btn-outline-info btn-upgrade" onclick="buyUpgrade('tworeel')" data-bs-toggle="tooltip" title="Only need 2 matching reels to win.">🎯 Vita (2-Reel Mode) (-10,000)</button>

    <div class="upgrade-section">Risky Upgrades</div>
    <button class="btn btn-outline-primary btn-upgrade" onclick="buyUpgrade('adrenaline')" data-bs-toggle="tooltip" title="Gain +100 blood cells after every spin, but rewards are reduced by 25%.">⚡ Adrenaline Boost (-2,000)</button>
    <button class="btn btn-outline-danger btn-upgrade" onclick="buyUpgrade('genetherapy')" data-bs-toggle="tooltip" title="Doubles chance for '7' and 'O' symbols, but spins cost 10 blood cells.">🧪 Gene Therapy (-5,000)</button>

    <div class="upgrade-section">Game-Changing Risky Upgrades</div>
    <button class="btn btn-blood-transfusion btn-upgrade" onclick="buyUpgrade('bloodTransfusion')" data-bs-toggle="tooltip" title="Take a risky chance to either win big or lose everything.">💉 Blood Transfusion (-50,000)</button>
  </div>
</div>

<script>
  const symbols = ["7", "O", "Y", "X", "Z"];
  const weights = { "7": 1, "O": 5, "Y": 10, "X": 20, "Z": 20 };
  const rewardMap = { "7": 1000000, "O": 10000, "Y": 1000, "X": 100, "Z": 100 };

  let bloodCells = 100;
  const SPIN_COST = 5;

  let upgrades = {
    speed: false,
    double: false,
    tworeel: false,
    adrenaline: false,
    genetherapy: false,
    bloodTransfusion: false
  };

  const balanceEl = document.getElementById("balance");
  const spinBtn = document.getElementById("spinBtn");

  function updateBalanceDisplay() {
    balanceEl.textContent = bloodCells;
    spinBtn.disabled = bloodCells < SPIN_COST;
  }

  function weightedRandomSymbol() {
    const customWeights = { ...weights };
    if (upgrades.genetherapy) {
      customWeights["7"] *= 2;
      customWeights["O"] *= 2;
    }
    const totalWeight = Object.values(customWeights).reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    for (let symbol in customWeights) {
      if (rand < customWeights[symbol]) return symbol;
      rand -= customWeights[symbol];
    }
  }

  function buyUpgrade(type) {
    if (type === 'speed' && bloodCells >= 50 && !upgrades.speed) {
      bloodCells -= 50;
      upgrades.speed = true;
      alert("🧠 Dopamine Rush activated! Spins are now 2x faster.");
    } else if (type === 'double' && bloodCells >= 1000 && !upgrades.double) {
      bloodCells -= 1000;
      upgrades.double = true;
      alert("🔥 Double Rewards activated!");
    } else if (type === 'tworeel' && bloodCells >= 10000 && !upgrades.tworeel) {
      bloodCells -= 10000;
      upgrades.tworeel = true;
      document.getElementById('reel3').style.display = 'none';
      alert("🎯 2-Reel Mode activated! You now only need 2 matching reels to win.");
    } else if (type === 'adrenaline' && bloodCells >= 2000 && !upgrades.adrenaline) {
      bloodCells -= 2000;
      upgrades.adrenaline = true;
      alert("⚡ Adrenaline Boost activated! +100 blood cells after each spin, but rewards are reduced.");
    } else if (type === 'genetherapy' && bloodCells >= 5000 && !upgrades.genetherapy) {
      bloodCells -= 5000;
      upgrades.genetherapy = true;
      alert("🧪 Gene Therapy activated! Better odds for top symbols, but spins now cost 10 blood cells.");
    } else if (type === 'bloodTransfusion' && bloodCells >= 50000) {
      bloodCells -= 50000;
      upgrades.bloodTransfusion = true;
      let outcome = Math.random();
      if (outcome < 0.5) {
        // Big Win
        let bonus = Math.floor(Math.random() * 500000) + 1000000; // Huge win, between 1M and 1.5M blood cells
        bloodCells += bonus;
        alert(`💉 Blood Transfusion succeeded! You gained ${bonus.toLocaleString()} blood cells!`);
      } else {
        // Big Loss
        bloodCells = 0;
        alert("💉 Blood Transfusion failed! You lost everything!");
      }
    } else {
      alert("❌ Not enough blood cells or already purchased.");
    }
    updateBalanceDisplay();
  }

  function spin() {
    const cost = upgrades.genetherapy ? SPIN_COST + 5 : SPIN_COST;

    if (bloodCells < cost) {
      alert("❌ Not enough blood cells.");
      return;
    }

    bloodCells -= cost;
    updateBalanceDisplay();

    if (bloodCells >= 1000000) {
      winGame();
      return;
    }

    const resultText = document.getElementById('result');
    resultText.innerText = "";

    const reelCount = upgrades.tworeel ? 2 : 3;
    const reels = [];
    const result = [];

    for (let i = 0; i < reelCount; i++) {
      reels.push(document.getElementById(`reel${i + 1}`));
    }

    reels.forEach((reel, i) => {
      let spins = 10 + i * 5;
      if (upgrades.speed) spins = Math.floor(spins / 2);

      let count = 0;
      const interval = setInterval(() => {
        const symbol = weightedRandomSymbol();
        reel.innerText = symbol;
        count++;
        if (count >= spins) {
          clearInterval(interval);
          result[i] = symbol;
          if (result.filter(Boolean).length === reelCount) {
            checkWin(result);

            // Adrenaline bonus
            if (upgrades.adrenaline) {
              bloodCells += 100;
              updateBalanceDisplay();
            }
          }
        }
      }, upgrades.speed ? 50 : 100);
    });
  }

  function checkWin(symbols) {
    const resultText = document.getElementById('result');
    const allMatch = symbols.every(s => s === symbols[0]);

    if (allMatch) {
      let reward = rewardMap[symbols[0]];
      if (upgrades.adrenaline) reward = Math.floor(reward * 0.75);
      if (upgrades.double) reward *= 2;
      bloodCells += reward;
      resultText.innerText = `JACKPOT! You won ${reward.toLocaleString()} blood cells! 💉`;
      triggerConfetti();
    } else {
      resultText.innerText = `No win. Try again!`;
    }

    updateBalanceDisplay();
  }

  function triggerConfetti() {
    const duration = 250;  // Reduced to 0.25 seconds
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 50,
        spread: 120,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#FFD700', '#FFFF00', '#FFEA00']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  function winGame() {
    alert("You’ve reached the maximum blood cells! Congratulations!");
    resetGame();
  }

  function resetGame() {
    bloodCells = 100;
    upgrades = {};
    updateBalanceDisplay();
  }

  // Objective flickering effect
  const objective = document.getElementById('gameObjective');
  setInterval(() => {
    if (objective.style.opacity === '1') {
      objective.style.opacity = '0';
    } else {
      objective.style.opacity = '1';
    }
  }, 250); // Flicker every 0.25 seconds
</script>
