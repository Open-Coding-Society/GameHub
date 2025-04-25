---
layout: bootstrap
title: Editing
description: Editing
permalink: /editing
Author: Pradyun
---

<div class="container mt-5">
  <h1 class="text-center">Gene Editing Challenge</h1>
  <p class="text-center">Drag and drop the colored DNA strands to edit the gene and predict its functionality.</p>
  
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div class="dna-helix position-relative">
        <!-- DNA slots -->
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
      </div>
    </div>
  </div>

  <div class="row justify-content-center mt-4">
    <div class="col-md-4 text-center">
      <button id="predict-btn" class="btn btn-primary" disabled>Predict Functionality</button>
      <p class="mt-3">Your gene is: <span id="prediction-result">(__)</span></p>
    </div>
  </div>
</div>

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
  // Drag and drop functionality
  const draggables = document.querySelectorAll('.draggable');
  const dnaSlots = document.querySelectorAll('.dna-slot');
  const predictBtn = document.getElementById('predict-btn');
  const predictionResult = document.getElementById('prediction-result');
  let sequence = Array(dnaSlots.length).fill(null);

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
        slot.innerHTML = `<div class="dna-segment bg-${dragging.dataset.color}"></div>`;
        sequence[index] = dragging.dataset.color;
        predictBtn.disabled = !sequence.every(color => color !== null);
      }
    });
  });

  // Predict functionality
  predictBtn.addEventListener('click', async () => {
    const inputData = { input_data: { sequence: sequence } }; // Ensure the sequence is passed as expected by the API
    try {
      const response = await fetch(`${pythonURI}/api/editing`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(inputData)
      });
      const data = await response.json();
      if (data.prediction) {
        predictionResult.textContent = data.prediction;
      } else {
        predictionResult.textContent = 'Error: Invalid response from server';
      }
    } catch (error) {
      predictionResult.textContent = 'Error predicting functionality';
      console.error('Prediction error:', error);
    }
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