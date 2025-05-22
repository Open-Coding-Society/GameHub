---
toc: true
layout: post
title: Adventures Help Page
description: Main Adventure Help Page
categories: [Help]
---

# Platformer Biotech Game Overview

## General Structure

- **Purpose:**  
  This file sets up a Mario-style platformer game with biotech themes, including audio, UI, and game logic imports.

- **Layout:**  
  Uses a Jekyll front matter block for metadata and page configuration.

## Key Features

### 1. **Audio Assets**
- Multiple `<audio>` tags preload sound effects and background music for in-game events (jump, coin, death, etc.).
- Each audio element is referenced by a unique `id` for playback in the game logic.

### 2. **UI Elements**
- **Sidebar & Leaderboard:**  
  Empty `<div>`s for sidebar and leaderboard dropdowns, likely populated dynamically.
- **Game HUD:**  
  - Timer and coin counters.
  - Start and restart buttons (shown/hidden as needed).
  - Settings and leaderboard buttons.
- **Fun Facts:**  
  Displays a fun fact and number, updated during gameplay.
- **Footer:**  
  Placeholder for cutscene/story content.

### 3. **Game Canvas**
- The main game is rendered inside `#canvasContainer`.

### 4. **JavaScript Imports**
- Uses ES6 modules to import all game logic:
  - `GameSetup.js`: Initializes levels and assets.
  - `GameControl.js`: Main game loop and controls.
  - `SettingsControl.js`: Handles settings UI and logic.
  - `GameEnv.js`: Manages environment (e.g., resizing).
  - `Leaderboard.js`: Leaderboard logic.
  - `Cutstory.js`: Handles cutscenes/story.
  - `RandomEvent.js`: Adds random events to gameplay.

### 5. **Initialization**
- Calls initialization functions for each imported module.
- Sets up window resize handling for responsive design.

---

## Ways to Adjust or Extend This Code

1. **Add/Change Skins:**
   - If you want to add a skin system (like in your Game Hub), you’d need to:
     - Add a skin selection UI (modal or menu).
     - Store available skins and the selected skin (could use localStorage or backend).
     - Pass the selected skin to the game logic (e.g., as a sprite image for the player).
     - Update the rendering logic in your platformer engine to use the selected skin.

2. **Add More Audio:**
   - Add new `<audio>` tags for more sound effects or music.
   - Reference them in your game logic as needed.

3. **Customize UI:**
   - Add more HUD elements (e.g., health, power-ups).
   - Style the sidebar or leaderboard with CSS.

4. **Extend Game Logic:**
   - Modify or add new modules for features like achievements, new levels, or power-ups.
   - Add event listeners for new buttons or keyboard shortcuts.

5. **Fun Facts:**
   - Add more fun facts and logic to cycle through them during gameplay.

---

## Example: Adding a Skin System

You could add a skin selector button and modal, similar to your Game Hub:

```html
<!-- Add to your submenu -->
<div id="skin-settings">
  <button id="skin-button">Change Skin</button>
</div>
<div id="skin-modal" style="display:none;">
  <!-- Skin options here -->
</div>
```

```javascript
// Example JS to handle skin selection
document.getElementById('skin-button').onclick = () => {
  document.getElementById('skin-modal').style.display = 'block';
};
// On skin select/confirm, update player sprite in your game logic
```

---

**Summary:**  
This code sets up a modular, audio-rich platformer game. To add skin support, you’d need to add UI for skin selection and update the player rendering logic to use the chosen skin, similar to your Game Hub implementation.

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/35wiidksummit.mp3'); // Change path as needed
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