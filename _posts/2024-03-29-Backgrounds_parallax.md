---
toc: true
comments: false
layout: post
title:  Parallax setup
description: Describing backgrounds and parallax features
categories: Backgrounds|Theme|Messages
---

## What is motion parallax?

Motion parallax describes a psychological phenomenon in which we perceive that farther away objects seem to move slower than close objects.

[See Illustration](https://www.researchgate.net/publication/299401615/figure/fig2/AS:349707269361671@1460388118826/Motion-parallax-When-an-observer-passes-through-a-scene-when-driving-a-car-it-moves.png)

If you were in a car, looking out of the window, you might notice that nearby trees or buildings seem to move quickly, while mountains in the distance hardly move at all.

## Motion parallax in games

This effect is frequently replicated in games by layering transparent images over each other.

For example, our Mario game layers images from ``/images/platformer/backgrounds``

![combined](../../../images/lesson/combined.gif)

Notice how as the player moves, the mountains in the background move slower than the hills closer to the player.

This is accomplished by setting different speed logic to each of the backgrounds, then layering on top of each other.

![hills](../../../images/lesson/hills.gif)

> Fast moving hills in the front

![mountains](../../../images/lesson/mountains.gif)

> Slower moving mountains in the back

In our game, this is because both the ``backgroundHills`` object and the ``backgroundMountains`` object have a speed attribute which is set differently based on player movement:

```js
if (this.isKeyActionLeft(key) && this.x > 2) {
                GameEnv.backgroundHillsSpeed = -0.4;
                GameEnv.backgroundMountainsSpeed = -0.1;
            } else if (this.isKeyActionRight(key)) {
                GameEnv.backgroundHillsSpeed = 0.4;
                GameEnv.backgroundMountainsSpeed = 0.1;
            } 
```

## Changing Backgrounds

Add Under Water background to the avaenida
```js
backgrounds: {
        start: { src: "/images/platformer/backgrounds/home.png" },
        hills: { src: "/images/platformer/backgrounds/hills.png" },
        avenida: { src: "/images/platformer/backgrounds/avenidawide3.jpg" },
        mountains: { src: "/images/platformer/backgrounds/mountains.jpg" },
        clouds : { src: "/images/platformer/backgrounds/clouds.png"},
        space: { src: "/images/platformer/backgrounds/planet.jpg" },
        castles: { src: "/images/platformer/backgrounds/castles.png" },
        loading: { src: "/images/platformer/backgrounds/greenscreen.png" },
        complete: { src: "/images/platformer/backgrounds/OneStar.png" },
        complete2: { src: "/images/platformer/backgrounds/TwoStar.png" },
        end: { src: "/images/platformer/backgrounds/Congratulations!!!.png" },
        water: {src: "/images/platformer/backgrounds/water.jpg"},
}
```
I did it by adding a water background to the game setup. js

Here is what I also changed 
```js
const avenidaGameObjects = [
        // GameObject(s), the order is important to z-index...
        { name: 'water', id: 'background', class: Background, data: this.assets.backgrounds.water },
        { name: 'sand', id: 'platform', class: Platform, data: this.assets.platforms.sand },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.5, yPercentage: 0.85 },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.5368, yPercentage: 0.85 },
        { name: 'itemBlock', id:'jumpPlatform', class: JumpPlatform, data: this.assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 },
        { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.3, minPosition: 0.05},
        { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.5, minPosition: 0.3 },
        { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.09},
        { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.49},
        { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.75, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
        { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.5, minPosition:  0.05},
        { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5},
        { name: 'lopez', id: 'player', class: Player, data: this.assets.players.lopez },
        { name: 'tube', id: 'tube', class: Tube, data: this.assets.obstacles.tube },
        { name: 'complete', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete },
]
```

I changed the anvenida background with water for the game.

Now  i am going to talk about how i add the water and sand images to the repository. so i dragged the water image to the backgrounds in the image file.
Also i added the sand image to the platform file in images in vs code.

Here is how i added the sand image to the platforms in game set up. Js

```js
platforms: {
        grass: { src: "/images/platformer/platforms/grass.png" }, 
        sand: { src: "/images/platformer/platforms/sand.png" }, 
        alien: { src: "/images/platformer/platforms/alien.png" },
        bricks: { src: "/images/platformer/platforms/brick_wall.png" },
        block: { src: "/images/platformer/platforms/brick_block.png" }, //MAY need 3 new variables: sizeRatio, widthRatio, and heightRatio
}
```
I add a new new line to the platforms in the game set up. Js and then i added the sand image to the platforms 

but i am still fixing the sand platform issue until it works in the game for the anvenida level.

## Other

- Changing speed of goombas
- Adding more thematic elements to levels (like bananas to monkey level)