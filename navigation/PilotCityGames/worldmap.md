---
layout: post
title: World Map
description: WorldMap
Author: Pradjun
permalink: /worldmap
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

<div class="statistics-container">
    <style>
        :root {
            --primary-color: #1a237e;
            --secondary-color: #283593;
            --background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            --text-color: #2c3e50;
            --card-bg: #ffffff;
            --error: #e74c3c;
            --success: #2ecc71;
        }
        body {
            background: var(--background);
            margin: 0;
            min-height: 100vh;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text-color);
        }
        .statistics-container {
            max-width: 1000px;
            margin: 3rem auto;
            padding: 2rem;
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        }
        .statistics-header h1 {
            font-size: 2.8rem;
            text-align: center;
            margin-bottom: 40px;
            color: #ffcc00;
        }
        .stats-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px;
            margin-top: 2rem;
        }
        .stats-table th {
            background: var(--primary-color);
            color: white;
            padding: 16px;
            text-align: left;
            cursor: pointer;
        }
        .stats-table td {
            background: var(--card-bg);
            padding: 16px;
            color: var(--text-color);
        }
        .delete-btn {
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
        #message {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            display: none;
        }
    </style>
    <div class="statistics-header">
        <h1>🎮 Game Statistics 🎯</h1>
    </div>
    <table class="stats-table">
        <thead>
            <tr>
                <th onclick="sortTable(0)">Username</th>
                <th onclick="sortTable(1)">Correct Guesses</th>
                <th onclick="sortTable(2)">Wrong Guesses</th>
                <th onclick="sortTable(3)">Total Rounds</th>
                <th onclick="sortTable(4)">Win Rate</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="stats-body"></tbody>
    </table>
    <div id="message"></div>
</div>

<script>
    const LOCAL_API_URL = 'http://localhost:8203/api';
    const DEPLOYED_API_URL = 'https://scribble_backend.stu.nighthawkcodingsociety.com/api';
    const API_URL = window.location.hostname === 'localhost' ? LOCAL_API_URL : DEPLOYED_API_URL;

    async function checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            showMessage('Please login first', 'error');
            return false;
        }
        return true;
    }

    async function fetchStatistics() {
        if (!await checkAuth()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/statistics/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch statistics');
            const data = await response.json();
            updateTable(data.data || []);
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error loading statistics', 'error');
        }
    }

    function updateTable(data) {
        const tbody = document.getElementById('stats-body');
        tbody.innerHTML = '';
        data.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.correct_guesses}</td>
                    <td>${user.wrong_guesses}</td>
                    <td>${user.total_rounds}</td>
                    <td>${user.win_rate}%</td>
                    <td>
                        <button onclick="deleteStats('${user.username}')" class="delete-btn">Delete</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    async function deleteStats(username) {
        if (!await checkAuth()) return;
        if (!confirm(`Are you sure you want to delete stats for ${username}?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/statistics`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: username })
            });

            if (!response.ok) throw new Error('Failed to delete statistics');
            showMessage(`Deleted stats for ${username}`, 'success');
            await fetchStatistics();
        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message, 'error');
        }
    }

    function showMessage(message, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        messageEl.style.backgroundColor = type === 'error' ? '#727D73' : '#D0DDD0';
        messageEl.style.color = type === 'error' ? '#AAB99A' : '#F0F0D7';
        setTimeout(() => messageEl.style.display = 'none', 3000);
    }

    function sortTable(n) {
        const table = document.querySelector('.stats-table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const isNumeric = n > 0 && n < 5;

        rows.sort((a, b) => {
            let aVal = a.cells[n].textContent;
            let bVal = b.cells[n].textContent;

            if (isNumeric) {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }

            return aVal > bVal ? 1 : -1;
        });

        const tbody = table.querySelector('tbody');
        rows.forEach(row => tbody.appendChild(row));
    }

    // Initialize
    if (checkAuth()) {
        fetchStatistics();
    }

    // Add functions to window scope
    window.deleteStats = deleteStats;
    window.sortTable = sortTable;
</script>