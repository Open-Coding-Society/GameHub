---
layout: bootstrap
title: Exploration
description: Exploration
permalink: /exploration
Author: Darsh
---

<style>
  body {
    background-image: url('{{site.baseurl}}/images/cellexplorationlayout.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>

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
    document.body.style.overflowX = 'hidden'; // Disable horizontal scrolling

  // Ensure the game-container and joystick-container exist
  const infoContainer = document.getElementById('info-container');

  if (!infoContainer) {
    console.error('Required containers are missing in the DOM.');
    return;
  }

  // Remove the game container entirely
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.remove();
  }

  // Remove joystick container
  const joystickContainer = document.getElementById('joystick-container');
  if (joystickContainer) {
    joystickContainer.remove();
  }

  // Create the canvas for the game
  const canvas = document.createElement('canvas');
  infoContainer.appendChild(canvas);
  canvas.width = 2000;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const player = { x: 100, y: 100, size: 15, speed: 2, dx: 0, dy: 0 };
  let discovered = new Set();
  let points = 0; // Initialize points
  const organelles = [
    { name: "Nucleus", x: 600, y: 300, r: 30, desc: "Controls cell activities and contains DNA." },
    { name: "Chloroplast", x: 600, y: 150, r: 25, desc: "Performs photosynthesis." },
    { name: "Vacuole", x: 200, y: 450, r: 35, desc: "Stores nutrients and waste products." },
    { name: "Cell Wall", x: 670, y: 475, r: 20, desc: "Provides structural support." },
    { name: "Cell Membrane", x: 100, y: 300, r: 20, desc: "Regulates what enters and leaves the cell." },
    { name: "Cytoplasm", x: 350, y: 100, r: 20, desc: "Gel-like substance where organelles reside." },
    { name: "Mitochondrion", x: 400, y: 375, r: 25, desc: "Produces energy for the cell." },
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
  infoContainer.appendChild(progressDiv);

  const pointsDiv = document.createElement('div'); // Points display
  pointsDiv.classList.add('mb-3');
  pointsDiv.innerHTML = `<strong>Points:</strong> <span id="points-counter">0</span>`;
  infoContainer.appendChild(pointsDiv);

  const infoBox = document.createElement('div');
  infoContainer.appendChild(infoBox);

  const endScreen = document.createElement('div');
  endScreen.id = 'endScreen';
  Object.assign(endScreen.style, {
    display: 'none', position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    background: 'rgba(0, 0, 0, 0.85)', color: 'white', justifyContent: 'center', alignItems: 'center',
    flexDirection: 'column', zIndex: '9999'
  });
  const endMessage = document.createElement('h1');
  endMessage.id = 'endMessage';
  const playAgainBtn = document.createElement('button');
  playAgainBtn.id = 'playAgainBtn';
  playAgainBtn.textContent = '🔁 Play Again';
  playAgainBtn.style.padding = '10px 20px';
  playAgainBtn.style.fontSize = '18px';
  playAgainBtn.style.background = '#4caf50';
  playAgainBtn.style.color = 'white';
  playAgainBtn.style.border = 'none';
  playAgainBtn.style.borderRadius = '5px';
  playAgainBtn.style.cursor = 'pointer';
  playAgainBtn.onclick = () => location.reload();
  endScreen.appendChild(endMessage);
  endScreen.appendChild(playAgainBtn);
  document.body.appendChild(endScreen);

  // Add resized icon3.png to the middle-right of the canvas
  const iconContainer = document.createElement('div');
  Object.assign(iconContainer.style, {
    position: 'absolute',
    top: 'calc(50% + 350px)', // Move 200px down
    right: 'calc((100vw - 850px) / 2 - 350px)', // Move 400px to the right
    transform: 'translateY(-50%)',
    backgroundColor: 'black',
    padding: '10px', // 5x original padding
    borderRadius: '6px',
    zIndex: '1000'
  });
  const iconImage = document.createElement('img');
  iconImage.src = '{{ site.baseurl }}/images/icon3.png';
  iconImage.alt = 'Icon';
  iconImage.style.width = '250px'; // 5x original width
  iconImage.style.height = '250px'; // 5x original height
  iconContainer.appendChild(iconImage);
  document.body.appendChild(iconContainer);

  // Functions for the game
  function drawPlayer() {
    ctx.fillStyle = "#ff0000"; // Red color for the player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOrganelles() {
    organelles.forEach(o => {
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = discovered.has(o.name) ? '#ffe600' : '#0000ff'; // Yellow if discovered, blue otherwise
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
        updatePoints(10); // Call the API to update points

        if (discovered.size === organelles.length) {
          endMessage.textContent = "🎉 You learned about all the organelles!";
          endScreen.style.display = 'flex';
        }
      }
    });
  }

  function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Restrict movement within the boundaries of 0,0,750,750
    player.x = Math.max(0 + player.size, Math.min(850 - player.size, player.x)); // Restrict x between 0 and 750
    player.y = Math.max(0 + player.size, Math.min(600 - player.size, player.y)); // Restrict y between 0 and 750
  }

  function gameLoop() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the playable area's background to forest green
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.fillRect(0, 0, 850, 600); // Fill the area between x: 75-1375 and y: 50-1000

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

  // Ensure WASD controls are the only input method
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'w':
        player.dy = -player.speed;
        break;
      case 'a':
        player.dx = -player.speed;
        break;
      case 's':
        player.dy = player.speed;
        break;
      case 'd':
        player.dx = player.speed;
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'w':
      case 's':
        player.dy = 0;
        break;
      case 'a':
      case 'd':
        player.dx = 0;
        break;
    }
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
    <div class="col-md-12 text-center">
      <div style="background-color: gray; color: white; padding: 15px; border-radius: 8px; margin-top: 50px;">
        <h1>   Cell Exploration Journey</h1>
        <p>Use the WASD keys to hover over different cellular organelles and learn what they do.</p>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 text-center" style="margin-top: 20px;">
      <div style="background-color: black; color: white; padding: 15px; border-radius: 8px;">
        <h3>Game Description</h3>
        <p>Your goal is to hover over all the different organelles and learn their purposes.</p>
        <p>Once you collect all 10 organelles, you get 50 points and can click Play Again to keep collecting points.</p>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-4" id="info-container" style="margin-left: 20px;">
      <!-- Progress and organelle info will be shown here -->
    </div>
  </div>
</div>
