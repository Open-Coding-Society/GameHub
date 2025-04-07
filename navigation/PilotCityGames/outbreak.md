---
layout: post
title: Outbreak
description: Outbreak
Author: Lars
permalink: /outbreak
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
        --primary-color: #1a237e;
        --secondary-color: #283593;
        --background: linear-gradient(145deg, #789DBC, #FFE3E3, #FEF9F2, #C9E9D2, rgb(120, 157, 188), rgb(255, 227, 227), rgb(254, 249, 242), rgb(201, 233, 210));
        --text-color: #e1e1e1;
        --card-bg: rgba(30, 41, 59, 0.8);
        --error: #e74c3c;
        --success: #2ecc71;
    }

    body {
        background: var(--background);
        min-height: 100vh;
        margin: 0;
        padding: 0;
    }

    .picture-gallery {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
        background: white;
    }

    .upload-form {
        background-color: var(--card-bg);
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
    }

    .form-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-color);
    }

    .submit-btn {
        background-color: var(--primary-color);
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .submit-btn:hover {
        background-color: var(--secondary-color);
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        padding: 1rem 0;
    }

    .picture-card {
        background-color: var(--card-bg);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s;
        max-width: 300px;
        margin: 0 auto;
    }

    .picture-img {
        width: 100%;
        height: 160px;
        object-fit: contain;
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
    }

    .picture-info {
        padding: 1rem;
        color: var(--text-color);
    }

    .picture-info h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text-color);
    }

    .picture-info p {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        color: rgba(225, 225, 225, 0.8);
    }

    .delete-btn {
        background-color: var(--error);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.3s;
    }

    .delete-btn:hover {
        opacity: 0.9;
    }

    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        animation: fadeIn 0.3s ease-in;
        z-index: 1000;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>