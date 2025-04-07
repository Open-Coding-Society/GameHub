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