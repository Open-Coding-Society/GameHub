---
layout: bootstrap
title: About Us
description: About the Creators 
permalink: /aboutus
Author: Zach
---

## Welcome to Game Hub About Page 

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    }

    body {
        background: linear-gradient(145deg, #727D73, #AAB99A, #D0DDD0, #F0F0D7);
        color: #333;
        line-height: 1.6;
        text-align: center;
    }

    .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 20px;
    }

    header {
        background: #4CAF50;
        color: #fff;
        padding: 10px 0;
    }

    header h1 {
        font-size: 2.5em;
        color: #000; 
    }

    .about-section {
        margin: 30px 0;
        text-align: justify;
    }

    .about-section h2 {
        font-size: 2em;
        margin-bottom: 10px;
        color: #4CAF50;
        text-align: center;
    }

    .container h2 {
        color: #000; 
    }

    .devs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .dev-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 20px;
        text-align: center;
        width: 180px;
        transition: transform 0.3s ease;
    }

    .dev-card:hover {
        transform: scale(1.05);
    }

    .dev-card img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
    }

    .dev-card h3 {
        font-size: 1.2em;
        color: #333;
    }

    .footer-text {
        margin-top: 30px;
        background: #333;
        color: #fff;
        padding: 10px 0;
        text-align: center;
    }

    .footer-text a {
        color: #4CAF50;
        text-decoration: none;
    }

</style>

<div class="container">
    <h2>Meet the Developers</h2>
    <div class="devs">
        <div class="dev-card">
            <h3>Ian Manangan</h3>
            <p>Project Manager, Scrum Master, and Testing</p>
        </div>
        <div class="dev-card">
            <h3>Zach Peltz</h3>
            <p>Frontend and Backend Developer</p>
        </div>
        <div class="dev-card">
            <h3>Aarush Kota</h3>
            <p>ML Engineer and Data Science Lead</p>
        </div>
    </div>
</div>

<div class="footer-text">
    <p>&copy; 2025 Game Hub Minigames. Designed and developed by <a href="#">Ian, Zach, and Aarush</a>.</p>
</div>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/30dolphinshoals.mp3'); // Change path as needed
music.loop = true;
music.volume = 0.5;

// Play music after first user interaction (required by browsers)
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>