---
layout: post
title: Building
description: Building
Author: Ian
permalink: /building
---

<table>
    <tr>
        <td><a href="{{site.baseurl}}/index">Home</a></td>
        <td><a href="{{site.baseurl}}/blackjack">BlackJack</a></td>
        <td><a href="{{site.baseurl}}/building">Building</a></td>
        <td><a href="{{site.baseurl}}/editing">Editing</a></td>
        <td><a href="{{site.baseurl}}/exploration">Exploration</a></td>
        <td><a href="{{site.baseurl}}/outbreak">Outbreak</a></td>
        <td><a href="{{site.baseurl}}/worldmap">WorldMap</a></td>
    </tr>
</table>

<style>
:root {
    --background: linear-gradient(145deg, #89A8B2, #B3C8CF, #E5E1DA, #F1F0E8, rgb(137, 168, 178), rgb(179, 200, 207), rgb(229, 225, 218), rgb(241, 240, 232));
}

body {
    background: var(--background);
    min-height: 100vh;
    margin: 0;
    padding: 0;
}

.competition-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    background: white;
    font-family: Arial, sans-serif;
}

.timer-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
}

.timer-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100px;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.start-btn {
    background-color: #4CAF50;
    color: white;
}

.stop-btn {
    background-color: #f44336;
    color: white;
}

.save-btn {
    background-color: #2196F3;
    color: white;
}

.timer-display {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0;
    color: #333;
}

.word-display {
    font-size: 1.5rem;
    color: #666;
    margin: 1rem 0;
}

.results-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
}

.results-table th,
.results-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.results-table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.results-table tr:hover {
    background-color: #f9f9f9;
}

.drawing-container {
    margin: 2rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
}

.canvas-controls {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
}

#drawingCanvas {
    background: white;
    cursor: crosshair;
}

.color-picker {
    width: 50px;
    height: 30px;
    padding: 0;
    border: none;
}

.brush-size {
    width: 100px;
}

.clear-btn {
    background-color: #ff9800;
    color: white;
}

.error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    display: none;
}
</style>

<div class="competition-container">
    <div id="errorMessage" class="error-message" style="display: none;"></div>
    <div class="timer-controls">
        <input type="number" id="timerDuration" class="timer-input" placeholder="Seconds" min="1" value="60">
        <button id="startTimer" class="btn start-btn">Start Timer</button>
        <button id="stopTimer" class="btn stop-btn" disabled>Stop Timer</button>
        <button id="saveDrawing" class="btn save-btn">Save Drawing</button>
    </div>

    <div class="timer-display" id="timerDisplay">Time: 60s</div>
    <div class="word-display" id="wordDisplay">Word: </div>

    <div class="drawing-container">
        <div class="canvas-controls">
            <input type="color" id="colorPicker" class="color-picker" value="#000000">
            <input type="range" id="brushSize" class="brush-size" min="1" max="20" value="5">
            <button id="clearCanvas" class="btn clear-btn">Clear Canvas</button>
        </div>
        <canvas id="drawingCanvas" width="800" height="600"></canvas>
    </div>

    <table class="results-table">
        <thead>
            <tr>
                <th>User</th>
                <th>Time Taken (s)</th>
                <th>Word Drawn</th>
            </tr>
        </thead>
        <tbody id="resultsBody">
        </tbody>
    </table>
</div>

<script type="module">
import { pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearCanvas');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!isDrawing) return;
    
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('saveDrawing').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `drawing_${currentWord}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    canvas.width = containerWidth - 20;
    canvas.height = Math.min(600, window.innerHeight - 300);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial sizing

let currentWord = '';
let timerInterval;

document.getElementById('startTimer').addEventListener('click', async () => {
    const duration = parseInt(document.getElementById('timerDuration').value);
    if (duration <= 0) {
        alert('Please enter a valid duration');
        return;
    }

    try {
        // Disable save drawing button when starting new timer
        document.getElementById('saveDrawing').disabled = true;
        
        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const response = await fetch(`${pythonURI}/api/competition/timer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Origin': 'client'
            },
            credentials: 'include',
            body: JSON.stringify({ duration })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        currentWord = data.word;
        document.getElementById('wordDisplay').textContent = `Word: ${currentWord}`;
        document.getElementById('startTimer').disabled = true;
        document.getElementById('stopTimer').disabled = false;

        // Start timer display update
        updateTimerDisplay();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('saveDrawing').disabled = false;
        alert('Failed to start timer: ' + error.message);
    }
});

document.getElementById('stopTimer').addEventListener('click', async () => {
    try {
        document.getElementById('stopTimer').disabled = true;

        const response = await fetch(`${pythonURI}/api/competition/timer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Origin': 'client'
            },
            credentials: 'include'
        });

        const data = await response.json();
        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        if (!response.ok) {
            throw new Error(data.message || 'Failed to stop timer');
        }

        // Update UI state
        document.getElementById('startTimer').disabled = false;
        document.getElementById('timerDisplay').textContent = 'Time: 0s';
        document.getElementById('wordDisplay').textContent = 'Word: ';
        
        // Save drawing functionality - enable after successful stop
        document.getElementById('saveDrawing').disabled = false;

        // Update results table with latest data
        await fetchResults();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('stopTimer').disabled = false;
        alert(`Failed to stop timer: ${error.message}`);
    }
});

async function updateTimerDisplay() {
    timerInterval = setInterval(async () => {
        try {
            const response = await fetch(`${pythonURI}/api/competition/timer`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            document.getElementById('timerDisplay').textContent = 
                `Time: ${data.time_remaining}s`;

            if (!data.is_active) {
                clearInterval(timerInterval);
                document.getElementById('startTimer').disabled = false;
                document.getElementById('stopTimer').disabled = true;
            }

        } catch (error) {
            console.error('Error:', error);
            clearInterval(timerInterval);
        }
    }, 1000);
}

async function fetchResults() {
    try {
        const response = await fetch(`${pythonURI}/api/competition/times`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }

        const entries = await response.json();
        const tbody = document.getElementById('resultsBody');
        tbody.innerHTML = '';

        entries.forEach(entry => {
            const row = tbody.insertRow();
            row.insertCell().textContent = entry.users_name || 'Unknown'; // Changed from profile_name
            row.insertCell().textContent = entry.time_taken || '0';
            row.insertCell().textContent = entry.drawn_word || 'Unknown'; // Changed from word_drawn
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch results: ' + error.message);
    }
}

// Initial fetch of results
document.addEventListener('DOMContentLoaded', fetchResults);

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}
</script>