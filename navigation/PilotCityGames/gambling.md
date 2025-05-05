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
</style>

<div class="slot-container">
  <h2 class="mb-4">🧬 Blood Cell Slot Machine</h2>
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
    <button class="btn btn-outline-success" onclick="buyUpgrade('speed')">🧠 Dopamine Rush (-50)</button>
    <button class="btn btn-outline-warning" onclick="buyUpgrade('double')">🔥 Caffeine (Double Rewards) (-1,000)</button>
    <button class="btn btn-outline-info" onclick="buyUpgrade('tworeel')">🎯 Vita (2-Reel Mode) (-10,000)</button>
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
    tworeel: false
  };

  const balanceEl = document.getElementById("balance");
  const spinBtn = document.getElementById("spinBtn");

  function updateBalanceDisplay() {
    balanceEl.textContent = bloodCells;
    spinBtn.disabled = bloodCells < SPIN_COST;
  }

  function weightedRandomSymbol() {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    for (let symbol in weights) {
      if (rand < weights[symbol]) return symbol;
      rand -= weights[symbol];
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
    } else {
      alert("❌ Not enough blood cells or already purchased.");
    }
    updateBalanceDisplay();
  }

  function spin() {
    if (bloodCells <= 0) {
      alert("❌ Game Over! You have no more blood cells.");
      return;
    }

    bloodCells -= SPIN_COST;
    updateBalanceDisplay();

    if (bloodCells === 1000000) {
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
      if (upgrades.double) reward *= 2;
      bloodCells += reward;
      resultText.innerText = `JACKPOT! You won ${reward.toLocaleString()} blood cells! 💉`;
      triggerConfetti(); // 🎉 Heavy yellow confetti
    } else {
      resultText.innerText = `No win. Try again!`;
    }

    updateBalanceDisplay();
  }

  function triggerConfetti() {
    const duration = 5000;
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
    const resultText = document.getElementById('result');
    resultText.innerText = "🎉 YOU WIN! You've reached 1,000,000 blood cells! 🎉";
    triggerConfetti();
    spinBtn.disabled = true;
    setTimeout(() => alert("You won the game! Refresh the page to play again."), 100);
  }

  updateBalanceDisplay();
</script>
