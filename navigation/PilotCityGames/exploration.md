---
layout: bootstrap
title: Exploration
description: Exploration
permalink: /exploration
Author: Darsh
---




<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f2f4f8;
    background-image: url('navigation/background.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    padding: 40px 20px;
  }

  .game-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 40px;
  flex-wrap: nowrap;
  max-width: 1400px;
  margin: 0 auto;
}

#gameCanvas {
  width: 800px;
  height: 600px;
  border: 2px solid #333;
  background: url('navigation/white.png') no-repeat center center;
  background-size: contain;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

#sidePanel {
  width: 400px;
  background-color: #ffffffee;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #ccc;
  backdrop-filter: blur(2px);
  flex-shrink: 0;
}


  #sidePanel h4 {
    font-size: 22px;
    color: #222;
  }

  #sidePanel p {
    font-size: 15px;
    color: #444;
    line-height: 1.5;
  }

  #resetButton {
    margin-top: 25px;
  }
</style>

<div class="game-wrapper">
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <div id="sidePanel">
    <h4>Organelle Info</h4>
    <p><strong>Name:</strong> <span id="infoName">None</span></p>
    <p><strong>Description:</strong></p>
    <p id="infoDesc">Move your character to discover and learn about cell organelles.</p>
    <hr>
    <h4>Progress Tracker</h4>
    <p id="progress">Organelles Discovered: 0/10</p>
    <button id="resetButton" class="btn btn-primary w-100">Return to Start</button>
  </div>
</div>

<script>
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const progress = document.getElementById('progress');
  const resetButton = document.getElementById('resetButton');
  const infoName = document.getElementById('infoName');
  const infoDesc = document.getElementById('infoDesc');

  function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  const organelles = [
    { name: 'Nucleus', x: 200, y: 150, discovered: false, description: 'Contains the cell\'s DNA.', image: loadImage('navigation/nucleus.png'), size: 60 },
    { name: 'Mitochondria', x: 400, y: 300, discovered: false, description: 'Produces energy.', image: loadImage('navigation/mitochondria.png'), size: 60 },
    { name: 'Ribosome', x: 600, y: 450, discovered: false, description: 'Site of protein synthesis.', image: loadImage('navigation/ribosome.png'), size: 60 },
    { name: 'Golgi Apparatus', x: 300, y: 500, discovered: false, description: 'Packages proteins.', image: loadImage('navigation/golgi.png'), size: 60 },
    { name: 'Endoplasmic Reticulum', x: 100, y: 400, discovered: false, description: 'Transports materials.', image: loadImage('navigation/er.png'), size: 60 },
    { name: 'Lysosome', x: 700, y: 100, discovered: false, description: 'Breaks down waste.', image: loadImage('navigation/lysosome.png'), size: 60 },
    { name: 'Cytoplasm', x: 500, y: 200, discovered: false, description: 'Gel-like substance.', image: loadImage('navigation/cytoplasm.png'), size: 60 },
    { name: 'Plasma Membrane', x: 50, y: 550, discovered: false, description: 'Controls entry and exit.', image: loadImage('navigation/plasma.png'), size: 60 },
    { name: 'Peroxisome', x: 650, y: 350, discovered: false, description: 'Detoxifies substances.', image: loadImage('navigation/peroxisome.png'), size: 60 },
    { name: 'Centrosome', x: 250, y: 250, discovered: false, description: 'Organizes structure.', image: loadImage('navigation/centrosome.png'), size: 60 }
  ];

  let player = {
    x: 50,
    y: 50,
    speed: 2,
    image: loadImage('navigation/sprite.png'),
    width: 24,
    height: 24
  };

  let discoveredCount = 0;
  let keysPressed = {};

  document.addEventListener('keydown', e => keysPressed[e.key] = true);
  document.addEventListener('keyup', e => keysPressed[e.key] = false);

  function drawEnvironment() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    organelles.forEach(organelle => {
      if (organelle.image.complete) {
        ctx.drawImage(organelle.image, organelle.x - organelle.size / 2, organelle.y - organelle.size / 2, organelle.size, organelle.size);
      } else {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(organelle.x, organelle.y, organelle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (organelle.discovered) {
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText(organelle.name, organelle.x - 30, organelle.y - 30);
      }
    });

    if (player.image.complete) {
      ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }

  function movePlayer() {
    if (keysPressed['ArrowUp']) player.y -= player.speed;
    if (keysPressed['ArrowDown']) player.y += player.speed;
    if (keysPressed['ArrowLeft']) player.x -= player.speed;
    if (keysPressed['ArrowRight']) player.x += player.speed;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    drawEnvironment();
    checkCollisions();
  }

  function checkCollisions() {
    organelles.forEach(organelle => {
      const dx = player.x + player.width / 2 - organelle.x;
      const dy = player.y + player.height / 2 - organelle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < organelle.size / 2 && !organelle.discovered) {
        organelle.discovered = true;
        discoveredCount++;
        progress.textContent = `Organelles Discovered: ${discoveredCount}/10`;
        infoName.textContent = organelle.name;
        infoDesc.textContent = organelle.description;
      }
    });
  }

  function gameLoop() {
    movePlayer();
    requestAnimationFrame(gameLoop);
  }

  resetButton.addEventListener('click', () => {
    player.x = 50;
    player.y = 50;
    organelles.forEach(o => o.discovered = false);
    discoveredCount = 0;
    progress.textContent = `Organelles Discovered: 0/10`;
    infoName.textContent = 'None';
    infoDesc.textContent = 'Move your character to discover and learn about cell organelles.';
    drawEnvironment();
  });

  drawEnvironment();
  gameLoop();
</script>
