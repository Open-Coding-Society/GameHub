# Game Hub – Design Process

Welcome to Game Hub!
This document outlines the journey of designing and building our game hub, focusing on the evolution of our ideas and how they shaped the final product.

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/eaaf7ae4-3a85-4045-861a-311e8c6700de" />

--- 

## One-line Description:
Game Hub: An interactive web platform of student-created minigames and worlds blending biotech education with fun, casual gameplay.

---

## 1. Initial Plan: The Outline

Our project began with a simple goal: make biotech-related engaging games. 
**Outline** was our first plan, where we brainstormed core concepts:

- **Biotech Education**: Use games to teach real-world science.
- **Data & ML Integration**: Incorporate real datasets and machine learning for authentic scenarios.
- **Adventure Structure**: Start with a single world, inspired by classic adventure games like Mario.
- **Team Roles**: Assign clear responsibilities (frontend, backend, ML, testing, project management).

We mapped out a handful of games (e.g., Outbreak, DNA Building, Blackjack) and focused on how each would teach a biotech concept.  
The first prototype was a single map which can be seen in /world10 with 6 games and 3 other experiences.

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/c97ad687-7f25-43f9-8910-2b46e38462e8" />

---

## 2. Next Plan: The Format

As the project grew, we realized the need for better organization and scalability.  
**Format** was our second plan, where we restructured the site:

- **Game Categorization**: Grouped games by type (arcade, strategy, party, etc.) for easier navigation.
- **Worlds & Levels**: Had several related games and designed about worlds that led to different games.
- **UI/UX Improvements**: Added a central hub and repurposed the games to be on different worlds rather than on one.
- **Points System**: Integrated backend points and rewards for playing games.

This phase led to the creation of /world9 which was our second map design. It grouped similar games next to each other, but had all games on one page which was not UI friendly nor easy to navigate.
We also began planning for more games, aiming for 24 total, and started to separate design from implementation.

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/10daf8b2-4dfd-4569-8c4e-d2df44d2467a" />

---

## 3. Final Plan: The Synopsis

With feedback and iteration, we moved to our **Final Plan**:  
**Synopsis** focused on polishing our website and making it scalable.

- **Eight Themed Worlds**: Each world from /world0 -> /world8 represents a category (e.g., Arcade Rush, Party Time, Combat Zone).
- **Central Hub**: The index page became the starting world with 9 different worlds - 8 being to groups of 3 with minigames and the other being other experiences.
- **Dialogue & NPCs**: Added character-driven world entry, with NPCs to interact and talk with before entering a world.
- **Cosmetics & Points**: Expanded skin selection and integrated a persistent points system.
- **Modular Design**: Each minigame in each world is in its own .md file, making it easy to navigate the worlds and minigames while programming the website.
- **Educational Focus**: 6 of the games are still related to our biotech original theme (the first 6 games), with real data and ML models where possible.

This structure allowed us to scale, maintain, and expand the site efficiently.  
The final product is a collection of interconnected worlds, each with its own theme, games, and educational goals.

<img width="1279" alt="Image" src="https://github.com/user-attachments/assets/def86fbb-4268-4dce-ac24-59a7a494e188" />

---

## Design Principles & Lessons Learned

- **Iterative Design**: Each plan built on the last, responding to user feedback and technical challenges.
- **User Experience**: Navigation, clarity, and engagement were prioritized at every stage.
- **Educational Value**: Games were chosen and designed for their ability to teach, not just entertain.
- **Team Collaboration**: Clear roles and regular planning meetings kept the project on track.

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/1ea65e63-4da7-440f-b36d-7ebcaf3d781c" />

---

## File Structure Overview

- Index.md: Central hub with navigation and NPCs.
- World0 to World8: Themed worlds, each with unique games and experiences.
- World9 and World10: Our early prototypes and "legacies" of our old maps to document our journey creating the game
- Outline, Synopsis, and Format: Our planning documents for our website.
- Music, Aboutus, Skin, and Help: Other experiences showing our credibility, how to help the user, custom music on each    level for immersive and engaging purposes, and a way to customize your profile.
- Points, Home Icons, and Other Documents: Even more ways to make your experience at Game Hub better.

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/1016de84-348c-4f02-a079-6028b1dba6c9" />

---

## Next Steps

- Continue fixing bugs to our games and worlds (will probably stop after presenting at N@TM).
- Refine our content to be more educational and useful rather than just for entertainment.
- Expand cosmetic, social, and interactive features.

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/c8cda384-13b3-4f7c-98b6-393405918194" />

---

## Credits

- **Project Manager/Scrum Master**: Ian Manangan
- **Frontend/Backend Developer**: Zach Peltz
- **ML Engineer/Data Science Lead**: Aarush Kota

<img width="1280" alt="Image" src="https://github.com/user-attachments/assets/27b1f3ae-92df-43df-8bf1-4e1c9f353c45" />


---

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/39iceiceoutpost.mp3'); // Change path as needed
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