---
toc: false
comments: false
layout: post
title: Platformer files 
description: This provides a synopsis of the platformer game. Included is an overview of files, directories, JavaScript files, and an outline of the game objects, game levels, and game control.
---

## Files and Directories

Review these locations in the project to understand the structure and purpose of different files in a project.

- `index.md` is the entry point of the project, containing the HTML and initialization JavaScript for the game.
- `_sass/minima/custom-styles.scss`, `_sass/nighthawk` are SCSS files that define the styles for the game, including elements like score display, game buttons, and input fields.
- `images/platformer` is a directory that contains sprite sheets and images for the characters and objects in the game.
- `assets/audio` is a directory that contains audio assets, which are sounds synchronized with game events like collisions.
- `assets/js/platformer` is the directory where the game's key logic is written in JavaScript. This can be customized completely as no third-party libraries are used.

### Conceptual Overview

The below visualization shows key elements of the game.

- `GameSetup` creates `GameObjects`, which are then used by `GameControl` to drive the game.
  - A new `GameLevel` in `GameSetup` creates levels and new `GameObjects` from assets.
- `GameControl` contains the `gameLoop` and `transitionToLevel` methods.
  - `GameControl` calls a method in `GameEnv` to update and draw each `GameObject`.
  - Each `GameObject` has unique implementations of update, draw, collisions, etc.

```text
GameSetup
│
├── Attributes:
│   ├── playerAssets
│   ├── backgroundAssets
│   ├── platformAssets
│   └── ...
│
└── Methods: 
    ├── load
    │   ├── Creates new GameObjects from assets:
    │   │   ├── Player
    │   │   ├── Background
    │   │   ├── Platform
    │   │   └── ...
    │   └── Returns list of GameObjects
    └── ...

GameObject (Parent)
│
├── Player 
│   ├── Attributes: sprite animation, wasd
│   └── Methods: ...
│
├── Background
│   ├── Attributes: fit to screen, scrolling
│   └── Methods: ...
│
├── Platform
│   ├── Attributes: fixed to bottom, scrolling
│   └── Methods: ...
│
└── ...

GameControl
│
├── Attributes: ...
│
└── Methods: 
    ├── gameLoop
    │   ├── Drives action of game level
    │   ├── Updates and draws GameObjects
    │   └── ...
    ├── transitionToLevel
    │   ├── Destroys current GameObjects
    │   ├── Calls GameSetup.load to create new GameObjects for next level
    │   └── ...
    └── ...
```

## OOP Conversion Outline

The OOP hierarchy is designed to promote reusability, encapsulation, and a clear separation of entities.

### Core Game Logic

The `assets/js/platformer` directory contains the core logic for the game. Here are some key files and their purposes:

1. **GameEnv.js**: Manages the overall game state, including levels and game objects.
2. **GameControl.js**: Handles the game loop and transitions between levels.
3. **GameSetup.js**: Responsible for creating objects for the game levels and loading game assets.
4. **GameLevel.js**: Represents a level in the game, containing game objects and methods to load them.
5. **GameSet.js**: Defines the assets and game objects for a specific game level.
6. **PlayerBase.js**: Provides a base class for player characters, handling user input and animations.
7. **Platform.js**: Defines platform objects that the player can interact with.
8. **Background.js**: Manages background images and their behavior.
9. **Enemy.js**: Defines enemy behavior and interactions.

### Getting Started with Project

The core logic is great if you want to learn about the internals of the game. However, if you want to build a GameLevel you really need to understand how to set up a level and how to watch and react to collisions.

To build a new game level, focus on the following aspects.

#### GameSetter Files

Game objects are defined using classes that extend base templates like `GameObject`, `PlayerBase`, `Platform`, `Background`, and `Enemy`. Each game object has properties like position, size, and behavior.

- To make your own game level, create your own `GameSet` file by copying an existing definition and start making iterative changes.

Example from `GameSetHills.js`:

```js
const assets = {  
    obstacles: {
      tube: { src: "/images/platformer/obstacles/tube.png", ... },
      coin: { src: "/images/platformer/obstacles/coin.png", ... },
    },
    platforms: {
      grass: { src: "/images/platformer/platforms/grass.png", ... },
      bricks: { src: "/images/platformer/platforms/brick_wall.png", ... },
    },
    backgrounds: {
      hills: { src: "/images/platformer/backgrounds/hills.png", ... },
    },
    players: {
      mario: { src: "/images/platformer/sprites/mario.png", ... },
    },
    enemies: {
      goomba: { src: "/images/platformer/sprites/goomba.png", ... },
    }
};
```

- Creating a New Game Level To create a new game level, define a new GameSet file similar to GameSetHills.js. This file will specify the assets and objects for the level.

Example:

```js
const GameSetNewLevel = {
    tag: 'NewLevel',
    assets: assets,
    objects: [
        { name: 'background', id: 'background', class: Background, data: assets.backgrounds.hills },
        { name: 'player', id: 'player', class: PlayerBase, data: assets.players.mario },
        { name: 'platform', id: 'platform', class: Platform, data: assets.platforms.grass },
        { name: 'enemy', id: 'enemy', class: Enemy, data: assets.enemies.goomba },
        { name: 'finishline', id: 'finishline', class: FinishLine, data: assets.obstacles.tube },
    ]
};
```

### GameObject Class Templates

Be aware that a "class" is defined in your metadata as the template that defines your GameObject's behavior. There are many predefined templates that can be extended to enable unique behaviors. It is best to start with minimal customization and then override behaviors as you obtain understanding.

Look at existing class templates that extend: **Background.js**, **Enemy.js**, **Platform.js**, **PlayerBase.js**.

- **PlayerBase.js** handles basic player functionality like movement and animations.

```js
// assets/js/platformer/PlayerBase.js
class PlayerBase {
    constructor(data) {
        this.sprite = data.sprite;
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.state = { collision: null };
    }

    update() {
        // Update player position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    handleCollision() {
        // Default collision handling
    }

    draw(ctx) {
        // Draw the player sprite on the canvas
        ctx.drawImage(this.sprite, this.position.x, this.position.y);
    }
}
```

- **PlayerHills.js** extends PlayerBase.js and adds custom collision handling.

```js
// assets/js/platformer/PlayerHills.js
class PlayerHills extends PlayerBase {
    constructor(data) {
        super(data);
    }

    handleCollision() {
        switch (this.state.collision) {
            case "goomba":
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.velocity.y = -10; // Bounce effect
                }
                break;
            case "finishline":
                GameControl.transitionToLevel(GameEnv.levels.find(level => level.tag === "NextLevel"));
                break;
            default:
                super.handleCollision();
        }
    }
}
```

## Summary

To get started with building their own game level, students should:

- Understand the structure and purpose of key files in the platformer directory.
- Build and update the game level setup to use the new object definitions and classes.
- Extend base classes to create custom game objects and behaviors. For example, create something like PlayerHills.js by extending PlayerBase.js.
- Go through an iterative development cycle to create custom logic for interactions and collisions in the new classes.
