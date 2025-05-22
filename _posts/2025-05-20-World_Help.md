---
toc: true
layout: post
title: Worlds Help Page
description: Main World Help Page
permalink: /world_help
categories: [Help]
Author: Ian, Zach, Aarush
---

# 🧠 High-Level Overview

**Layout / Style:**  
The page is built using Jekyll (`layout: post`) and heavily styled with CSS for a dark, immersive, game-like look. A canvas is used for the player and world rendering, and other HTML elements support UI (e.g., point display, modals).

---

## Core Features

- Character movement (WASD)
- Game world rendered via `<canvas>`
- Game "icons" act as portals to minigames
- A Skin Selection Modal opens when the player collides with a designated area

---

# 🌍 How the World System Works

### 1. Canvas + Player

A `<canvas>` element (`#gameCanvas`) draws:

- The background image (`worldbackground0.png`)
- The player character (`spriteImage`) based on selected skin
- Various interactive objects (icons for games)

The player is a JS object with position and speed. Movement is controlled via WASD keys.


```python
const player = {
  x: 490,
  y: 570,
  width: 75,
  height: 75,
  speed: 4
};
```

## 2. Game Objects

Defined in an array `objects`, where each has `x`, `y`, and `game` key (e.g., `'skin'`, `'aboutus'`, etc.).

When the player touches an object, an action is triggered (e.g., go to a game route like `/blackjack`).

## 3. Collision Detection

`isColliding(player, obj)` is used to determine interaction.

If player collides with a game object, it triggers a redirect:


```python
window.location.href = '{{site.baseurl}}/blackjack';
```

# 🎮 Moving / Adding / Adjusting Games

### ✅ To Add a Game:
Add a new entry in the `objects` array with:

- `x`, `y`, `width`, `height`
- `game: 'yourgamename'`

Add a matching image in the `objectImages` map:


```python
objectImages.yourgamename = '{{site.baseurl}}/images/iconNEW.png';
```

## In the update() function's collision switch, add:


```python
case 'yourgamename':
  window.location.href = '{{site.baseurl}}/yourgamename';
  break;
```

## 📦 To Move an Icon:
Just update the x and y of the desired object:


```python
{ x: 820, y: 660, width: 40, height: 40, game: 'format' }
```

## 🎨 To Change a Game's Icon Image:
Update its entry in objectImages:


```python
objectImages.format = '{{site.baseurl}}/images/newIcon.png';
```

# 👕 Skin System

- When you touch the top-right box (`topRightBox`), the modal opens to select a skin.
- Skins are clickable `.skin-option` divs with backgrounds.
- Confirming a skin updates `currentSpriteIndex` to change the player’s sprite image.

### To add more skins:

- Add a new `.skin-option` div with an appropriate background-image.
- Push its URL into the `spriteImages` array.
- Handle logic in JS (if needed) to update `currentSpriteIndex`.

---

# 🔧 Ways to Adjust the System

| Task                     | What to Modify                                |
|--------------------------|----------------------------------------------|
| 🎮 Add a game            | Add to `objects`, `objectImages`, `update()` redirect |
| 📍 Move a game icon      | Change `x`/`y` in `objects`                   |
| 🖼️ Change game icon     | Update image URL in `objectImages`            |
| 🧍‍♂️ Change player start position | Modify `player.x` and `player.y`            |
| 👕 Add skins             | Update `.skin-option`, `spriteImages[]`       |
| 🎵 Change music          | Replace `EARFQUAKE.mp3` path                    |
| ⛔ Add walls/boundaries  | Add entries to `walls` array                    |
| 🎨 Change background     | Replace `worldbackground0.png`                  |

---

# 💡 Ideas for Expansion

- Add animated NPCs or story characters.
- Use `localStorage` to save selected skin. (Optional)
- Add a points/rewards system for unlocking new games. (Optional)
- Use a minimap to navigate a larger world.
- Make worlds scrollable or paginated if too many icons.

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/34gbaskygarden.mp3'); // Change path as needed
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