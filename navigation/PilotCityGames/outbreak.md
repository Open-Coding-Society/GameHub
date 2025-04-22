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
  <title>Outbreak Response Game</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      background-color: #1e1e2f;
      color: white;
      overflow: hidden;
      display: flex;
    }

    #sidebar {
      width: 250px;
      background: rgba(0, 0, 0, 0.8);
      padding: 20px;
      box-sizing: border-box;
      color: white;
    }

    #gameContainer {
      position: relative;
      width: 1000px;
      height: 600px;
      margin: auto;
      border: 2px solid #fff;
      background-image: url('https://i.postimg.cc/jjwbHWnp/image-2025-04-21-104242750.png');
      background-size: cover;
    }

    .scoreboard {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .instructions {
      font-size: 14px;
      color: #ccc;
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
  <div id="sidebar">
    <div class="scoreboard">
      Infection Risk: <span id="riskLevel">Low</span><br>
      Active Outbreaks: <span id="activeCount">0</span>
    </div>
    <div class="instructions">
      Click on outbreak bubbles before they spread!<br>
    </div>
  </div>

  <div id="gameContainer">
    <canvas id="gameCanvas" width="1000" height="600"></canvas>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let bubbles = [];
    const uiRiskLevel = document.getElementById('riskLevel');
    const uiActiveCount = document.getElementById('activeCount');

    // Define rectangular barriers (x, y, width, height)
    const barriers = [
      { x: 200, y: 150, width: 150, height: 100 },
      { x: 600, y: 400, width: 180, height: 80 }
    ];

    function spawnBubble(x, y) {
      const bubbleSize = 30;

      // Check if bubble would spawn inside a barrier
      const collidesWithBarrier = barriers.some(barrier => {
        return (
          x < barrier.x + barrier.width &&
          x + bubbleSize > barrier.x &&
          y < barrier.y + barrier.height &&
          y + bubbleSize > barrier.y
        );
      });

      // Retry spawning if overlapping a barrier
      if (collidesWithBarrier) {
        spawnBubble(Math.random() * (canvas.width - 40), Math.random() * (canvas.height - 40));
        return;
      }

      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      bubble.onclick = () => {
        bubble.remove();
        bubbles = bubbles.filter(b => b !== bubble);
        updateRisk();
      };

      document.getElementById('gameContainer').appendChild(bubble);
      bubbles.push(bubble);
      updateRisk();
    }

    function updateRisk() {
      const activeCount = bubbles.length;
      uiActiveCount.textContent = activeCount;

      if (activeCount <= 10) {
        uiRiskLevel.textContent = 'Low';
      } else if (activeCount <= 20) {
        uiRiskLevel.textContent = 'Moderate';
      } else if (activeCount <= 45) {
        uiRiskLevel.textContent = 'High';
      } else {
        uiRiskLevel.textContent = 'Extremely High';
      }
    }

    // Dummy spawner (to be replaced with ML integration)
    setInterval(() => {
      const x = Math.random() * (canvas.width - 40);
      const y = Math.random() * (canvas.height - 40);
      spawnBubble(x, y);

      // Optional: draw barriers for debug
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      barriers.forEach(barrier => {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
      });
    }, 3000);

    updateRisk();
  </script>
</body>
</html>
