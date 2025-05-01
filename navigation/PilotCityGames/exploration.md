---
layout: bootstrap
title: Exploration
description: Exploration
permalink: /exploration
Author: Darsh
---

<<<<<<< HEAD
<!-- Bootstrap CSS for styling -->
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
=======
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color:rgb(255, 255, 255);
    background-image: url('navigation/white2.jpg');
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
  background: url('navigation/white2.png') no-repeat center center;
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
>>>>>>> 7534e0c638bd9df21be8c2409de648fe00d355b8

<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Create the canvas for the game
    const canvas = document.createElement('canvas');
    document.getElementById('game-container').appendChild(canvas);
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const player = { x: 100, y: 100, size: 15, speed: 2, dx: 0, dy: 0 };
    let discovered = new Set();
    let points = 0; // Initialize points
    const organelles = [
      { name: "Nucleus", x: 400, y: 300, r: 30, desc: "Controls cell activities and contains DNA." },
      { name: "Chloroplast", x: 600, y: 150, r: 25, desc: "Performs photosynthesis." },
      { name: "Vacuole", x: 200, y: 450, r: 35, desc: "Stores nutrients and waste products." },
      { name: "Cell Wall", x: 700, y: 500, r: 20, desc: "Provides structural support." },
      { name: "Cell Membrane", x: 100, y: 300, r: 20, desc: "Regulates what enters and leaves the cell." },
      { name: "Cytoplasm", x: 350, y: 100, r: 20, desc: "Gel-like substance where organelles reside." },
      { name: "Mitochondrion", x: 500, y: 400, r: 25, desc: "Produces energy for the cell." },
      { name: "Ribosome", x: 250, y: 200, r: 15, desc: "Synthesizes proteins." },
      { name: "Golgi Apparatus", x: 450, y: 500, r: 20, desc: "Modifies and packages proteins." },
      { name: "Endoplasmic Reticulum", x: 150, y: 100, r: 20, desc: "Transports materials within the cell." }
    ];

    // UI Elements
    const progressSpan = document.createElement('span');
    const progressDiv = document.createElement('div');
    progressDiv.classList.add('mb-3');
    progressDiv.innerHTML = "<strong>Organelles Discovered:</strong> ";
    progressDiv.appendChild(progressSpan);
    document.getElementById('info-container').appendChild(progressDiv);

    const pointsDiv = document.createElement('div'); // Points display
    pointsDiv.classList.add('mb-3');
    pointsDiv.innerHTML = `<strong>Points:</strong> <span id="points-counter">0</span>`;
    document.getElementById('info-container').appendChild(pointsDiv);

    const infoBox = document.createElement('div');
    document.getElementById('info-container').appendChild(infoBox);

<<<<<<< HEAD
    const joystickDiv = document.createElement('div');
    document.getElementById('joystick-container').appendChild(joystickDiv);
=======
document.addEventListener('keydown', e => {
  const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (keysToPrevent.includes(e.key)) e.preventDefault(); 
  keysPressed[e.key.toLowerCase()] = true; 
});
>>>>>>> 7534e0c638bd9df21be8c2409de648fe00d355b8

    // Functions for the game
    function drawPlayer() {
      ctx.fillStyle = "#3e8e41";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawOrganelles() {
      organelles.forEach(o => {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = discovered.has(o.name) ? '#ffe600' : '#7ec850';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText(o.name, o.x - o.r, o.y - o.r - 5);
      });
    }

    function detectCollisions() {
      organelles.forEach(o => {
        const dist = Math.hypot(player.x - o.x, player.y - o.y);
        if (dist < player.size + o.r && !discovered.has(o.name)) {
          discovered.add(o.name);
          points += 10; // Add 10 points for each interaction
          document.getElementById('points-counter').textContent = points; // Update points display
          progressSpan.textContent = discovered.size;
          infoBox.style.display = 'block';
          infoBox.innerHTML = `<strong>${o.name}</strong><br>${o.desc}`;
        }
      });
    }

    function updatePlayer() {
      player.x += player.dx;
      player.y += player.dy;
      player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
      player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawOrganelles();
      drawPlayer();
      detectCollisions();
      updatePlayer();
      requestAnimationFrame(gameLoop);
    }

    function resetPlayer() {
      player.x = 100;
      player.y = 100;
      player.dx = 0;
      player.dy = 0;
    }

    // Joystick Setup (Position joystick on the right side)
    const joystick = nipplejs.create({
      zone: joystickDiv,
      mode: 'static',
      position: { right: '10%', top: '50%' }, // Positioning joystick on the right side
      color: 'green'
    });

    joystick.on('move', (evt, data) => {
      const rad = data.angle.radian;
      // Inverting Y-axis: Multiply the Y-axis speed by -1
      player.dx = Math.cos(rad) * player.speed;
      player.dy = -Math.sin(rad) * player.speed;  // Invert the vertical movement
    });

    joystick.on('end', () => {
      player.dx = 0;
      player.dy = 0;
    });

    // Start the game loop
    gameLoop();
  });
</script>

<!-- Bootstrap JS and NippleJS for the joystick -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/nipplejs/0.9.0/nipplejs.min.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<!-- Container for game and UI -->
<div class="container">
  <div class="row">
    <!-- Add an enclosed barrier for the game area -->
    <div class="col-md-8" id="game-container" style="border: 2px solid #000; padding: 10px;">
      <!-- Game canvas will be appended here -->
    </div>
    <div class="col-md-4" id="info-container" style="margin-left: 20px;">
      <!-- Progress and organelle info will be shown here -->
    </div>
  </div>
  <div class="row">
    <div class="col-12" id="joystick-container">
      <!-- Joystick controls will be shown here -->
    </div>
  </div>
</div>
