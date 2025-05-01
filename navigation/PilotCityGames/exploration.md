---
layout: bootstrap
title: Exploration
description: Exploration
permalink: /exploration
Author: Darsh
---

<!-- Bootstrap CSS for styling -->
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  Object.assign(popup.style, {
    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white", padding: "20px",
    borderRadius: "8px", zIndex: "1000", textAlign: "center", fontSize: "18px"
  });
  document.body.appendChild(popup);
  setTimeout(() => document.body.removeChild(popup), 1000); // Popup lasts 1 second
}

async function updatePoints(points) {
  try {
    const response = await fetch(`${pythonURI}/api/points`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
    const data = await response.json();
    if (response.ok) {
      showPopup("You gained 10 points!");
    }
  } catch (error) {
    console.error('Error updating points:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const gameContainer = document.getElementById('game-container');
  const infoContainer = document.getElementById('info-container');
  const joystickContainer = document.getElementById('joystick-container');

  if (!gameContainer || !infoContainer || !joystickContainer) {
    console.error('Required containers are missing in the DOM.');
    return;
  }

  const canvas = document.createElement('canvas');
  gameContainer.appendChild(canvas);
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const player = { x: 100, y: 100, size: 15, speed: 2, dx: 0, dy: 0 };
  let discovered = new Set();
  let points = 0;

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

  // Load organelle images
  const organelleImages = {
    "Nucleus": new Image(),
    "Chloroplast": new Image(),
    "Vacuole": new Image(),
    "Cell Wall": new Image(),
    "Cell Membrane": new Image(),
    "Cytoplasm": new Image(),
    "Mitochondrion": new Image(),
    "Ribosome": new Image(),
    "Golgi Apparatus": new Image(),
    "Endoplasmic Reticulum": new Image()
  };

  // Set image sources from the 'images' folder
  organelleImages["Nucleus"].src = "images/nucleus.png";
  organelleImages["Chloroplast"].src = "images/chloroplast.png";
  organelleImages["Vacuole"].src = "images/cytoplasm.png";
  organelleImages["Cell Wall"].src = "images/cellwall.png";
  organelleImages["Cell Membrane"].src = "images/cellmembrane.png";
  organelleImages["Cytoplasm"].src = "images/cytoplasm.png";
  organelleImages["Mitochondrion"].src = "images/mitochondria.png";
  organelleImages["Ribosome"].src = "images/ribosome.png";
  organelleImages["Golgi Apparatus"].src = "images/golgi.png";
  organelleImages["Endoplasmic Reticulum"].src = "images/er.png";

  // UI elements
  const progressSpan = document.createElement('span');
  const progressDiv = document.createElement('div');
  progressDiv.classList.add('mb-3');
  progressDiv.innerHTML = "<strong>Organelles Discovered:</strong> ";
  progressDiv.appendChild(progressSpan);
  infoContainer.appendChild(progressDiv);

  const pointsDiv = document.createElement('div');
  pointsDiv.classList.add('mb-3');
  pointsDiv.innerHTML = `<strong>Points:</strong> <span id="points-counter">0</span>`;
  infoContainer.appendChild(pointsDiv);

  const infoBox = document.createElement('div');
  infoContainer.appendChild(infoBox);

  const joystickDiv = document.createElement('div');
  joystickContainer.appendChild(joystickDiv);

  // Drawing functions
  function drawPlayer() {
    ctx.fillStyle = "#3e8e41";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOrganelles() {
    organelles.forEach(o => {
      const img = organelleImages[o.name];
      if (img.complete) {
        const size = o.r * 2;
        ctx.drawImage(img, o.x - o.r, o.y - o.r, size, size);
      } else {
        img.onload = () => {
          const size = o.r * 2;
          ctx.drawImage(img, o.x - o.r, o.y - o.r, size, size);
        };
      }
    });
  }

  function detectCollisions() {
    organelles.forEach(o => {
      const dist = Math.hypot(player.x - o.x, player.y - o.y);
      if (dist < player.size + o.r && !discovered.has(o.name)) {
        discovered.add(o.name);
        points += 10;
        document.getElementById('points-counter').textContent = points;
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

  // Joystick setup
  const joystick = nipplejs.create({
    zone: joystickDiv,
    mode: 'static',
    position: { right: '10%', top: '50%' },
    color: 'green'
  });

  joystick.on('move', (evt, data) => {
    const rad = data.angle.radian;
    player.dx = Math.cos(rad) * player.speed;
    player.dy = -Math.sin(rad) * player.speed;
  });

  joystick.on('end', () => {
    player.dx = 0;
    player.dy = 0;
  });

  gameLoop();
});


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
