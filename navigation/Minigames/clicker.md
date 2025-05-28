---
layout: base
title: Clicker
description: A game like cookie clicker
permalink: /clicker
Author: Zach
---

<!-- Include Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
  body {
    background-color: #0e1111;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e5e5e5;
  }

  #game {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    padding: 20px;
  }

  #cookie-container {
    text-align: center;
    flex: 1;
  }

  #cookie {
    width: 200px;
    cursor: pointer;
    margin-bottom: 20px;
  }

  #upgrades {
    width: 350px;
    flex-shrink: 0;
  }

  .text-box {
    background-color: #1e3a8a; /* Robinhood-style deep blue */
    padding: 10px 15px;
    border-radius: 0.5rem;
    margin-bottom: 10px;
    box-shadow: 0 0 8px rgba(0,0,0,0.2);
    font-weight: 500;
    font-size: 1rem;
    color: #e5e5e5;
  }

  #golden-cookie {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: gold;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    animation: pulse 1s infinite;
    font-weight: bold;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
</style>

<div class="container py-4">
  <div id="game">
    <div id="cookie-container">
      <img id="cookie" src="{{site.baseurl}}/images/cookie.png" alt="Cookie" />
      <p id="cookie-count" class="text-box">Cookies: 0</p>
      <p id="cookies-per-second" class="text-box">Cookies per second: 0</p>
    </div>
    <div id="upgrades">
      <h2 class="text-box">Upgrades</h2>
      <ul id="upgrade-list" class="list-unstyled">
        <!-- Dynamically added upgrades -->
      </ul>
    </div>
  </div>
</div>

<script>
  let cookies = 0;
  let cookiesPerSecond = 0;
  const upgrades = [
    { name: "Cursor", cost: 15, cps: 0.1 },
    { name: "Grandma", cost: 100, cps: 1 },
    { name: "Farm", cost: 1100, cps: 8 },
    { name: "Mine", cost: 12000, cps: 47 },
    { name: "Factory", cost: 130000, cps: 260 },
    { name: "Bank", cost: 1400000, cps: 1400 },
    { name: "Temple", cost: 20000000, cps: 7800 },
    { name: "Wizard Tower", cost: 330000000, cps: 44000 },
    { name: "Shipment", cost: 5100000000, cps: 260000 },
    { name: "Alchemy Lab", cost: 75000000000, cps: 1600000 },
    { name: "Portal", cost: 1000000000000, cps: 10000000 },
  ];

  function updateDisplay() {
    document.getElementById("cookie-count").textContent = `Cookies: ${Math.floor(cookies)}`;
    document.getElementById("cookies-per-second").textContent = `Cookies per second: ${cookiesPerSecond.toFixed(1)}`;
  }

  function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (cookies >= upgrade.cost) {
      cookies -= upgrade.cost;
      cookiesPerSecond += upgrade.cps;
      upgrade.cost = Math.floor(upgrade.cost * 1.15); // Increase cost
      renderUpgrades();
      updateDisplay();
    }
  }

  function renderUpgrades() {
    const upgradeList = document.getElementById("upgrade-list");
    upgradeList.innerHTML = "";
    upgrades.forEach((upgrade, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="text-box">${upgrade.name} - Cost: ${upgrade.cost} - CPS: ${upgrade.cps}</div>`;
      li.onclick = () => buyUpgrade(index);
      upgradeList.appendChild(li);
    });
  }

  function spawnGoldenCookie() {
    const goldenCookie = document.createElement("div");
    goldenCookie.id = "golden-cookie";
    goldenCookie.textContent = "Golden Cookie!";
    goldenCookie.onclick = () => {
      cookies += cookies * 0.1; // 10% bonus
      goldenCookie.remove();
    };
    document.body.appendChild(goldenCookie);
    setTimeout(() => goldenCookie.remove(), 30000); // Remove after 30 seconds
  }

  document.getElementById("cookie").onclick = () => {
    cookies++;
    updateDisplay();
  };

  setInterval(() => {
    cookies += cookiesPerSecond / 10; // Update cookies every 100ms
    updateDisplay();
  }, 100);

  setInterval(spawnGoldenCookie, Math.random() * (300000 - 180000) + 180000); // Spawn every 3–5 minutes

  renderUpgrades();
  updateDisplay();
</script>

<!-- Background music setup -->
<script>
const music = new Audio('{{site.baseurl}}/assets/audio/28cheepcheepbeach.mp3');
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
