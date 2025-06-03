# Introduction

Genome Gamers Frontend is a project designed to support students in their Computer Science and Software Engineering education. It combines educational resources like tech talks, code examples, and blogs with an interactive **Game Hub** that gamifies learning through engaging minigames.

The **Game Hub** serves as the central platform where players can explore different worlds, interact with NPCs, and access a variety of games. Players navigate the hub using WASD controls, customize their character's appearance, and earn points by completing challenges. Each world offers unique experiences, ranging from DNA editing and tower defense to arcade classics and strategy games, all designed to enhance STEM learning in a fun and interactive way.

GitHub Pages can be customized by the blogger to support computer science learnings as the student works through the pathway of using JavaScript, Python/Flask, Java/Spring.

## Key Features

### Common Features Across the Site

1. **Interactive Minigames**:
   - A variety of games such as platformers, tower defense, blackjack, farming simulators, and more.
   - Games are built using JavaScript and HTML5 Canvas for dynamic rendering.
   - Background music integration for immersive gameplay.
   - Drag-and-drop mechanics for games like DNA editing and farming.
   - Real-time scoring and leaderboard systems.

2. **Gamification of Learning**:
   - Points system integrated with backend APIs to reward users for completing tasks or achieving milestones in games.
   - Educational themes such as biology (DNA editing, cell exploration), data science, and machine learning.

3. **Responsive Design**:
   - All pages and games are optimized for desktop and mobile devices.
   - CSS animations and transitions for smooth user interactions.

4. **Audio Integration**:
   - Background music and sound effects are included in most games.
   - Audio files are preloaded for seamless playback.

5. **Reusable Components**:
   - Modular JavaScript files for shared functionality across games (e.g., game loops, collision detection, scoring systems).
   - Shared CSS styles for consistent design.

6. **API Integration**:
   - Backend API endpoints for updating user points and fetching leaderboard data.
   - Fetch-based asynchronous calls for real-time updates.

7. **Educational Content**:
   - Fun facts and educational tidbits displayed during gameplay.
   - Themes tied to STEM topics such as biology, chemistry, and computer science.

8. **Customizable Settings**:
   - Difficulty levels for games (e.g., Easy, Medium, Hard).
   - Adjustable parameters like speed, jump height, and spawn rates.

9. **Leaderboard System**:
   - Persistent leaderboard for tracking top scores across games.
   - Integration with backend APIs for storing and retrieving leaderboard data.

10. **Modular Design**:
    - Each game is encapsulated in its own file structure for easy maintenance and updates.
    - Shared assets like images, audio files, and scripts are stored in centralized directories.

---

## Technical Design Overview

### Architecture Diagram

The technical design of Genome Gamers follows a modular architecture that integrates the front-end, backend, and deployment pipelines. Below is a high-level overview of the architecture:

- **Frontend**: Built using HTML, CSS, and JavaScript, leveraging Jekyll for static site generation. The front-end is styled using SASS and integrates with GitHub APIs for dynamic content. The interactive game hub is implemented using HTML5 Canvas and JavaScript.

A detailed architecture diagram is available on [Draw.io](https://app.diagrams.net/). You can find the diagram file in the repository under `docs/architecture.drawio`.

---

## Technical Description

### Frontend Design

The front-end is based on the structure of the website, which includes:

1. **Game Hub**: The index page (`index.md`) serves as the central hub for navigating different worlds and minigames. It features:
   - Interactive elements like NPC dialogues and skin customization.
   - Dynamic rendering using HTML5 Canvas.
   - Background music and visual styling for an immersive experience.
2. **Navigation Bar**: Configured in `_config.yml` to provide easy access to different sections of the website.
3. **Styling**: Custom themes are applied using SASS, with options to switch themes in `_sass/minima/custom-styles.scss`.

### Interactive Features

The game hub includes several interactive features:

- **NPC Dialogues**: NPCs provide hints and guidance for navigating different worlds. Dialogues are dynamically rendered using JavaScript.
- **Skin Customization**: Players can customize their character's appearance using a modal interface.
- **Game Worlds**: Each world is represented by an interactive object on the canvas, allowing players to enter different experiences.

---

## Getting Started

To set up the Genome Gamers Frontend project, follow the steps below:

### Prerequisites

Ensure you have the following installed on your system:
1. **Node.js**: Download and install from [Node.js Official Website](https://nodejs.org/).
2. **npm**: Comes bundled with Node.js.
3. **Git**: Download and install from [Git Official Website](https://git-scm.com/).

### Setup Instructions

1. **Clone the Repository**:
   Open a terminal and run the following command to clone the repository:
   ```bash
   git clone https://github.com/your-username/GenomeGamersFrontend.git
   ```
   Replace `your-username` with the actual GitHub username.

2. **Navigate to the Project Directory**:
   ```bash
   cd GenomeGamersFrontend
   ```

3. **Install Dependencies**:
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   Launch the development server using:
   ```bash
   npm start
   ```
   This will start the server and open the project in your default web browser.

5. **Build the Project**:
   To generate the production-ready files, use:
   ```bash
   npm run build
   ```

6. **Deploy**:
   Follow the deployment instructions in the repository to host the project on GitHub Pages or another platform.

---

### Additional Notes

- **Configuration**: Customize `_config.yml` for site-specific settings.
- **Game Assets**: Ensure all game assets (images, audio files, etc.) are stored in the appropriate directories under `assets/`.
- **Troubleshooting**: Refer to the `docs/README.md` for troubleshooting common issues.

Now you're ready to explore and contribute to the Genome Gamers Frontend project!
