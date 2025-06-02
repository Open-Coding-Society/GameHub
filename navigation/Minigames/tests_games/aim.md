---
layout: bootstrap
title: Aim
description: Aim Trainer Game
permalink: /aim
Author: Ian
---

<div class="container text-center p-5">
  <h1 class="mb-4 text-success">🎯 Aim Trainer</h1>

  <div class="card game-card p-4 mx-auto" style="max-width: 800px;">
    <div id="gameBox" class="position-relative mx-auto" style="width: 600px; height: 400px; background-color: #21262d; border-radius: 1rem;">
      <button id="startBtn" class="btn btn-success position-absolute top-50 start-50 translate-middle">Start Game</button>
    </div>
    <p class="mt-3 score" id="stats"></p>
  </div>

  <p class="mt-4 text-muted">Click the targets as fast as you can. 20 seconds. Go!</p>
</div>

<style>
  .game-card {
    background-color: #161b22;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0,255,0,0.1);
  }
  .target {
    width: 50px;
    height: 50px;
    background-color: #238636;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
    z-index: 2;
  }
  .miss-zone {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
</style>

<script>
  const gameBox = document.getElementById('gameBox');
  const startBtn = document.getElementById('startBtn');
  const stats = document.getElementById('stats');
  let score = 0;
  let misses = 0;
  let gameRunning = false;
  let gameDuration = 20000; // 20 seconds
  let endTimeout = null;
  let currentTarget = null;

  function spawnTarget() {
    // Remove any existing target
    if (currentTarget) currentTarget.remove();

    const target = document.createElement('div');
    target.classList.add('target');

    const x = Math.random() * (gameBox.clientWidth - 50);
    const y = Math.random() * (gameBox.clientHeight - 50);
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    target.addEventListener('click', (e) => {
      if (!gameRunning) return;
      e.stopPropagation();
      score++;
      updateStats();
      spawnTarget();
    });

    gameBox.appendChild(target);
    currentTarget = target;
  }

  function updateStats() {
    stats.innerHTML = `✅ Hits: ${score} &nbsp;&nbsp; ❌ Misses: ${misses}`;
  }

  function startGame() {
    score = 0;
    misses = 0;
    updateStats();
    gameRunning = true;
    startBtn.style.display = 'none';

    // Remove any existing targets
    if (currentTarget) currentTarget.remove();

    spawnTarget();

    // Ensure only one miss-zone exists
    let missZone = gameBox.querySelector('.miss-zone');
    if (!missZone) {
      missZone = document.createElement('div');
      missZone.className = 'miss-zone';
      gameBox.appendChild(missZone);
    }
    missZone.onclick = function(e) {
      // Only count as miss if not clicking the target
      if (!e.target.classList.contains('target') && gameRunning) {
        misses++;
        updateStats();
      }
    };

    endTimeout = setTimeout(() => {
      endGame();
    }, gameDuration);
  }

  function endGame() {
    gameRunning = false;
    clearTimeout(endTimeout);
    if (currentTarget) currentTarget.remove();
    stats.innerHTML += `<br><b>Game Over!</b>`;
    // Reset start button
    gameBox.innerHTML = `
      <button id="startBtn" class="btn btn-success position-absolute top-50 start-50 translate-middle">Start Game</button>
    `;
    document.getElementById('startBtn').addEventListener('click', startGame);
  }

  startBtn.addEventListener('click', startGame);
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/21daisycircuit.mp3');
music.loop = true;
music.volume = 0.5;
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>