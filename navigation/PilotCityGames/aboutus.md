---
layout: bootstrap
title: About Us
description: About the Creators 
permalink: /aboutus
Author: Pradyun
---

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