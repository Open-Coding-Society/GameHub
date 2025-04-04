---
layout: post
title: BlackJack
description: BlackJack
Author: Zach
permalink: /blackjack
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
    --background: linear-gradient(145deg, #A6AEBF, #C5D3E8, #D0E8C5, #FFF8DE);
}

body {
    background: var(--background);
    min-height: 100vh;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.canvas-container {
    text-align: center;
    margin-bottom: 2rem;
}

.canvas {
    border: 2px solid #ccc;
    background-color: #fafafa;
    cursor: crosshair;
}

.tool-panel {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.tool-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: #2196F3;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.tool-btn:hover {
    background: #1976D2;
}

.color-picker {
    margin-top: 1rem;
}

.image-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.image-modal img {
    max-width: 80%;
    max-height: 80%;
    border: 5px solid white;
    border-radius: 8px;
}

</style>

<div class="container">
    <h2>Blind Trace Drawing Game</h2>
    <div id="image-display-container" class="canvas-container">
        <img id="reference-image" src="" alt="Reference Image" class="canvas">
        <button id="start-game-btn" class="tool-btn">Start Game</button>
    </div>
    <div id="canvas-section" class="canvas-container" style="display: none;">
        <canvas id="drawing-canvas" class="canvas"></canvas>
        <div class="tool-panel">
            <button id="clear-btn" class="tool-btn">Clear Canvas</button>
            <button id="reset-btn" class="tool-btn">Reset Drawing</button>
            <button id="view-btn" class="tool-btn">View Image</button>
        </div>
    </div>
    <div class="color-picker">
        <label>Select Color:</label>
        <input type="color" id="color-picker" value="#000000">
    </div>
    <div class="tool-panel">
        <button id="eraser-btn" class="tool-btn">Eraser</button>
        <button id="submit-btn" class="tool-btn">Submit Drawing</button>
    </div>
    <div id="score-container">
        <p id="score">Score: 0</p>
    </div>
    <div id="message" class="message"></div>
    <div id="submissions-container"></div>
</div>

<div class="container mt-4">
    <h2>Past Blind Trace Submissions</h2>
    <table id="blindTraceTable" class="table table-striped">
        <thead>
            <tr>
                <th>User</th>
                <th>Score</th>
                <th>Drawing</th>
                <th>Submission Time</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody> 
    </table>
</div>

<style>
:root {
    --background: linear-gradient(145deg, #A6AEBF, #C5D3E8, #D0E8C5, #FFF8DE);
}

body {
    background: var(--background);
    min-height: 100vh;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
}

.tool-panel {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.tool-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: #2196F3;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.tool-btn:hover {
    background: #1976D2;
}

.color-picker {
    margin-top: 1rem;
}
</style>

<div class="container">
    <h2>Blind Trace Drawing Game</h2>
    <div id="image-display-container" class="canvas-container">
        <img id="reference-image" src="" alt="Reference Image" class="canvas hidden">
        <button id="start-game-btn" class="tool-btn">Start Game</button>
        <p id="view-count">View Image: 3 left</p>
    </div>
    <div id="canvas-section" class="canvas-container" style="display: none;">
        <canvas id="drawing-canvas" class="canvas"></canvas>
        <div class="tool-panel">
            <button id="clear-btn" class="tool-btn">Clear Canvas</button>
            <button id="reset-btn" class="tool-btn">Reset Drawing</button>
            <button id="view-btn" class="tool-btn">View Image</button>
        </div>
    </div>
    <div class="color-picker">
        <label>Select Color:</label>
        <input type="color" id="color-picker" value="#000000">
    </div>
    <div class="tool-panel">
        <button id="eraser-btn" class="tool-btn">Eraser</button>
        <button id="submit-btn" class="tool-btn">Submit Drawing</button>
    </div>
    <div id="score-container">
        <p id="score">Score: 0</p>
    </div>
    <div id="message" class="message"></div>
    <div id="submissions-container"></div>
</div>

<script>
const pythonURI = "https://scribble.stu.nighthawkcodingsociety.com"; 

let viewCount = 3;
let startTime;

// Initialize canvas
const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
canvas.width = 400;
canvas.height = 400;

document.addEventListener('DOMContentLoaded', () => {
    loadReferenceImage();
    loadPastSubmissions();
});

// Load a random reference image
function loadReferenceImage() {
    const imageElement = document.getElementById("reference-image");
    const imageList = [
       "images/Bridge.jpg",
        "images/car.png",
        "images/colloseum.jpg",
        "images/french.jpg",
        "images/House.png",
        "images.school_logo.png",
        "images/stonehenge.jpg",
        "images/taj_mahal.jpg",
        "images.tower.jpg"
    ];
    imageElement.src = imageList[Math.floor(Math.random() * imageList.length)];
}

// Start game
document.getElementById("start-game-btn").addEventListener("click", function () {
    document.getElementById("image-display-container").style.display = "none";
    document.getElementById("canvas-section").style.display = "block";
    startTime = Date.now();
});

// View reference image with limit
document.getElementById("view-btn").addEventListener("click", function () {
    if (viewCount > 0) {
        document.getElementById("reference-image").classList.toggle("hidden");
        viewCount--;
        document.getElementById("view-count").innerText = `View Image: ${viewCount} left`;
    } else {
        alert("No more views left!");
    }
});

// Drawing functionality
canvas.addEventListener("mousedown", () => { isDrawing = true; });
canvas.addEventListener("mouseup", () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!isDrawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("color-picker").value;

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// Eraser functionality
document.getElementById("eraser-btn").addEventListener("click", () => {
    ctx.strokeStyle = "#ffffff";  // White for erasing
});

// Clear and Reset
document.getElementById("clear-btn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("reset-btn").addEventListener("click", () => {
    loadReferenceImage();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Submit drawing with random score
document.getElementById("submit-btn").addEventListener("click", async function () {
    const drawingDataURL = canvas.toDataURL("image/png");
    const timeSpent = (Date.now() - startTime) / 1000;  // Time spent in seconds
    const score = Math.floor(Math.max(0, 100 - timeSpent * 2)); // Decreases score over time

    document.getElementById("score").innerText = `Score: ${score}`;

    const submissionData = {
        username: localStorage.getItem("username") || "Guest",
        drawing: drawingDataURL,
        score: score
    };

    try {
        const response = await fetch(`${pythonURI}/api/submission`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
            body: JSON.stringify(submissionData)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Submission successful!");
            loadPastSubmissions();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert("Failed to submit drawing.");
    }
});

// Load past submissions
async function loadPastSubmissions() {
    try {
        const response = await fetch(`${pythonURI}/api/submission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            displayPastSubmissions(result.submissions);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert("Failed to load past submissions.");
    }
}

// Display past submissions
function displayPastSubmissions(submissions) {
    const tableBody = document.querySelector('#blindTraceTable tbody');
    tableBody.innerHTML = '';

    submissions.forEach(submission => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${submission.username}</td>
            <td>${submission.score}</td>
            <td>
                <a href="${submission.drawing_url}" target="_blank">
                    <img src="${submission.drawing_url}" alt="Drawing" width="50">
                </a>
            </td>
            <td>${new Date(submission.submission_time).toLocaleString()}</td>
            <td>
                <button class="btn btn-danger delete-btn" data-id="${submission.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete a submission
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const id = event.target.getAttribute("data-id");

        if (!confirm("Are you sure you want to delete this submission?")) return;

        fetch(`${pythonURI}/api/submission`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || "Deleted successfully");
            loadPastSubmissions();
        })
        .catch(() => alert("Failed to delete submission."));
    }
});
</script>
