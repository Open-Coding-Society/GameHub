---
layout: bootstrap
title: Outbreak
description: Outbreak
permalink: /outbreak
Author: Lars
---

<html lang="en">
<head>
  <meta charset="UTF-8">
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
      flex-wrap: wrap;
      gap: 20px;
      padding: 20px;
      box-sizing: border-box;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
    }

    #sidebar {
      width: auto;
      background: rgba(0, 0, 0, 0.6);
      padding: 10px;
      box-sizing: border-box;
      color: white;
      display: flex;
      flex-direction: row;
      gap: 20px;
      border-bottom: 2px solid #444;
      justify-content: space-around;
      align-items: center;
      position: relative;
      top: 70px; 
    }

    #title {
      position: relative;
      top: 80px; 
      text-align: center;
      font-size: 36px; 
      font-weight: bold;
      color: white;
    }

    .infographic-item {
      padding: 5px;
      border-left: 4px solid #0ff;
      background: rgba(255, 255, 255, 0.05);
      font-size: 12px;
      line-height: 1.4;
      text-align: center;
    }

    #gameContainer {
      position: relative;
      width: 1000px;
      height: 600px;
      border: 2px solid #fff;
      margin-top: 20px;
    }

    .crate {
      width: 40px;
      height: 40px;
      background-color: #4caf50;
      color: white;
      text-align: center;
      line-height: 40px;
      border-radius: 6px;
      cursor: grab;
      margin: 5px;
    }

    .region {
      position: absolute;
      border: 2px dashed rgba(255,255,255,0.2);
      pointer-events: all;
    }

    .bubble {
      position: absolute;
      width: 30px;
      height: 30px;
      background-color: rgba(255, 0, 0, 0.7);
      border-radius: 50%;
      cursor: pointer;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.4); opacity: 0.5; }
      100% { transform: scale(1); opacity: 0.8; }
    }
  </style>
</head>
<body>
  <div id="wrapper">
    <div id="title">Resource Optimization Challenge</div>
    <div id="sidebar">
      <div class="infographic-item">
        💉 <strong>Drag & Drop Vaccines</strong><br>Distribute to reduce outbreak risk
      </div>
      <div class="infographic-item">
        📊 <strong>Regions Allocated:</strong>
        <ul id="regionStats" style="list-style: none; padding-left: 0; font-size: 11px;"></ul>
      </div>
    </div>

    <div id="gameContainer">
      <canvas id="gameCanvas" width="1000" height="600"></canvas>
      <div id="crateBox">
        <div class="crate" draggable="true" ondragstart="handleDrag(event)">💉</div>
        <div class="crate" draggable="true" ondragstart="handleDrag(event)">💉</div>
        <div class="crate" draggable="true" ondragstart="handleDrag(event)">💉</div>
      </div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.src = "https://i.postimg.cc/jjwbHWnp/image-2025-04-21-104242750.png";

    const regions = [
      { name: "West", x: 55, y: 210, width: 200, height: 200 },
      { name: "Midwest", x: 380, y: 240, width: 160, height: 100 },
      { name: "South", x: 540, y: 420, width: 180, height: 100 },
      { name: "Northeast", x: 720, y: 180, width: 150, height: 80 }
    ];

    const regionStats = {
      "West": { allocated: 0 },
      "Midwest": { allocated: 0 },
      "South": { allocated: 0 },
      "Northeast": { allocated: 0 }
    };

    let bubbles = [];

    function updateRegionStats() {
      const ul = document.getElementById("regionStats");
      ul.innerHTML = "";
      Object.keys(regionStats).forEach(region => {
        const li = document.createElement("li");
        li.textContent = `${region}: ${regionStats[region].allocated} doses`;
        ul.appendChild(li);
      });
    }

    function handleDrag(e) {
      e.dataTransfer.setData("text/plain", "vaccine");
    }

    function handleDrop(e, regionName) {
      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      if (type === "vaccine") {
        regionStats[regionName].allocated += 5000;
        updateRegionStats();
        e.target.style.backgroundColor = "rgba(0,255,0,0.1)";
        setTimeout(() => {
          e.target.style.backgroundColor = "";
        }, 1000);
      }
    }

    function allowDrop(e) {
      e.preventDefault();
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

    // Region decay every 5 seconds
    setInterval(() => {
      Object.keys(regionStats).forEach(region => {
        if (regionStats[region].allocated > 0) {
          regionStats[region].allocated -= 1000;
          if (regionStats[region].allocated < 0) regionStats[region].allocated = 0;
        }
      });
      updateRegionStats();
    }, 5000);

    // Bubble spawning based on dose levels
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      regions.forEach(region => {
        const doses = regionStats[region.name].allocated;
        const chance = Math.random();

        if (doses < 5000 && chance < 0.4) {
          spawnBubble(region);
        } else if (doses < 10000 && chance < 0.2) {
          spawnBubble(region);
        } else if (doses < 20000 && chance < 0.1) {
          spawnBubble(region);
        }
      });
    }, 4000);

    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      regions.forEach(region => {
        const div = document.createElement("div");
        div.classList.add("region");
        div.style.left = `${region.x}px`;
        div.style.top = `${region.y}px`;
        div.style.width = `${region.width}px`;
        div.style.height = `${region.height}px`;
        div.ondragover = allowDrop;
        div.ondrop = (e) => handleDrop(e, region.name);
        div.title = region.name;
        document.getElementById("gameContainer").appendChild(div);
      });
    };

    updateRegionStats();
  </script>
</body>
</html>