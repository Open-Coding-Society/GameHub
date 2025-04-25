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
        <div class="dna-segment bg-warning draggable" draggable="true" data-color="yellow"></div> <!-- New block -->
        <div class="dna-segment bg-info draggable" draggable="true" data-color="blue"></div> <!-- New block -->
        <div class="dna-segment bg-dark draggable" draggable="true" data-color="black"></div> <!-- New block -->
        <div class="dna-segment bg-secondary draggable" draggable="true" data-color="gray"></div> <!-- New block -->
        <div class="dna-segment bg-light draggable" draggable="true" data-color="white" style="border: 2px solid black;"></div> <!-- Updated white block -->
      </div>
    </div>
  </div>

  <div class="row justify-content-center mt-4">
    <div class="col-md-4 text-center">
      <button id="predict-btn" class="btn btn-primary" disabled>Predict Functionality</button>
      <button id="restart-btn" class="btn btn-secondary mt-2">Restart</button> <!-- Restart button -->
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
      if (color === 'gray') {
        slot.innerHTML = `<div class="dna-segment" style="background-color: #6c757d;"></div>`; // Explicit gray color
      } else {
        slot.innerHTML = `<div class="dna-segment bg-${color}"></div>`;
      }
      sequence[index] = color;
      predictBtn.disabled = !sequence.every(color => color !== null);
    }
  });
});

// Function to update points
async function updatePoints(points) {
  try {
    const response = await fetch(`${pythonURI}/api/points`, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Ensure JSON content type
      },
      body: JSON.stringify({ points })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Points updated successfully:', data.total_points);
      showPopup("You gained 100 points!"); // Show popup on successful point update
    } else {
      console.error('Failed to update points:', data.message);
    }
  } catch (error) {
    console.error('Error updating points:', error);
  }
}

// Function to show a popup message
function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  popup.style.color = "white";
  popup.style.padding = "20px";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "1000";
  popup.style.textAlign = "center";
  popup.style.fontSize = "18px";

  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 3000); // Remove popup after 3 seconds
}

// Predict functionality
predictBtn.addEventListener('click', async () => {
  const colorMap = {
    red: 1,
    green: 2,
    purple: 3,
    yellow: 4, // New block
    blue: 5,   // New block
    black: 6,  // New block
    gray: 7,   // New block
    white: 0   // Block with 0
  };

  // Ensure the sequence is properly encoded as numeric values
  const encodedSequence = sequence.map(color => colorMap[color] || 0);

  // Validate that encodedSequence is strictly numeric
  if (!encodedSequence.every(num => typeof num === 'number')) {
    console.error('Error: encodedSequence contains non-numeric values:', encodedSequence);
    predictionResult.textContent = 'Error: Invalid sequence data';
    return;
  }

  const inputData = {
    input_data: {
      Days: encodedSequence[0] || 5,
      pDNABatch: encodedSequence[1] || 3,
      ModelID: encodedSequence[2] || 1,
      ExcludeFromCRISPRCombined: encodedSequence[3] || 0,
      ScreenType: "Arrayed",
      DrugTreated: "No"
    }
  };

  // Log the inputData for debugging
  console.log('Sending inputData to backend:', JSON.stringify(inputData));

  try {
    const response = await fetch(`${pythonURI}/api/editing`, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Ensure JSON content type
      },
      body: JSON.stringify(inputData)
    });
    const data = await response.json();
    if (data.prediction) {
      predictionResult.textContent = data.prediction[0] === 1 ? "Functional" : "Not Functional";

      // Award 100 points if the gene is functional
      if (data.prediction[0] === 1) {
        updatePoints(100);
      }
    } else {
      predictionResult.textContent = 'Error: Invalid response from server';
    }
  } catch (error) {
    predictionResult.textContent = 'Error predicting functionality';
    console.error('Prediction error:', error);
  }
});

// Restart functionality
restartBtn.addEventListener('click', () => {
  // Clear all DNA slots
  dnaSlots.forEach(slot => {
    slot.innerHTML = '';
  });

  // Reset the sequence array
  sequence = Array(dnaSlots.length).fill(null);

  // Disable the predict button
  predictBtn.disabled = true;

  // Reset the prediction result
  predictionResult.textContent = '(__)';
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