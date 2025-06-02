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
    background: url('{{site.baseurl}}/images/background129.jpeg') no-repeat center center fixed; /* Add background image */
    background-size: cover;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #f5f5f5;
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
    position: relative; /* Enable positioning of child elements */
  }

  #cookie {
    position: absolute;
    top: 200px; /* Move down by an additional 100px */
    left: 50%;
    transform: translateX(-50%);
    width: 250px; /* Slightly larger cookie */
    cursor: pointer;
    margin-bottom: 20px;
    transition: transform 0.2s;
  }

  #cookie:hover {
    transform: translateX(-50%) scale(1.1); /* Add hover effect */
  }

  #upgrades-title {
    width: 100%; /* Same width as other boxes */
    height: 33%; /* 1/3rd the height */
    text-align: center;
    margin: auto; /* Center horizontally */
    font-size: 1.5rem; /* Adjust font size */
    color: white;
    margin-bottom: 10px; /* Add spacing below */
    background-color: #444444; /* Match other boxes */
    padding: 10px;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  #upgrades {
    width: 400px;
    flex-shrink: 0;
  }

  #upgrade-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    gap: 20px; /* Space between boxes */
    width: 100%; /* Full width */
    margin: auto; /* Center the grid */
  }

  .upgrade-box {
    background-color: #444444; /* Dark gray for a sleek look */
    padding: 15px 20px;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    font-size: 1.2rem;
    color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #golden-cookie {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, gold, orange);
    padding: 15px;
    border-radius: 50%;
    cursor: pointer;
    animation: pulse 1s infinite;
    font-weight: bold;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  button {
    background-color: #444444; /* Styled buttons */
    color: #f5f5f5;
    border: none;
    padding: 10px 20px;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  button:hover {
    background-color: #555555; /* Highlight on hover */
    transform: scale(1.05); /* Slight hover effect */
  }

  #pointer {
    position: absolute;
    top: calc(50% + 250px); /* Move down further */
    left: calc(30% - 50px); /* Keep the left position unchanged */
    transform: translate(-50%, -50%);
    font-size: 3rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    animation: bounce 1s infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #pointer img {
    width: 200px; /* 2x bigger */
    transform: rotate(90deg); /* Rotate 90 degrees to the right */
    margin-bottom: 10px; /* Move above the text */
  }

  #pointer span {
    margin-top: 10px; /* Move below the image */
  }

  @keyframes bounce {
    0%, 100% {
      transform: translate(-50%, -50%) rotate(-30deg) translateY(0);
    }
    50% {
      transform: translate(-50%, -50%) rotate(-30deg) translateY(-10px);
    }
  }

  #cookie-count, #cookies-per-second {
    background-color: black; /* Change to black */
    margin-top: 35px; /* Move down by 25px */
    color: white; /* Ensure text is visible */
  }

  #bakery-name {
    text-align: center;
    font-size: 2rem;
    color: white;
    margin-bottom: 10px; /* Add spacing below */
  }

  #bakery-name span {
    display: inline-block;
    cursor: text; /* Indicate editable text */
    border-bottom: 1px dashed white; /* Visual cue for editable part */
  }
</style>

<div class="container py-4">
  <div id="game">
    <div id="cookie-container">
      <div id="bakery-name">
        <span contenteditable="true">Bob</span>'s Bakery
      </div>
      <img id="cookie" src="{{site.baseurl}}/images/cookie.png" alt="Cookie" />
      <p id="cookie-count" class="text-box">Cookies: 0</p>
      <p id="cookies-per-second" class="text-box">Cookies per second: 0</p>
    </div>
    <div id="upgrades">
      <div id="upgrade-grid">
        <!-- Dynamically added upgrades -->
      </div>
    </div>
  </div>
</div>

<div id="pointer">
  <img src="{{site.baseurl}}/images/pointer.png" alt="Pointer" />
  <span>Click Here!</span>
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

  const upgradeCounts = Array(upgrades.length).fill(0); // Track the number of upgrades bought

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
      upgradeCounts[index]++; // Increment the count for this upgrade
      renderUpgrades();
      updateDisplay();
    }
  }

  function renderUpgrades() {
    const upgradeGrid = document.getElementById("upgrade-grid");
    upgradeGrid.innerHTML = "";

    // Sort upgrades by price
    const sortedUpgrades = [...upgrades].sort((a, b) => a.cost - b.cost);

    sortedUpgrades.forEach((upgrade, index) => {
      const emojiMap = {
        "Cursor": "🖱️",
        "Grandma": "👵",
        "Farm": "🌾",
        "Mine": "⛏️",
        "Factory": "🏭",
        "Bank": "🏦",
        "Temple": "⛪",
        "Wizard Tower": "🧙‍♂️",
        "Shipment": "🚀",
        "Alchemy Lab": "⚗️",
        "Portal": "🌀"
      };
      const emoji = emojiMap[upgrade.name] || "❓";

      const div = document.createElement("div");
      div.className = "upgrade-box";
      div.innerHTML = `
        <div>
          <p>${upgrade.name}</p>
          <p>Cost: ${upgrade.cost}</p>
          <p>CPS: ${upgrade.cps}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>${emoji}</span>
          <span>${upgradeCounts[index] > 0 ? upgradeCounts[index] : ""}</span>
        </div>`;
      div.onclick = () => buyUpgrade(index);
      upgradeGrid.appendChild(div);
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

  const pointer = document.getElementById('pointer');
  const cookie = document.getElementById('cookie');

  // Position the pointer near the cookie
  function positionPointer() {
    const rect = cookie.getBoundingClientRect();
    pointer.style.top = `${rect.top + window.scrollY + 250}px`;
    pointer.style.left = `${rect.left + window.scrollX - 150}px`;
  }

  window.addEventListener('resize', positionPointer);
  window.addEventListener('load', positionPointer);
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
