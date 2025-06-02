---
layout: bootstrap
title: Number
description: Number Game
permalink: /number
Author: Ian
---

<div class="container text-center p-5">
  <h1 class="mb-4 text-success">🧠 Number Memory Test</h1>

  <div class="card game-card p-4 mx-auto" style="max-width: 500px;">
    <div id="numberDisplay" class="fs-2 mb-3" style="min-height: 60px;"></div>
    <input id="userInput" class="form-control text-center bg-dark text-light mb-3" placeholder="Enter the number" disabled />
    <button id="startBtn" class="btn btn-success">Start</button>
    <p class="mt-3 score" id="memoryStats"></p>
  </div>

  <p class="mt-4 text-muted">Memorize the number shown. Each round gets harder!</p>
</div>

<style>
  .game-card {
    background-color: #161b22;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0,255,0,0.1);
  }
  #userInput:disabled {
    background-color: #222 !important;
    color: #888 !important;
    cursor: not-allowed;
  }
  #numberDisplay {
    letter-spacing: 0.2em;
    font-family: 'Fira Mono', 'Consolas', monospace;
    user-select: none;
  }
  #memoryStats {
    font-size: 1.2rem;
  }
</style>

<script>
  const numberDisplay = document.getElementById('numberDisplay');
  const userInput = document.getElementById('userInput');
  const startBtn = document.getElementById('startBtn');
  const stats = document.getElementById('memoryStats');

  let level = 1;
  let currentNumber = "";

  function generateNumber(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  function startGame() {
    stats.textContent = "";
    userInput.value = "";
    userInput.disabled = true;
    numberDisplay.textContent = "";
    currentNumber = generateNumber(level);
    numberDisplay.textContent = currentNumber;

    // Hide number after 2 seconds + 0.5s per digit
    const delay = 2000 + level * 500;
    setTimeout(() => {
      numberDisplay.textContent = "";
      userInput.disabled = false;
      userInput.focus();
    }, delay);
  }

  function checkAnswer() {
    const input = userInput.value.trim();
    if (input === currentNumber) {
      stats.innerHTML = `✅ Correct! Level ${level}`;
      level++;
      setTimeout(startGame, 1500);
    } else {
      stats.innerHTML = `❌ Wrong! You reached level <strong>${level}</strong>.`;
      level = 1;
      startBtn.textContent = "Try Again";
    }
    userInput.disabled = true;
  }

  startBtn.addEventListener('click', () => {
    startBtn.textContent = "Restart";
    startGame();
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !userInput.disabled) {
      checkAnswer();
    }
  });

  // Disable copy/paste functionality
  userInput.addEventListener('copy', (e) => e.preventDefault());
  userInput.addEventListener('paste', (e) => e.preventDefault());
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/23toadsfactory.mp3');
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