---
layout: post
title: Editing
description: Editing
Author: Aarush
permalink: /editing
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
    body {
        background: linear-gradient(145deg, #F7CFD8, #F4F8D3, #A6F1E0, #73C7C7);
    }
    .game-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
    .hint-section {
        margin: 20px 0;
        padding: 15px;
        background: #34495E;
        border-radius: 8px;
    }
    .input-field {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #34495E;
        width: 200px;
    }
    .button {
        padding: 8px 20px;
        background: #3498DB;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
    }
    .button:hover {
        background: #2980B9;
    }
    .stats-container {
        margin-top: 20px;
        padding: 20px;
        background: #34495E;
        border-radius: 10px;
        color: white;
    }
    #guess-canvas {
        border: 2px solid #34495E;
        border-radius: 8px;
        margin-bottom: 20px;
    }
</style>

<div class="game-container">
    <h2>Picture Guessing Game</h2>
    <div id="image-container">
        <canvas id="guess-canvas" width="400" height="400"></canvas>
    </div>
    <div class="hint-section">
        <h3>Hints:</h3>
        <div id="hint-list"></div>
        <button class="button" id="hint-button">Get Next Hint</button>
    </div>
    <button id="reset-button" class="button">Reset</button>
    <form id="guess-form">
        <input type="text" id="guess-input" class="input-field" placeholder="Enter your guess" required>
        <button type="submit" class="button">Submit Guess</button>
    </form>
    <p id="message-container"></p>
    <div class="stats-container">
        <h3>Past Guesses</h3>
        <table id="stats-table" border="1">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Your Guess</th>
                    <th>Correct?</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="stats-body">
                <tr><td colspan="4">Loading stats...</td></tr>
            </tbody>
        </table>
    </div>
</div>
<script type="module">
import { pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';
let isAdmin = false;
const token = localStorage.getItem("token");
const canvas = document.getElementById("guess-canvas");
const ctx = canvas.getContext("2d");
const images = [
    {
        label: "car",
        drawing: function(ctx) {
            ctx.fillStyle = "#3498db";
            ctx.fillRect(100, 150, 200, 50);
            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            ctx.arc(130, 200, 20, 0, Math.PI * 2);
            ctx.arc(270, 200, 20, 0, Math.PI * 2);
            ctx.fill();
        },
        hints: ["It has wheels", "Used for transportation", "Has engine"]
    },
    {
        label: "house",
        drawing: function(ctx) {
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(100, 100, 200, 150);
            ctx.fillStyle = "#f39c12";
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.lineTo(200, 50);
            ctx.lineTo(300, 100);
            ctx.fill();
        },
        hints: ["People live in it", "Has a roof", "Home"]
    },
    {
        label: "sun",
        drawing: function(ctx) {
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.arc(200, 200, 50, 0, Math.PI * 2); // Sun
            ctx.fill();
        },
        hints: ["It's bright", "Appears during the day", "Star of our solar system"]
    },
    {
        label: "tree",
        drawing: function(ctx) {
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(175, 180, 50, 100); // Trunk
            ctx.fillStyle = "#228B22";
            ctx.beginPath();
            ctx.arc(200, 150, 50, 0, Math.PI * 2); // Leaves
            ctx.fill();
        },
        hints: ["It has leaves", "Found in forests", "Grows tall"]
    }
];
let currentImageIndex = 0;
let currentHintIndex = 0;
function loadNewImage() {
    console.log("Loading new image...");
    const image = images[currentImageIndex];
// Clear the previous canvas drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
// Draw the current image on the canvas using its drawing function
    image.drawing(ctx);
// Reset hints
    currentHintIndex = 0;
    document.getElementById("hint-button").disabled = false;
}
document.getElementById("reset-button").addEventListener("click", () => {
    // Select a random image
    currentImageIndex = Math.floor(Math.random() * images.length);
    loadNewImage();
});
document.getElementById("hint-button").addEventListener("click", () => {
    const hintList = document.getElementById("hint-list");
    const image = images[currentImageIndex];
// Show next hint
    if (currentHintIndex < image.hints.length) {
        const hint = document.createElement("p");
        hint.textContent = image.hints[currentHintIndex];
        hintList.appendChild(hint);
        currentHintIndex++;
    } else {
        // Disable hint button if no more hints
        alert("No more hints available!");
        document.getElementById("hint-button").disabled = true;
    }
});
async function submitGuess(event) {
    event.preventDefault();
    const guessInput = document.getElementById("guess-input").value.trim();
    const correctWord = images[currentImageIndex].label;
    if (!guessInput) {
        alert("Enter your guess.");
        return;
    }
    const payload = {
        user_guess: guessInput,
        correct_word: correctWord
    };
    try {
        const response = await fetch(`${pythonURI}/api/guess`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (response.ok) {
            alert("Guess submitted successfully!");
            document.getElementById("guess-input").value = "";
            loadStats();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error submitting guess:", error);
        alert("Something went wrong.");
    }
}
async function loadStats() {
    try {
        const response = await fetch(`${pythonURI}/api/guess`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        const statsContainer = document.getElementById("stats-body");
        if (!response.ok) {
            console.error("Error loading stats:", result.error);
            statsContainer.innerHTML = "<tr><td colspan='4'>Failed to load stats</td></tr>";
            return;
        }
        statsContainer.innerHTML = "";
        if (result.recent_guesses.length === 0) {
            statsContainer.innerHTML = "<tr><td colspan='4'>No guesses found.</td></tr>";
            return;
        }
        result.recent_guesses.forEach((guess) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${guess.guesser_name}</td>
                <td>${guess.guess}</td>
                <td>${guess.is_correct ? "✅ Correct" : "❌ Incorrect"}</td>
                <td>
                    <button class="button" onclick="updateGuess('${guess.id}', '${guess.guess}', '${guess.correct_answer}')">Update</button>
                    <button class="button" onclick="deleteGuess('${guess.id}')">Delete</button>
                </td>
            `;
            statsContainer.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading stats:", error);
        document.getElementById("stats-body").innerHTML = "<tr><td colspan='4'>Error loading stats</td></tr>";
    }
}
async function updateGuess(id, oldGuess, correctWord) {
    const newGuess = prompt("Enter the updated guess:", oldGuess);
    if (!newGuess) return;
    try {
        const response = await fetch(`${pythonURI}/api/guess`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id,
                user_guess: newGuess,
                correct_word: correctWord
            })
        });
        if (response.ok) {
            alert("Guess updated successfully!");
            loadStats();
        } else {
            alert("Failed to update guess.");
        }
    } catch (error) {
        console.error("Error updating guess:", error);
        alert("Something went wrong while updating.");
    }
}
async function deleteGuess(id) {
    if (!confirm("Are you sure you want to delete this guess?")) return;
    try {
        const response = await fetch(`${pythonURI}/api/guess`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id: id })
        });
        if (response.ok) {
            alert("Guess deleted successfully!");
            loadStats();
        } else {
            alert("Failed to delete guess.");
        }
    } catch (error) {
        console.error("Error deleting guess:", error);
        alert("Something went wrong while deleting.");
    }
}
document.getElementById("guess-form").addEventListener("submit", submitGuess);
// Initialize first image
loadNewImage();
loadStats();
</script>
