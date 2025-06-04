---
layout: bootstrap
title: Editing
description: Editing
permalink: /editing
Author: Pradyun
---

<!--Teleports Back to given World-->
<style>
  #canvas-container {
    position: relative;
    display: inline-block;
  }
  .right-center-icon {
    position: absolute;
    top: 50%;
    right: 32px;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    cursor: pointer;
    z-index: 10;
    border-radius: 10px;
    background: rgba(0,0,0,0.12);
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }
  .right-center-icon:hover {
    background: rgba(0,0,0,0.22);
  }
</style>
  
<div id="canvas-container" style="position: relative;">
  <canvas id="gameCanvas" width="100" height="50"></canvas>
  <a href="{{site.baseurl}}/world1">
    <img src="{{site.baseurl}}/images/icon30.png" alt="Home Icon" class="right-center-icon">
  </a>
</div>

<div class="container mt-5">
  <h1 class="text-center">Gene Editing Challenge</h1>
  <p class="text-center">Drag and drop the colored DNA strands to edit the gene and predict its functionality.</p>
  
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-8">
          <div class="dna-helix position-relative">
            <div class="dna-slot position-absolute" style="top: 12%; left: 50%; transform: translateX(-50%); width: 60px; height: 6px;"></div>
            <div class="dna-slot position-absolute" style="top: 38.5%; left: 49%; transform: translateX(-50%); width: 50px; height: 6px;"></div>
            <div class="dna-slot position-absolute" style="top: 48%; left: 53%; transform: translateX(-50%); width: 55px; height: 6px;"></div>
            <div class="dna-slot position-absolute" style="top: 76.2%; left: 49%; transform: translateX(-50%); width: 40px; height: 6px;"></div>
            <div class="dna-slot position-absolute" style="top: 86%; left: 50%; transform: translateX(-50%); width: 60px; height: 6px;"></div>
          </div>
          <div class="dna-pieces mt-3 d-flex justify-content-center">
            <div class="dna-segment bg-danger draggable" draggable="true" data-color="red"></div>
            <div class="dna-segment bg-success draggable" draggable="true" data-color="green"></div>
            <div class="dna-segment bg-purple draggable" draggable="true" data-color="purple"></div>
            <div class="dna-segment bg-warning draggable" draggable="true" data-color="yellow"></div>
            <div class="dna-segment bg-info draggable" draggable="true" data-color="blue"></div>
            <div class="dna-segment bg-dark draggable" draggable="true" data-color="black"></div>
            <div class="dna-segment bg-secondary draggable" draggable="true" data-color="gray"></div>
            <div class="dna-segment bg-light draggable" draggable="true" data-color="white" style="border: 2px solid black;"></div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="game-description">
            <h4>Game Description</h4>
            <p>Each colored block represents a number, and each slot represents a step in testing a gene. Your goal is to arrange the blocks in the slots to form a valid sequence and predict the gene's functionality.</p>
            <p>Drag and drop the blocks into the double strand slots located in the DNA. Once all slots are filled, click "Predict Functionality" to see the result.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-center mt-4">
    <div class="col-md-4 text-center">
      <button id="predict-btn" class="btn btn-primary" disabled>Predict Functionality</button>
      <button id="restart-btn" class="btn btn-secondary mt-2">Restart</button>
      <p class="mt-3">Your gene is: <span id="prediction-result">(__)</span></p>
    </div>
  </div>
</div>

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

const draggables = document.querySelectorAll('.draggable');
const dnaSlots = document.querySelectorAll('.dna-slot');
const predictBtn = document.getElementById('predict-btn');
const restartBtn = document.getElementById('restart-btn');
const predictionResult = document.getElementById('prediction-result');
let sequence = Array(dnaSlots.length).fill(null);
let predictionMade = false; 

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

dnaSlots.forEach((slot, index) => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
    slot.classList.add('drag-over');
  });

  slot.addEventListener('dragleave', () => {
    slot.classList.remove('drag-over');
  });

  slot.addEventListener('drop', e => {
    e.preventDefault();
    slot.classList.remove('drag-over');
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      const color = dragging.dataset.color;
      slot.innerHTML = color === 'gray'
        ? `<div class="dna-segment" style="background-color: #6c757d;"></div>`
        : `<div class="dna-segment bg-${color}"></div>`;
      sequence[index] = color;
      predictBtn.disabled = !sequence.every(color => color !== null);
    }
  });
});

function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  Object.assign(popup.style, {
    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white", padding: "20px",
    borderRadius: "8px", zIndex: "1000", textAlign: "center", fontSize: "18px"
  });
  document.body.appendChild(popup);
  setTimeout(() => document.body.removeChild(popup), 3000);
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
      showPopup("You gained 100 points!");
    }
  } catch (error) {
    console.error('Error updating points:', error);
  }
}

predictBtn.addEventListener('click', () => {
  if (predictionMade) return; 

  // Always show "Functional" and a random percent between 50-100%
  const percent = Math.floor(Math.random() * 51) + 50; // 50-100
  const resultText = `Functional (${percent}%)`;
  predictionResult.textContent = resultText;
  console.log('Displayed result:', resultText); 

  updatePoints(100);
  predictionMade = true; 
});

restartBtn.addEventListener('click', () => {
  dnaSlots.forEach(slot => slot.innerHTML = '');
  sequence = Array(dnaSlots.length).fill(null);
  predictBtn.disabled = true;
  predictionResult.textContent = '(__)';
  predictionMade = false; 
});
</script>

<style>
  .dna-helix {
    width: 100%;
    height: 400px;
    background: url('{{site.baseurl}}/images/strand.png') no-repeat center;
    background-size: contain;
    position: relative;
  }
  .dna-slot {
    border: 2px dashed #6c757d;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
  }
  .dna-segment {
    width: 60px;
    height: 6px;
    border-radius: 3px;
    cursor: grab;
  }
  .drag-over {
    background-color: #d4edda;
  }
</style>

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/2resurrections.mp3'); // Change path as needed
music.loop = true;
music.volume = 0.5;

// Play music after first user interaction (required by browsers)
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>