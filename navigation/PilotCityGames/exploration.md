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