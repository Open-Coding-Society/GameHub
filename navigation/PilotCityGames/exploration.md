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

  const player = { 
    x: 425, // Center horizontally (850 / 2)
    y: 300, // Center vertically (600 / 2)
    width: 75, // Match the default character width
    height: 75, // Match the default character height
    speed: 2, 
    dx: 0, 
    dy: 0 
  };

  const spriteImage = new Image();
  spriteImage.src = 'https://i.postimg.cc/PxDYNLjG/Default.png'; // Default character sprite

  spriteImage.onload = () => {
    gameLoop();
  };

  let discovered = new Set();
  let points = 0; // Initialize points
  const organelles = [
    { name: "Nucleus", x: 750, y: 300, r: 25, desc: "The central part of an atom that contains protons and neutrons. Also controls cell activities and contains DNA." },
    { name: "Chloroplast", x: 620, y: 180, r: 25, desc: "A part of a plant cell that helps the plant make its own food using sunlight, water, and carbon dioxide through photosynthesis." },
    { name: "Vacuole", x: 210, y: 465, r: 25, desc: "A vacuole is a storage space inside a cell that holds water, nutrients, or waste. It helps keep the cell clean and supports its shape." },
    { name: "Cell Wall", x: 700, y: 490, r: 25, desc: "The cell wall is a stiff outer layer found in plant cells that gives the cell shape, support, and protection. It is located outside the cell membrane." },
    { name: "Cell Membrane", x: 120, y: 315, r: 25, desc: "A cell membrane is a thin, flexible layer that surrounds a cell and controls what goes in and out, helping protect and support the cell." },
    { name: "Cytoplasm", x: 445, y: 90, r: 25, desc: "The gel-like substance inside a cell where the organelles float. It helps fill the cell and supports the cell’s activities." },
    { name: "Mitochondria", x: 550, y: 400, r: 25, desc: "The part of a cell that makes energy from food. Oftenly referred to as the powerhouse of the cell." },
    { name: "Ribosome", x: 275, y: 200, r: 25, desc: "The ribosome is a tiny part of a cell that makes proteins, which the cell needs to grow and work properly." },
    { name: "Golgi Apparatus", x: 425, y: 510, r: 25, desc: "The part of the cell that packages and ships proteins and other materials to where they are needed. It works like a post office inside the cell." },
    { name: "Endoplasmic Reticulum", x: 110, y: 115, r: 25, desc: "A cell part that helps make and move proteins and fats. It comes in two types: Roenough ER which has ribosomes and helps make proteins and Smooth ER which has no ribosomes and helps make fats/clean the cell." }
  ];

  const organelleImages = {
    Nucleus: new Image(),
    Chloroplast: new Image(),
    Vacuole: new Image(),
    "Cell Wall": new Image(),
    "Cell Membrane": new Image(),
    Cytoplasm: new Image(),
    Mitochondria: new Image(),
    Ribosome: new Image(),
    "Golgi Apparatus": new Image(),
    "Endoplasmic Reticulum": new Image()
  };

  // Load images for each organelle
  Object.keys(organelleImages).forEach(name => {
    organelleImages[name].src = `{{site.baseurl}}/images/${name.toLowerCase().replace(/ /g, '')}.png`;
  });

  // Move UI elements into the white square
  const whiteSquareContainer = document.createElement('div');
  Object.assign(whiteSquareContainer.style, {
    position: 'absolute',
    top: 'calc(50% + 350px)', // Same vertical position as the black square
    left: 'calc((100vw - 850px) / 2 - 350px)', // Mirrored horizontally to the left
    transform: 'translateY(-50%)',
    backgroundColor: 'white',
    width: '250px', // Same size as the black square
    height: 'auto', // Adjust height to fit all content
    minHeight: '300px', // Ensure a minimum height
    borderRadius: '6px',
    zIndex: '1001', // Ensure it appears above other elements
    padding: '10px', // Add padding for content
    color: 'black', // Set text color to black
    fontSize: '14px', // Ensure readability
    display: 'flex', // Use flexbox for better alignment
    flexDirection: 'column',
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center' // Center content horizontally
  });
  document.body.appendChild(whiteSquareContainer);

  // Add "Statistics" title centered at the top
  const title = document.createElement('h3');
  title.textContent = "Statistics";
  title.style.marginBottom = '20px'; // Add spacing below the title
  title.style.textAlign = 'center'; // Center the title
  title.style.color = 'black'; // Set text color to black
  title.style.fontWeight = 'bold'; // Make the text bold
  whiteSquareContainer.appendChild(title);

  // Append "Organelles Discovered" text and points to the white square
  const progressSpan = document.createElement('span');
  const progressDiv = document.createElement('div');
  progressDiv.classList.add('mb-3');
  progressDiv.innerHTML = "<strong>Organelles Discovered:</strong> ";
  progressDiv.style.color = 'black'; // Set text color to black
  progressDiv.appendChild(progressSpan);
  whiteSquareContainer.appendChild(progressDiv);

  const pointsDiv = document.createElement('div'); // Points display
  pointsDiv.classList.add('mb-3');
  pointsDiv.innerHTML = `<strong>Points:</strong> <span id="points-counter" style="color: black;">0</span>`;
  pointsDiv.style.color = 'black'; // Set text color to black
  whiteSquareContainer.appendChild(pointsDiv);

  // Append organelle name and description to the white square
  const infoBox = document.createElement('div');
  infoBox.style.color = 'black'; // Set text color to black
  infoBox.style.marginTop = '10px'; // Add spacing
  infoBox.style.textAlign = 'center'; // Center the description text
  whiteSquareContainer.appendChild(infoBox);

  // Ensure the white square is visible and brought to the front
  whiteSquareContainer.style.visibility = 'visible';

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

  // Add a white square mirrored to the left middle side
  const whiteSquareContainerLeft = document.createElement('div');
  Object.assign(whiteSquareContainerLeft.style, {
    position: 'absolute',
    top: 'calc(50% + 340px)', // Same vertical position as the black square
    left: 'calc((100vw - 850px) / 2 - 400px)', // Mirrored horizontally to the left
    transform: 'translateY(-50%)',
    backgroundColor: 'white',
    width: '350px', // Same size as the black square
    height: '450px', // Same size as the black square
    borderRadius: '6px',
    zIndex: '1000'
  });
  document.body.appendChild(whiteSquareContainerLeft);

  // Functions for the game
  function drawPlayer() {
    ctx.drawImage(spriteImage, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
  }

  function drawOrganelles() {
    organelles.forEach(o => {
      if (organelleImages[o.name]) {
        // Draw the image for the organelle
        if (organelleImages[o.name].complete && organelleImages[o.name].naturalWidth !== 0) {
          ctx.drawImage(organelleImages[o.name], o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
        } else {
          ctx.fillStyle = '#0000ff'; // Fallback to blue circle if image fails to load
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Draw other organelles as circles
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = discovered.has(o.name) ? '#ffe600' : '#0000ff'; // Yellow if discovered, blue otherwise
        ctx.fill();
        ctx.stroke();
      }

      // Center the text above the organelle
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(o.name, o.x, o.y - o.r - 5);
    });
  }

  function detectCollisions() {
    organelles.forEach(o => {
      const dist = Math.hypot(player.x - o.x, player.y - o.y);
      if (dist < player.width / 2 + o.r && !discovered.has(o.name)) {
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
    player.x = Math.max(0 + player.width / 2, Math.min(850 - player.width / 2, player.x)); // Restrict x between 0 and 750
    player.y = Math.max(0 + player.height / 2, Math.min(600 - player.height / 2, player.y)); // Restrict y between 0 and 750
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
