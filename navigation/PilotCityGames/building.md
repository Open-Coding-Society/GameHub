---
layout: bootstrap
title: Building
description: Building
permalink: /building
Author: Ian
---

<header>
  🧬 DNA Building Game
</header>
<main>
  <p>Drag the correct base to form the complementary strand!</p>

  <div class="game-wrapper">
    <!-- Original DNA strand -->
    <div class="strand" id="original-strand"></div>

    <!-- Complementary strand (droppable) -->
    <div class="strand" id="complementary-strand"></div>
  </div>

  <div class="base-pool-title">🧪 Base Pool</div>
  <div class="base-pool" id="base-pool"></div>

  <button onclick="calculateStability()">Check Stability</button>
  <div id="score"></div>
</main>

<style>
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #121212;
    color: #ffffff;
  }
  header {
    background-color: #1db954;
    padding: 20px;
    text-align: center;
    color: white;
    font-size: 28px;
    font-weight: bold;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
  }
  .game-wrapper {
    display: flex;
    justify-content: center;
    gap: 60px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  .strand {
    display: flex;
    flex-direction: column;
    gap: 10px;
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

  .base-pool-title {
    font-size: 24px;
    margin: 30px 0 10px;
    color: #ccc;
  }
  .base-pool {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }
  button {
    margin-top: 20px;
    background-color: #1db954;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 18px;
    border-radius: 30px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  button:hover {
    background-color: #17a74a;
  }
  #score {
    margin-top: 20px;
    font-size: 20px;
    color: #ddd;
  }
</style>

<script>
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

  function calculateStability() {
    const complements = complementaryStrandEl.children;
    let correct = 0;
    let gcCount = 0;
    strand.forEach((base, i) => {
      const comp = complements[i].textContent;
      if (comp === basePairs[base]) {
        correct++;
        if ((base === 'C' && comp === 'G') || (base === 'G' && comp === 'C')) {
          gcCount++;
        }
      }
    });
    const percentCorrect = Math.round((correct / strand.length) * 100);
    const gcPercent = Math.round((gcCount / strand.length) * 100);
    document.getElementById('score').innerHTML = 
      `✅ Correct Matches: ${percentCorrect}%<br>🧬 GC Stability: ${gcPercent}%`;
  }
</script>

