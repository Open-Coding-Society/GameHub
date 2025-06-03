---
layout: bootstrap
title: Building
description: Building
permalink: /building
Author: Ian
---

<!--Teleports Back to given World-->
<style>
  #canvas-container {
    position: relative;
    display: inline-block;
  }
  .top-right-icon {
    position: absolute;
    top: 30px;
    right: 10px;
    width: 70px;
    height: 70px;
    cursor: pointer;
    z-index: 10;
  }  
</style>
<div id="canvas-container" style="position: relative;">
  <canvas id="gameCanvas" width="100" height="50"></canvas>
  <a href="{{site.baseurl}}/world1">
    <img src="{{site.baseurl}}/images/icon30.png" alt="Home Icon" class="top-right-icon">
  </a>
</div>

<div class="container mt-5">
  <h1 class="text-center text-success mb-4">🧬 DNA Building Game</h1>
  <p class="text-center mb-4">Drag the correct base to form the complementary strand!</p>
  
  <div class="text-center mb-4">
    <button class="btn btn-info" id="hint-button">Hint Button</button>
    <p id="hint-text" class="mt-3" style="display: none;">Adenine pairs w/ Thymine & Cytosine pairs w/ Guanine.</p>
  </div>

  <div class="row justify-content-center mb-4">
    <div class="col-md-5">
      <div class="card bg-dark text-white mb-3">
        <div class="card-header">Original Strand</div>
        <div class="card-body d-flex flex-column align-items-center gap-2" id="original-strand"></div>
      </div>
    </div>
    <div class="col-md-5">
      <div class="card bg-dark text-white mb-3">
        <div class="card-header">Complementary Strand</div>
        <div class="card-body d-flex flex-column align-items-center gap-2" id="complementary-strand"></div>
      </div>
    </div>
  </div>

  <h4 class="text-center text-muted mb-3">🧪 Base Pool</h4>
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div class="card bg-secondary p-3 mb-3">
        <div class="d-flex flex-wrap justify-content-center gap-2" id="base-pool"></div>
      </div>
    </div>
  </div>

  <div class="text-center">
    <button class="btn btn-success btn-lg" onclick="calculateStability()">Check Stability</button>
    <div id="score" class="mt-3 fs-5 text-white"></div>
  </div>
</div>

<style>
  body {
    background-color: #121212;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
  }
  .base-slot, .draggable {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  .base-slot {
    background-color: #2a2a2a;
    border: 2px dashed #555;
    color: #ccc;
  }
  .draggable {
    cursor: grab;
    border: 2px solid #fff;
  }
  .A { background-color: #e53935; color: white; }
  .T { background-color: #fdd835; color: black; }
  .C { background-color: #43a047; color: white; }
  .G { background-color: #1e88e5; color: white; }
</style>

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

const basePairs = { A: 'T', T: 'A', C: 'G', G: 'C' };
const strand = ['A', 'G', 'T', 'C', 'A', 'T'];

const originalStrandEl = document.getElementById('original-strand');
const complementaryStrandEl = document.getElementById('complementary-strand');
const basePoolEl = document.getElementById('base-pool');

strand.forEach(base => {
  const el = document.createElement('div');
  el.className = `base-slot ${base}`;
  el.textContent = base;
  originalStrandEl.appendChild(el);
});

strand.forEach(() => {
  const slot = document.createElement('div');
  slot.className = 'base-slot';
  slot.ondrop = drop;
  slot.ondragover = allowDrop;
  complementaryStrandEl.appendChild(slot);
});

const pool = [...strand.map(base => basePairs[base]), ...strand.map(base => basePairs[base])];
pool.sort(() => Math.random() - 0.5);
pool.forEach((base, i) => {
  const el = document.createElement('div');
  el.className = `draggable ${base}`;
  el.draggable = true;
  el.textContent = base;
  el.id = `base-${i}`;
  el.ondragstart = drag;
  basePoolEl.appendChild(el);
});

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const draggedEl = document.getElementById(data);
  if (ev.target.textContent === '') {
    ev.target.textContent = draggedEl.textContent;
    ev.target.className = `base-slot ${draggedEl.textContent}`;
    draggedEl.remove();
  }
}

let stabilityChecked = false; // Flag to prevent multiple clicks

function calculateStability() {
  if (stabilityChecked) return; // Prevent multiple clicks

  const complements = complementaryStrandEl.children;
  let correct = 0;
  let gcCount = 0;
  let atCount = 0;
  strand.forEach((base, i) => {
    const comp = complements[i].textContent;
    if (comp === basePairs[base]) {
      correct++;
      if ((base === 'C' && comp === 'G') || (base === 'G' && comp === 'C')) {
        gcCount++;
      } else if ((base === 'A' && comp === 'T') || (base === 'T' && comp === 'A')) {
        atCount++;
      }
    }
  });
  const percentCorrect = Math.round((correct / strand.length) * 100);
  const gcPercent = Math.round((gcCount / strand.length) * 100);
  const atPercent = Math.round((atCount / strand.length) * 100);
  document.getElementById('score').innerHTML = 
    `✅ Correct Matches: ${percentCorrect}%<br>🧬 GC Stability: ${gcPercent}%<br>🧬 AT Stability: ${atPercent}%`;

  if (correct === strand.length) {
    updatePoints(25); // Award 25 points for all correct matches
    stabilityChecked = true; // Set flag to prevent further clicks
  }
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
      showPopup("You earned 25 points!");
    }
  } catch (error) {
    console.error('Error updating points:', error);
  }
}

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

// Attach the function to the global window object
window.calculateStability = calculateStability;

document.getElementById('hint-button').addEventListener('click', () => {
  const hintText = document.getElementById('hint-text');
  hintText.style.display = hintText.style.display === 'none' ? 'block' : 'none';
});
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/1firststeps.mp3'); // Change path as needed
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