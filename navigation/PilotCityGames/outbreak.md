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
      width: 240px;
      background: rgba(0, 0, 0, 0.6);
      padding: 20px;
      box-sizing: border-box;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-right: 2px solid #444;
      justify-content: center;
    }

    .infographic-item {
      padding: 10px;
      border-left: 4px solid #0ff;
      background: rgba(255, 255, 255, 0.05);
      font-size: 14px;
      line-height: 1.4;
    }

    #gameContainer {
      position: relative;
      width: 1000px;
      height: 600px;
      border: 2px solid #fff;
    }

    #gameCanvas {
      width: 100%;
      height: 100%;
      display: block;
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
    <div id="sidebar">
      <div class="infographic-item">
        🧬 <strong>Infection Risk:</strong> <span id="riskLevel">Low</span>
      </div>
      <div class="infographic-item">
        🦠 <strong>Active Outbreaks:</strong> <span id="activeCount">0</span>
      </div>
      <div class="infographic-item">
        📍<strong> Goal:</strong><br>Prevent uncontrolled outbreaks by reacting quickly!
      </div>
    </div>

    <div id="gameContainer">
      <canvas id="gameCanvas" width="1000" height="600"></canvas>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let bubbles = [];
    const uiRiskLevel = document.getElementById('riskLevel');
    const uiActiveCount = document.getElementById('activeCount');

    const background = new Image();
    background.src = 'https://i.postimg.cc/jjwbHWnp/image-2025-04-21-104242750.png';

    const barriers = [
      { x: 200, y: 150, width: 150, height: 100 },
      { x: 600, y: 400, width: 180, height: 80 }
    ];

    function spawnBubble(x, y) {
      const bubbleSize = 30;

      const collidesWithBarrier = barriers.some(barrier => {
        return (
          x < barrier.x + barrier.width &&
          x + bubbleSize > barrier.x &&
          y < barrier.y + barrier.height &&
          y + bubbleSize > barrier.y
        );
      });

      if (collidesWithBarrier) {
        spawnBubble(
          Math.random() * (canvas.clientWidth - bubbleSize),
          Math.random() * (canvas.clientHeight - bubbleSize)
        );
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

    background.onload = () => {
      setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        barriers.forEach(barrier => {
          ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
          ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
        });

        const x = Math.random() * (canvas.clientWidth - 30);
        const y = Math.random() * (canvas.clientHeight - 30);
        spawnBubble(x, y);

      }, 3000);
    };

    updateRisk();
  </script>
</body>
</html>
