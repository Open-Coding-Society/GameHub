---
layout: bootstrap
title: Skins Help Page
description: Main Skin Help Page
permalink: /skin_help
Author: Ian, Zach, Aarush
---

# Game Hub Skins System Overview

## How Skins Work

- **Skin Selection Modal:**  
  - The modal (`#skin-modal`) lets users pick from 6 character skins, each shown as a `.skin-option` with a preview image and point cost.
  - The modal opens when triggered (not shown in this snippet, but likely via a button or in-game event).
  - Clicking a skin highlights it (`.selected`), and clicking "Confirm" sets the chosen skin as the player's sprite.

- **Sprite Handling:**  
  - `spriteImages` is an array of URLs for each skin image.
  - `currentSpriteIndex` tracks the selected skin.
  - The player’s sprite (`spriteImage.src`) is updated when a new skin is confirmed.

- **Points System:**  
  - Each skin (except the default) displays a point cost.
  - The code fetches the user's points from an API and displays them.
  - **Note:** The current code does **not** enforce point requirements for unlocking skins; all skins are selectable regardless of points.

## Key Code Sections

- **Skin Modal HTML:**
  ```html
  <div id="skin-modal">
    <div id="skin-modal-content">
      ...
      <div id="skin-options">
        <div class="skin-option selected"> ... </div>
        <div class="skin-option"> ... </div>
        ...
      </div>
      <button id="confirm-button">Confirm</button>
    </div>
  </div>
  ```

- **Skin Images & Selection:**
  ```javascript
  const spriteImages = [
    'url1', // Default
    'url2', // Skin 2
    ...
  ];
  let currentSpriteIndex = 0;
  const spriteImage = new Image();
  spriteImage.src = spriteImages[currentSpriteIndex];
  ```

- **Skin Selection Logic:**
  ```javascript
  skinOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
      skinOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  confirmButton.addEventListener('click', () => {
    skinOptions.forEach((option, index) => {
      if (option.classList.contains('selected')) {
        confirmedSelection = index;
        currentSpriteIndex = index;
        spriteImage.src = spriteImages[currentSpriteIndex];
      }
    });
    skinModal.style.display = 'none';
    isModalOpen = false; 
  });
  ```

## Ways to Adjust or Extend the Skin System

1. **Enforce Point Requirements:**
   - Prevent users from selecting skins they can't afford.
   - Example:  
     ```javascript
     if (userPoints >= skinCost[index]) {
       // allow selection
     } else {
       // show message: "Not enough points"
     }
     ```

2. **Unlock Skins Permanently:**
   - Track which skins a user has unlocked (e.g., in localStorage or via backend).
   - Only allow selection of unlocked skins.

3. **Add More Skins:**
   - Add more entries to `spriteImages` and corresponding `.skin-option` HTML/CSS.

4. **Skin Previews:**
   - Show a larger preview or animation when hovering over a skin.

5. **Purchase/Unlock Animation:**
   - Add feedback when a skin is unlocked or purchased.

6. **Save Selection:**
   - Persist the selected skin across sessions (e.g., localStorage or backend).

7. **Dynamic Skin Loading:**
   - Fetch available skins and their data from an API for easier updates.

## Example: Enforcing Points Requirement

```javascript
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...
confirmButton.addEventListener('click', () => {
  skinOptions.forEach((option, index) => {
    if (option.classList.contains('selected')) {
      const skinCosts = [0, 200, 500, 1000, 1500, 2000];
      if (userPoints >= skinCosts[index]) {
        confirmedSelection = index;
        currentSpriteIndex = index;
        spriteImage.src = spriteImages[currentSpriteIndex];
        // Optionally deduct points and update backend
      } else {
        alert('Not enough points for this skin!');
      }
    }
  });
  skinModal.style.display = 'none';
  isModalOpen = false; 
});
// ...existing code...
```

---

**Summary:**  
The skin system is modular and easy to extend. You can add more skins, enforce unlock requirements, and persist user choices with minor code changes.

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/36wiimushroomgorge.mp3'); // Change path as needed
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