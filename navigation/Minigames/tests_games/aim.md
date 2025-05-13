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
  }
  .miss-zone {
    width: 100%;
    height: 100%;
    position: absolute;
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
  let gameInterval, endTimeout;

  function spawnTarget() {
    const target = document.createElement('div');
    target.classList.add('target');

    const x = Math.random() * (gameBox.clientWidth - 50);
    const y = Math.random() * (gameBox.clientHeight - 50);
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    target.addEventListener('click', (e) => {
      e.stopPropagation();
      score++;
      updateStats();
      target.remove();
      spawnTarget();
    });

    gameBox.appendChild(target);
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

    spawnTarget();

    gameBox.addEventListener('click', registerMiss);

    endTimeout = setTimeout(() => {
      endGame();
    }, gameDuration);
  }

  function registerMiss(e) {
    if (e.target.classList.contains('miss-zone')) {
      misses++;
      updateStats();
    }
  }

  function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearTimeout(endTimeout);
    gameBox.innerHTML = `<button id="startBtn" class="btn btn-success position-absolute top-50 start-50 translate-middle">Start Game</button>`;
    updateStats();
    document.getElementById('startBtn').addEventListener('click', startGame);
  }

  startBtn.addEventListener('click', startGame);
</script>
