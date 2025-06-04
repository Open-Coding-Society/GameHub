---
layout: bootstrap
title: Typing
description: Typing Game
permalink: /typing
Author: Ian
---

<div class="container text-center p-5">
  <h1 class="mb-4 text-success">⌨️ Typing Speed Test</h1>

  <div class="card game-card p-4 mx-auto" style="max-width: 800px;">
    <p id="prompt" class="mb-3 fs-5" style="min-height: 60px;"></p>
    <textarea id="inputBox" class="form-control bg-dark text-light" rows="4" placeholder="Start typing here..." disabled></textarea>
    <button id="startTypingBtn" class="btn btn-success mt-3">Start Test</button>
    <p class="mt-3 score" id="typingStats"></p>
  </div>

  <p class="mt-4 text-muted">How fast and accurately can you type?</p>
</div>

<style>
  .game-card {
    background-color: #161b22;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0,255,0,0.1);
  }
  textarea:disabled {
    cursor: not-allowed;
  }
</style>

<script>
  const promptText = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires practice and focus.",
    "JavaScript powers interactive web experiences.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "Success in programming comes from persistence and curiosity."
  ];

  const promptEl = document.getElementById('prompt');
  const inputBox = document.getElementById('inputBox');
  const stats = document.getElementById('typingStats');
  const startBtn = document.getElementById('startTypingBtn');

  let currentPrompt = "";
  let startTime = 0;
  let ended = false;

  function startTypingTest() {
    // Choose random sentence
    currentPrompt = promptText[Math.floor(Math.random() * promptText.length)];
    promptEl.textContent = currentPrompt;

    // Reset
    inputBox.value = "";
    inputBox.disabled = false;
    inputBox.focus();
    stats.textContent = "";
    ended = false;
    startTime = 0;

    // Timer starts on first key
    inputBox.addEventListener('keydown', startOnFirstKey, { once: true });
  }

  function startOnFirstKey() {
    startTime = new Date().getTime();

    // Detect when done
    inputBox.addEventListener('input', () => {
      if (ended) return;

      const typed = inputBox.value;
      if (typed.endsWith('.') && typed.trim() === currentPrompt) {
        const endTime = new Date().getTime();
        ended = true;
        calculateStats(typed, endTime);
      }
    });
  }

  function calculateStats(typed, endTime) {
    const timeTaken = (endTime - startTime) / 1000; // seconds
    const words = currentPrompt.split(" ").length;
    const wpm = Math.round((words / timeTaken) * 60);

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === currentPrompt[i]) correct++;
    }
    const accuracy = Math.round((correct / currentPrompt.length) * 100);

    stats.innerHTML = `🏁 Time: ${timeTaken.toFixed(2)}s &nbsp;&nbsp; 📈 WPM: ${wpm} &nbsp;&nbsp; 🎯 Accuracy: ${accuracy}%`;
    inputBox.disabled = true;
  }

  startBtn.addEventListener('click', startTypingTest);
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...


 // Disable copy/paste functionality
  userInput.addEventListener('copy', (e) => e.preventDefault());
  userInput.addEventListener('paste', (e) => e.preventDefault());
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/26coconutmall.mp3'); // Change path as needed
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