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
    <div id="title">Predict Outbreak Scenarios</div>
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
      { x: 50, y: 5, width: 910, height: 50 }, // north border
      { x: 150, y: 545, width: 850, height: 50 }, // south border
      { x: 5, y: 5, width: 50, height: 610 }, // west border
      { x: 895, y: 165, width: 120, height: 380 }, // east border (extended to prevent gaps)
      { x: 175, y: 415, width: 180, height: 120 }, // hi
      { x: 75, y: 355, width: 80, height: 60 }, // socal
      { x: 600, y: 460, width: 180, height: 100 }, // tx - fl
      { x: 630, y: 50, width: 220, height: 80 } // mi-ny
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
          Math.random() * (canvas.clientWidth - bubbleSize - 10),
          Math.random() * (canvas.clientHeight - bubbleSize - 10)
        );
        return;
      }

      if (bubbles.length >= 50) return; 

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

      if (activeCount <= 4) {
        uiRiskLevel.textContent = 'Low';
      } else if (activeCount <= 9) {
        uiRiskLevel.textContent = 'Moderate';
      } else if (activeCount <= 14) {
        uiRiskLevel.textContent = 'High';
      } else {
        uiRiskLevel.textContent = 'Extremely High';
      }
    }

    background.onload = () => {
      setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      //  barriers.forEach(barrier => {
      //    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      //    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
      //  });

        const x = Math.random() * (canvas.clientWidth - 40);
        const y = Math.random() * (canvas.clientHeight - 40);
        spawnBubble(x, y);

      }, 3000);
    };

    updateRisk();
  </script>
</body>
</html>
