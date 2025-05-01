---
layout: bootstrap
title: Outbreak
description: Outbreak
permalink: /outbreak
Author: Lars
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Outbreak Response Game - Resource Challenge</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      background-color: #1e1e2f;
      color: white;
      overflow-x: hidden;
      overflow-y: auto;
    }
    #wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 20px;
      min-height: 100vh;
    }
    #sidebar {
      background: rgba(0, 0, 0, 0.6);
      padding: 10px;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-bottom: 2px solid #444;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    #title {
      text-align: center;
      font-size: 36px;
      font-weight: bold;
    }
    .infographic-item {
      padding: 5px;
      border-left: 4px solid #0ff;
      background: rgba(255, 255, 255, 0.05);
      font-size: 12px;
      line-height: 1.4;
      width: 100%;
    }
    #crateBox {
      z-index: 10;
      position: relative;
    }
    .crate {
      width: 40px;
      height: 40px;
      background-color: #4caf50;
      color: white;
      text-align: center;
      line-height: 40px;
      border-radius: 4px;
      cursor: grab;
      margin: 5px;
    }
    .crate.cooldown {
      background-color: #b71c1c !important;
      cursor: not-allowed;
    }
    #gameContainer {
      position: relative;
      width: 1000px;
      height: 600px;
      border: 2px solid #fff;
    }
    .bubble {
      position: absolute;
      width: 30px;
      height: 30px;
      background-color: rgba(255, 0, 0, 0.7);
      border-radius: 50%;
      cursor: pointer;
      animation: pulse 2s infinite;
      z-index: 4;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.4); opacity: 0.5; }
      100% { transform: scale(1); opacity: 0.8; }
    }
    .region-visual {
      position: absolute;
      border: 1px dashed rgba(0, 255, 255, 0.3);
      background-color: rgba(0, 255, 255, 0.05);
      pointer-events: none;
      z-index: 1;
    }
    .region-hitbox {
      position: absolute;
      z-index: 3;
      pointer-events: all;
    }
    #endScreen {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 9999;
    }
    #playAgainBtn {
      padding: 10px 20px;
      font-size: 18px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="wrapper">
    <div id="title">Resource Optimization Challenge</div>
    <div id="sidebar">
      <div class="infographic-item">
        💉 <strong>Drag & Drop Vaccines</strong><br>Distribute to reduce outbreak risk, Pop virus bubbles to stop spread
      </div>
      <div class="infographic-item">
        📊 <strong>Regions Allocated & Health:</strong>
        <ul id="regionStats" style="list-style: none; padding-left: 0; font-size: 11px;"></ul>
        <button id="pauseBtn">⏸️ Pause</button>
        <div>⏱️ Time Remaining: <span id="timeLeft">180</span>s</div>
        <div>📉 Infection Risk: <span id="riskLevel">Loading...</span></div>
      </div>
    </div>

    <div id="crateBox">
      <div class="crate" id="vaccineCrate">💉</div>
    </div>

    <div id="gameContainer">
      <canvas id="gameCanvas" width="1000" height="600"></canvas>
    </div>
  </div>

  <div id="endScreen">
    <h1 id="endMessage"></h1>
    <button id="playAgainBtn">🔁 Play Again</button>
  </div>

  <script type="module">
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const pauseBtn = document.getElementById("pauseBtn");
    const timeDisplay = document.getElementById("timeLeft");
    const endScreen = document.getElementById("endScreen");
    const endMessage = document.getElementById("endMessage");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const riskElement = document.getElementById("riskLevel");
    const crate = document.getElementById("vaccineCrate");

    let isPaused = false;
    let timeLeft = 180;
    let bubbles = [];
    let crateCooldown = false;

    const background = new Image();
    background.src = "https://i.postimg.cc/jjwbHWnp/image-2025-04-21-104242750.png";

    const regions = [
      { name: "West", x: 55, y: 180, width: 200, height: 200 },
      { name: "Midwest", x: 275, y: 125, width: 200, height: 200 },
      { name: "South", x: 510, y: 260, width: 200, height: 200 },
      { name: "Northeast", x: 720, y: 180, width: 200, height: 200 }
    ];

    const regionStats = {
      West: { allocated: 1000, health: 100 },
      Midwest: { allocated: 1000, health: 100 },
      South: { allocated: 1000, health: 100 },
      Northeast: { allocated: 1000, health: 100 }
    };

    crate.setAttribute("draggable", true);
    crate.addEventListener("dragstart", handleDrag);

    function handleDrag(e) {
      if (crateCooldown || isPaused) {
        e.preventDefault();
        return false;
      }
      e.dataTransfer.setData("text/plain", "vaccine");
    }

    function allowDrop(e) {
      e.preventDefault();
    }

    function handleDrop(e, regionName) {
      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      if (type === "vaccine" && !crateCooldown) {
        regionStats[regionName].allocated += 5000;
        regionStats[regionName].health = Math.min(100, regionStats[regionName].health + 5);
        updateRegionStats();
        crate.classList.add("cooldown");
        crate.setAttribute("draggable", false);
        crateCooldown = true;
        setTimeout(() => {
          crateCooldown = false;
          crate.classList.remove("cooldown");
          crate.setAttribute("draggable", true);
        }, 5000);
      }
    }

    function updateRegionStats() {
      const ul = document.getElementById("regionStats");
      ul.innerHTML = "";
      Object.keys(regionStats).forEach(region => {
        const li = document.createElement("li");
        li.textContent = `${region}: ${regionStats[region].allocated} doses | Health: ${regionStats[region].health}`;
        ul.appendChild(li);
      });
    }

    function spawnBubble(region) {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.style.left = `${region.x + Math.random() * (region.width - 30)}px`;
      bubble.style.top = `${region.y + Math.random() * (region.height - 30)}px`;
      bubble.dataset.region = region.name;
      bubble.onclick = () => {
        bubble.remove();
        bubbles = bubbles.filter(b => b !== bubble);
        updateRegionStats();
      };
      document.getElementById("gameContainer").appendChild(bubble);
      bubbles.push(bubble);
    }

    window.onload = () => {
      const container = document.getElementById("gameContainer");
      regions.forEach(region => {
        const visual = document.createElement("div");
        visual.className = "region-visual";
        Object.assign(visual.style, {
          left: `${region.x}px`,
          top: `${region.y}px`,
          width: `${region.width}px`,
          height: `${region.height}px`
        });
        container.appendChild(visual);

        const hitbox = document.createElement("div");
        hitbox.className = "region-hitbox";
        Object.assign(hitbox.style, {
          left: `${region.x}px`,
          top: `${region.y}px`,
          width: `${region.width}px`,
          height: `${region.height}px`
        });
        hitbox.ondragover = allowDrop;
        hitbox.ondrop = e => handleDrop(e, region.name);
        container.appendChild(hitbox);
      });

      updateRegionStats();
    };

    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    };

    setInterval(() => {
      if (isPaused) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      regions.forEach(region => {
        if (regionStats[region.name].allocated < 10000 && Math.random() < 0.5) {
          spawnBubble(region);
        }
      });
    }, 750);

    setInterval(() => {
      if (isPaused) return;
      Object.keys(regionStats).forEach(region => {
        regionStats[region].allocated = Math.max(0, regionStats[region].allocated - 1000);
      });
      updateRegionStats();
    }, 5000);

    setInterval(() => {
      if (isPaused) return;
      regions.forEach(region => {
        const count = bubbles.filter(b => b.dataset.region === region.name).length;
        if (count > 5) {
          regionStats[region.name].health = Math.max(0, regionStats[region.name].health - 10);
        }
      });
      const failed = Object.values(regionStats).filter(r => r.health <= 0).length;
      if (failed >= 3) {
        endMessage.textContent = "💀 Game Over! Too many regions collapsed.";
        endScreen.style.display = "flex";
      }
      updateRegionStats();
    }, 4000);

    setInterval(() => {
      if (isPaused) return;
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        endMessage.textContent = "✅ Success! You held off the outbreak!";
        endScreen.style.display = "flex";
      }
    }, 1000);

    pauseBtn.onclick = () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
    };

    playAgainBtn.onclick = () => {
      endScreen.style.opacity = 0;
      setTimeout(() => {
        location.reload();
      }, 300);
    };

    async function fetchRiskLevel() {
      try {
        const response = await fetch(`${pythonURI}/api/predict`, {
          ...fetchOptions,
          method: 'POST',
          body: JSON.stringify({
            vaccines: 15000,
            fully_vaccinated: 10000,
            daily_vaccinations: 400,
            distributed: 16000
          })
        });

        const data = await response.json();
        if (data.risk) {
          riskElement.textContent = data.risk.charAt(0).toUpperCase() + data.risk.slice(1);
        }
      } catch (err) {
        console.error('Risk fetch failed:', err);
      }
    }

    setInterval(fetchRiskLevel, 5000);
  </script>
</body>
</html>
