---
toc: true
layout: post
title: Technical Illustrations
description: Tech Illustrations for Game Hub Website
categories: [Menu]
---

# Technical Illustrations – Game Hub

This page provides technical illustrations and diagrams to explain the architecture, navigation, and UI/UX of the Game Hub project. 

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/2103bae2-2352-4134-be2c-04c78d95a338" />

---

## One-line Description:
Game Hub: An interactive web platform of student-created minigames and worlds blending biotech education with fun, casual gameplay.

---

## 1. **Overall System Architecture**

**Architecture and Functionality:**  
*System architecture of Game Hub: The frontend (static site with interactive JS and Python) communicates with the backend API for points and user data, loads assets (such as images/audio), and interacts with the user via browser events.*

<div style="text-align:center;">
<pre>
+-------------------+
|       User         |
|(Using the Browser) |
+-------------------+
|
v
+-------------------+
|     Frontend      |
|(Jekyll/Python/JS) |
+-------------------+
|         |        |
v         v        v
[Backend] [Assets] [Events]
(API for  (Images, (User
points)   Audio)   Input)
  |        |        |
  +--------+--------+
</pre>
</div>

---

## 2. **World Map Navigation**

**Navigation:**  
*Main Game Hub navigation: Users move with WASD, interact with world icons to talk with NPCS/enter themed worlds, can change their outfits to different game characters, and can access help options in world0 or the search menu.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/707f894e-538c-41ba-977b-aff7f400aec3" />

---

## 3. **World Entry & NPCs**

**Worlds/NPCs:**  
*World entry interaction: Approaching a world icon triggers an NPC modal with themed dialogue, Enter/Talk/Cancel options, and animated text for immersion.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/862ee4be-88fe-4734-af99-2e47db6fa7a2" />

---

## 4. **Skin/Cosmetic Selection**

**Skins & Cosmetics:**  
*Cosmetic selection modal: Players can choose from multiple character skins, each with a points cost, and confirm their choice for in-game appearance.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/6b0e2761-2a95-4409-8c6d-230fa6235ccc" />

---

## 5. **Points System Integration**

**Points:**  
*Points system: The frontend fetches and displays the user's total points from the backend API, updating in real time as games are played.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/69a3b290-2928-47c1-9a92-39fdecc903f8" />

---

## 6. **Worlds and Levels**

**World Pages:**  
*World layout: Each world features a unique background, minigame entry points, and navigation elements for a unified user experience. Also there is a home icon on each world to easily get back to the home page aswell as custom audio for the worlds.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/10d3ba12-707e-4945-a64c-e19a95b94b84" />

---

## 7. **Minigame Launch Flow**

**Minigame Launch:**  
*Game Launch: Movement and collision detection when moving into the sprite of the icon triggers navigation to the minigames, with points awarded via backend integration.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/de11e2fc-b9ad-4fa5-8357-dfd4c83c23e8" />

---

## 8. **Planning & Documentation**

**Planning:**  
*Project Planning: Documentation pages Our Outline, Format, and Synopsis .mdfiles guide the design and implementation of our worlds and games.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/2ac4bbb5-7e39-4566-b797-b56614715f75" />

---

## 9. **Help & Support UI**

**Help/Support:**  
*Help Center: Users can access guides and troubleshooting for navigation, adventure, cosmetics, and games via our centralized help page.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/4844c1b5-3ca8-49a2-9d81-db46c945a4a9" />

---

## 10. **Audio/Music Integration**

**Audio & Music:**  
*Audio integration: Each world, minigame and search menu page features a unique background song, triggered by users pressing any button. The music can be paused, muted, and fast forwarded making it adaptable based on the users needs.*

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/a4e8c79a-0f56-433b-9459-33d778977253" />

---

<script>
// filepath: /home/kasm-user/nighthawk/GameHub/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/40tourtokyoblur.mp3'); // Change path as needed
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
