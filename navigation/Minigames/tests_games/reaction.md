---
layout: bootstrap
title: Reaction
description: Reaction Game
permalink: /reaction
Author: Ian
---

<div class="container text-center p-5">
  <h1 class="mb-4 text-success">🧠 Reaction Time Test</h1>

  <div id="game" class="card game-card p-4 mx-auto" style="max-width: 600px;">
    <div id="screen" class="start-screen">
      <h2>Click to start</h2>
    </div>
    <p id="result" class="mt-3 score"></p>
  </div>

  <p class="mt-4 text-muted">Try to click as quickly as you can when the screen turns green.</p>
</div>

<style>
  body {
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: 'Segoe UI', sans-serif;
    cursor: default; /* Always show default mouse icon */
  }
  .game-card {
    background-color: #161b22;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0,255,0,0.1);
  }
  .start-screen, .wait-screen, .click-screen {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
  }
  .start-screen {
    background-color: #21262d;
    cursor: pointer;
  }
  .wait-screen {
    background-color: #30363d;
    cursor: wait;
  }
  .click-screen {
    background-color: #238636;
    cursor: pointer;
  }
  .score {
    font-size: 1.5rem;
  }
</style>

<script>
  const screen = document.getElementById('screen');
  const result = document.getElementById('result');
  let startTime, timeout;

  screen.addEventListener('click', () => {
    if (screen.classList.contains('start-screen')) {
      screen.className = 'wait-screen';
      screen.innerHTML = '<h2>Wait for green...</h2>';
      timeout = setTimeout(() => {
        screen.className = 'click-screen';
        screen.innerHTML = '<h2>CLICK!</h2>';
        startTime = new Date().getTime();
      }, Math.random() * 3000 + 2000);
    } else if (screen.classList.contains('click-screen')) {
      const endTime = new Date().getTime();
      let reactionTime = endTime - startTime;
      reactionTime = Math.min(reactionTime, 10000); // Cap display at 10,000ms
      result.innerText = `⏱️ Your reaction time: ${reactionTime} ms`;
      screen.className = 'start-screen';
      screen.innerHTML = '<h2>Click to try again</h2>';
    } else if (screen.classList.contains('wait-screen')) {
      clearTimeout(timeout);
      result.innerText = '⚠️ Too soon! Wait for green!';
      screen.className = 'start-screen';
      screen.innerHTML = '<h2>Click to try again</h2>';
    }
  });
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/24mushroomgorge.mp3');
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