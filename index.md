---
layout: post
title: Home
description: Home Page
Author: Everyone
---

<table>
    <tr>
        <td><a href="{{site.baseurl}}/home">Home</a></td>
        <td><a href="{{site.baseurl}}/blackjack">BlackJack</a></td>
        <td><a href="{{site.baseurl}}/building">Building</a></td>
        <td><a href="{{site.baseurl}}/editing">Editing</a></td>
        <td><a href="{{site.baseurl}}/exploration">Exploration</a></td>
        <td><a href="{{site.baseurl}}/outbreak">Outbreak</a></td>
        <td><a href="{{site.baseurl}}/aboutus">AboutUs</a></td>
    </tr>
</table>

<style>
    :root {
        --primary-color: #1a237e;
        --secondary-color: #283593;
        --background: linear-gradient(145deg, #727D73, #AAB99A, #D0DDD0, #F0F0D7, rgb(114, 125, 115), rgb(170, 185, 154), rgb(208, 221, 208), rgb(240, 240, 215));
        --text-color: black;
        --card-bg: rgba(30, 41, 59, 0.8);
        --error: #e74c3c;
        --success: #2ecc71;
    }

    body {
        background: var(--background);
        color: var(--text-color);
        min-height: 100vh;
    }

    table {
        width: 100%;
        margin-bottom: 2rem;
        border-collapse: collapse;
        background: rgba(30, 41, 59, 0.5);
        border-radius: 8px;
    }

    table td {
        padding: 0.5rem;
        text-align: center;
    }

    table a {
        color: #93c5fd;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    table a:hover {
        color: #60a5fa;
    }

    .content h1, .content p {
        color: black; 
    }

    header h1, header p {
        color: black; 
    }
</style>

<div class="content">
    <h1>Welcome to Genome Gamers</h1>
    <p>Explore our exciting games and features through the navigation links above.</p>
</div>