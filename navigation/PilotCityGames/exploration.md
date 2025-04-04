---
layout: post
title: Exploration
description: Exploration
Author: Darsh
permalink: /exploration
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
    --background: linear-gradient(145deg, #A6AEBF, #C5D3E8, #D0E8C5, #FFF8DE, rgb(166, 174, 191), rgb(197, 211, 232), rgb(208, 232, 197), rgb(255, 248, 222));
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
}

.score-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.speed-info {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    margin-top: 0.5rem;
}

.speed-info ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.submit-btn {
    background: #2196F3;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background: #1976D2;
}

.word-section {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
    overflow: hidden;
}

.word-title {
    background: #f8f9fa;
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid #eee;
    font-size: 1.25rem;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.admin-badge {
    background: #dc3545;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.leaderboard-table th {
    font-weight: bold;
    color: #666;
    background: #f8f9fa;
}

.score-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
}

.score-high {
    background: #4CAF50;
    color: white;
}

.score-medium {
    background: #FFC107;
    color: black;
}

.score-low {
    background: #FF5722;
    color: white;
}

.speed-badge {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    background: rgba(255,255,255,0.2);
}

.delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.delete-btn:hover {
    background: #c82333;
}

.message {
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    display: none;
    transition: opacity 0.3s;
}

.success {
    background: #d4edda;
    color: #155724;
}

.error {
    background: #f8d7da;
    color: #721c24;
}
</style>

<div class="container">
    <form class="score-form" id="score-form">
        <h2>Submit Drawing Score</h2>
        <div class="form-group">
            <label for="drawingName">Drawing Name:</label>
            <input type="text" id="drawingName" required>
        </div>
        <div class="form-group">
            <label for="score">Manual Score (0-1000, optional):</label>
            <input type="number" id="score" min="0" max="1000">
            <div class="speed-info">
                <strong>Speed-Based Scoring System:</strong>
                <ul>
                    <li>2x speed (half the time) = 1000 points</li>
                    <li>1x speed (normal time) = 500 points</li>
                    <li>0.5x speed (double time) = 250 points</li>
                </ul>
                <small>Leave blank to use automatic speed-based scoring from your competition time</small>
            </div>
        </div>
        <button type="submit" class="submit-btn">Submit Score</button>
        <div id="message" class="message"></div>
    </form>

    <div id="leaderboard-sections"></div>
</div>

<script type="module">
import { pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';

let isAdmin = false;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${pythonURI}/api/user`, {
            credentials: 'include'
        });
        const userData = await response.json();
        isAdmin = userData.role === 'Admin';
        fetchLeaderboard();
    } catch (error) {
        console.error('Error checking admin status:', error);
        showMessage('Error loading user data', 'error');
    }
});

async function fetchLeaderboard() {
    try {
        const response = await fetch(`${pythonURI}/api/leaderboard`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch leaderboard data');
        
        const data = await response.json();
        const container = document.getElementById('leaderboard-sections');
        container.innerHTML = '';

        Object.entries(data).forEach(([word, entries]) => {
            container.appendChild(createWordSection(word, entries));
        });
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

function getScoreClass(score) {
    if (score >= 750) return 'score-high';
    if (score >= 500) return 'score-medium';
    return 'score-low';
}

function getSpeedFactor(score) {
    return (score / 500).toFixed(1);
}

function createWordSection(word, entries) {
    const section = document.createElement('div');
    section.className = 'word-section';
    
    section.innerHTML = `
        <h3 class="word-title">
            Drawing: ${word}
            ${isAdmin ? '<span class="admin-badge">Admin Mode</span>' : ''}
        </h3>
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                    ${isAdmin ? '<th>Actions</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${entries.map((entry, index) => `
                    <tr>
                        <td>#${index + 1}</td>
                        <td>${entry.profile_name}</td>
                        <td>
                            <div class="score-indicator ${getScoreClass(entry.score)}">
                                ${entry.score}
                                <span class="speed-badge">${getSpeedFactor(entry.score)}x speed</span>
                            </div>
                        </td>
                        ${isAdmin ? `
                            <td>
                                <button class="delete-btn" onclick="deleteEntry(${entry.id})">
                                    Delete
                                </button>
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    return section;
}

document.getElementById('score-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const drawingName = document.getElementById('drawingName').value.trim();
    const score = document.getElementById('score').value;
    
    try {
        const body = { drawing_name: drawingName };
        if (score) {
            const scoreNum = parseInt(score);
            if (scoreNum < 0 || scoreNum > 1000) {
                showMessage('Score must be between 0 and 1000', 'error');
                return;
            }
            body.score = scoreNum;
        }

        const response = await fetch(`${pythonURI}/api/leaderboard`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        showMessage('Score submitted successfully!', 'success');
        this.reset();
        await fetchLeaderboard();
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
});

window.deleteEntry = async function(id) {
    if (!isAdmin) {
        showMessage('Admin access required', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
        const response = await fetch(`${pythonURI}/api/leaderboard`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        showMessage('Entry deleted successfully', 'success');
        await fetchLeaderboard();
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
};

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.style.display = 'none';
            messageEl.style.opacity = '1';
        }, 300);
    }, 3000);
}
</script>