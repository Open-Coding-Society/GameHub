---
layout: bootstrap
title: Help Center
description: Find answers, tutorials, and contact support for your Bioverse experience.
permalink: /help
Author: Ian, Zach, Aarush
---

<!-- Help Homepage - Styled with Bootstrap and Pilot Cities-like UI -->

<div class="text-center" style="margin-left: 375px;">
  <div class="row">
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Getting Started</h5>
          <p class="card-text">Learn how to navigate Bioverse Central through worlds, and modify game positions.</p>
          <a href="{{site.baseurl}}/world_help" class="btn btn-primary">View Guide</a>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Adventure Help</h5>
          <p class="card-text">Adventure Platformer Game overview, guides, and possible ideations to make.</p>
          <a href="{{site.baseurl}}/adventure_help" class="btn btn-primary">View Guide</a>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Skin Help</h5>
          <p class="card-text">Skin overview, guides, help, and possible ideations to make.</p>
          <a href="{{site.baseurl}}/skin_help" class="btn btn-primary">View Guide</a>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Game Help</h5>
          <p class="card-text">Stuck on figuring out how a portion of a game works? Learn more about how each game works here!</p>
          <a href="{{site.baseurl}}/game_help" class="btn btn-primary">Troubleshoot</a>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md

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