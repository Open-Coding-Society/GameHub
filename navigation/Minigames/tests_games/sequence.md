---
layout: bootstrap
title: Sequence
description: Sequence Game
permalink: /sequence
Author: Ian
---

<div class="container text-center p-5">
  <h1 class="mb-4 text-success">🧠 Sequence Memory Test</h1>

  <div class="card game-card p-4 mx-auto" style="max-width: 400px;">
    <div id="grid" class="d-grid mx-auto mb-4" style="grid-template-columns: repeat(3, 80px); grid-gap: 10px;"></div>
    <button id="startSequenceBtn" class="btn btn-success">Start</button>
    <p class="mt-3 score" id="sequenceStats"></p>
  </div>

  <p class="mt-4 text-muted">Repeat the sequence by clicking the squares in order. Each round gets harder!</p>
</div>

<style>
  .game-card {
    background-color: #161b22;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0,255,0,0.1);
  }

  #grid button {
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    background-color: #21262d;
    border: 2px solid #30363d;
    transition: background-color 0.2s;
  }

  #grid button.active {
    background-color: #2ea043;
  }

  #grid button:disabled {
    cursor: default;
  }
</style>

<script>
  const grid = document.getElementById('grid');
  const startBtn = document.getElementById('startSequenceBtn');
  const stats = document.getElementById('sequenceStats');

  let sequence = [];
  let userStep = 0;
  let level = 1;
  let buttons = [];

  function createGrid() {
    grid.innerHTML = '';
    buttons = [];
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.disabled = true;
      btn.dataset.index = i;
      btn.addEventListener('click', () => handleUserInput(i));
      grid.appendChild(btn);
      buttons.push(btn);
    }
  }

  function flash(index) {
    buttons[index].classList.add('active');
    setTimeout(() => {
      buttons[index].classList.remove('active');
    }, 400);
  }

  function playSequence() {
    buttons.forEach(b => b.disabled = true);
    let i = 0;
    const interval = setInterval(() => {
      flash(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          buttons.forEach(b => b.disabled = false);
        }, 500);
      }
    }, 600);
  }

  function nextRound() {
    userStep = 0;
    const next = Math.floor(Math.random() * 9);
    sequence.push(next);
    stats.textContent = `🟢 Level ${level}`;
    playSequence();
  }

  function handleUserInput(index) {
    if (index === sequence[userStep]) {
      userStep++;
      if (userStep === sequence.length) {
        level++;
        setTimeout(nextRound, 800);
      }
    } else {
      stats.innerHTML = `❌ Wrong! You reached level <strong>${level}</strong>.`;
      sequence = [];
      level = 1;
      startBtn.textContent = "Try Again";
      buttons.forEach(b => b.disabled = true);
    }
  }

  startBtn.addEventListener('click', () => {
    createGrid();
    sequence = [];
    level = 1;
    nextRound();
    startBtn.textContent = "Restart";
  });
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/25moomoomeadows.mp3'); // Change path as needed
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