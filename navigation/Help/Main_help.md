---
layout: post
title: Help Page
description: Main Help Page
permalink: /help
Author: Ian, Zach, Aarush
---

<!-- Help Homepage - Styled with Bootstrap and Pilot Cities-like UI -->

<div class="container my-5">
  <h1 class="display-4 text-center mb-4">Help Center</h1>
  <p class="lead text-center mb-5">Find answers, tutorials, and contact support for your Bioverse experience.</p>

  <div class="row">
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Getting Started</h5>
          <p class="card-text">Learn how to navigate Bioverse Central through Worlds, and modify game positions.</p>
          <a href="{{site.baseurl}}/world_help" class="btn btn-primary">View Guide</a>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Game Help</h5>
          <p class="card-text">Guides and Overview of different games inside of Game Hub and changes that can be implemented.</p>
          <a href="{{site.baseurl}}/help/gameplay-faq" class="btn btn-primary">View FAQ</a>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Skins</h5>
          <p class="card-text">Customize, add new skins, and an overview of skin selection</p>
          <a href="{{site.baseurl}}/help/technical" class="btn btn-primary">Troubleshoot</a>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/toadharbor.mp3'); // Change path as needed
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