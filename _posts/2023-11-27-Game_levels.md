---
comments: false
layout: post
title: Game levels and objects
description: A description of concepts behind creating game levels.  This describes Game Level setup and defining the assets used to create Game Objects.
categories: [An Introduction] 
---

## Game Level Setup

The coders who extend the game will be spending the majority of their time making new GameLevel and customizing GameLevel assets and objects.

### Game Level Assets

There are simple to complex setups for assets. The best way to learn how to define an assets is by adapting from those that are previously defined.

#### Background Assets

Assets are in JSON format categorized by type, and contain a name and an image as you see with these backgrounds.  Backgrounds have movement speed (parallaxSpeed) and can be tied to player movement.

```javascript
backgrounds: {
    hills: { src: "/images/platformer/backgrounds/hills.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    mountains: { src: "/images/platformer/backgrounds/mountains.jpg", parallaxSpeed: 0.1, moveOnKeyAction: true },
    clouds: { src: "/images/platformer/backgrounds/clouds.png", parallaxSpeed: 0.5 },
},
```

#### Character Assets

Assets, that have more game actions, can contain properties for hitbox.  These are proportion on when a hit should be registered according to its outer edges.  If it does not have a hitbox it will work according to sprite size.

```javascript
enemies: {
    goomba: {
        src: "/images/platformer/sprites/goomba.png",
        width: 448,
        height: 452,
        scaleSize: 60,
        speedRatio: 0.7,
        xPercentage: 0.6,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
    },
    flyingGoomba: {
        src: "/images/platformer/sprites/flying-goomba.png",
        width: 448,
        height: 452,
        scaleSize: 60,
        speedRatio: 0.7,
    },
    mushroom: {
        src: "/images/platformer/platforms/mushroom.png",
        width: 200,
        height: 180,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
    },
```

#### Player Assets

The player has animations that correspond to movement.  In the Mario definitions, you will see properties that correspond to animations for idles, walk, run, jump.  The mario sprite is very tall in proportion to where a hit should be detected, thus the 80%.

```javascript
players: {
    mario: {
    src: "/images/platformer/sprites/mario.png",
    width: 256,
    height: 256,
    scaleSize: 80,
    speedRatio: 0.7,
    idle: {
        left: { row: 1, frames: 15 },
        right: { row: 0, frames: 15 },
    },
    walk: {
        left: { row: 3, frames: 7 },
        right: { row: 2, frames: 7 },
    },
    run: {
        left: { row: 5, frames: 15 },
        right: { row: 4, frames: 15 },
    },
    jump: {
        left: { row: 11, frames: 15 },
        right: { row: 10, frames: 15 },
    },
    hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
},
```

### Game Level Objects

Assets are formed into objects by giving them a name, id, and associating the with a template of code (class).

```javascript
const objects = [
    { name: 'mountains', id: 'background', class: BackgroundParallax, data: assets.backgrounds.mountains },
    { name: 'clouds', id: 'background', class: BackgroundParallax, data: assets.backgrounds.clouds },
    { name: 'hills', id: 'background', class: BackgroundParallax, data: assets.backgrounds.hills },
    { name: 'grass', id: 'floor', class: Platform, data: assets.platforms.grass },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2736, yPercentage: 0.85 },
    { name: 'blocks', id: 'wall', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.6, yPercentage: 1 },
    { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05 },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"] },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"] },
    { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.75, yPercentage: 1, minPosition: 0.5 }, // special name is used for random event 2 to make sure that only one of the Goombas ends the random event
    { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
    { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] },
    { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["hard", "impossible"] },
    { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["impossible"] },
    { name: 'mushroom', id: 'mushroom', class: Mushroom, data: assets.enemies.mushroom, xPercentage: 0.49 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.1908, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.2242, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.2575, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.5898, yPercentage: 0.900 },
    { name: 'mario', id: 'player', class: PlayerHills, data: assets.players.mario },
    { name: 'tube', id: 'finishline', class: FinishLine, data: assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.855 },
    { name: 'loading', id: 'background', class: BackgroundTransitions, data: assets.transitions.loading },
  ];
```

### Game Level Defintion

The Game Level is complete by giving the level a tag and providing a common structure including assets and objects for the game.

```js
const GameSetHills = {
    tag: 'Hills',
    assets: assets,
    objects: objects
  };
```

### Game Setup

Each of the Game Level definitions are added to the game.  The **GameSetup.js** imports definitions, verifies assets, and pushes them into them into the Game Environment **levels**.  Once in **levels** the are used by **GameControl.js** in the main **gameLoop**.

```js
// Initialize Game Levels
function GameLevelSetup(GameSetter, path, callback, passive = false) {
    var gameObjects = new GameSet(GameSetter.assets, GameSetter.objects, path);
    return new GameLevel({ tag: GameSetter.tag, callback: callback, objects: gameObjects.getGameObjects(), passive: passive });
}

// Start Game
GameLevelSetup(GameSetterStart, this.path, this.homeScreenCallback, true);
// Game Levels added to the Game ...
GameLevelSetup(GameSetterHills, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterGreece, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterGreeceMini, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterWater, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterQuidditch, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterHogwarts, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterWinter, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterWinterIce, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterSkibidi, this.path, this.playerOffScreenCallBack);
GameLevelSetup(GameSetterBoss, this.path, this.playerOffScreenCallBack);
// End Game
GameLevelSetup(GameSetterEnd, this.path, this.gameOverCallBack, true);
```
