import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import Laser from './Laser.js';
import Enemy from './Enemy.js';
import TitanHealth from './TitanHealth.js';

export class BossFight extends Character {
    // Constructor sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data);

        // Titan properties
        this.name = name;
        this.y = yPercentage;
        this.x = xPercentage * GameEnv.innerWidth;
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        // Health properties
        this.maxHp = 100; // Maximum health points
        this.currentHp = 100; // Current health points
        this.titanHealthBar = new TitanHealth(
            150, 10, // Width and height of the health bar
            this.canvas.width, this.canvas.height, // Titan dimensions
            this.maxHp, this.currentHp, // Titan's max and current health
            this.x, this.y // Titan's position
        );

        // State properties
        this.state = {
            isDead: false // New state for checking if Titan is dead
        };

        this.dead = false;

        // Laser-related properties
        this.immune = 0;
        this.debounce = 0;
        this.laser = document.getElementById("Laser");
        this.laserHeight = this.laser.innerHeight;

        // Hide the laser element
        this.laser.style.display = "none";

        // New property to randomize laser delay
        this.laserFireDelay = this.getRandomLaserDelay();

        GameEnv.playSound("Scripps");
    }

    hpLoss() {
        if (GameEnv.playerAttack && !this.state.isDead) {
            this.currentHp -= 1;
        }
    }

    // Method to handle Titan's death state (makes the Titan disappear)
    handleDeath() {
        if (this.currentHp <= 0 && !this.state.isDead) {
            this.dead = true;
            console.log("this.dead set to" + this.dead);
            this.state.isDead = true; // Set the Titan as dead
            GameEnv.invincible = true; // Make invincible 
            this.canvas.style.display = "none"; // Hide the Titan's canvas (makes it disappear)
            GameEnv.playSound("goombaDeath"); // Play the death sound
            this.titanHealthBar.destroy();
        }
    }

    // Method to get a random delay between 1 and 10 seconds (converted to frames)
    getRandomLaserDelay() {
        const minDelay = 60; // 1 second = 60 frames
        const maxDelay = 600; // 10 seconds = 600 frames
        return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    }

    // Method to handle player death (recycled from SkibidiTitan.js)
    kill(target) {
        target.canvas.style.transition = "transform 0.5s";
        target.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
        GameEnv.playSound("PlayerDeath");

        if (target.state.isDying === false) {
            target.state.isDying = true;
            setTimeout(async () => {
                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                console.log("level restart");

                GameEnv.gameObjects.forEach(obj => {
                    if (obj instanceof Shard) {
                        obj.reset();
                    }
                });
                target.state.isDying = false;
            }, 900);
        }
    }

    update() {
        super.update();

        // Check if the Titan should take damage
        this.hpLoss();

        // Check if the Titan should die and disappear
        this.handleDeath();

        // Only continue if Titan is not dead
        if (!this.state.isDead) {
            // Health bar update
            this.titanHealthBar.updateTitanHealth(
                this.currentHp, 
                this.x, 
                this.y, 
                this.canvas.width, 
                this.canvas.height
            );
            this.titanHealthBar.update();

            // Laser-related logic
            this.immune = 1;

            if (this.debounce > 0) {
                this.debounce = -240;

                // Show red placeholder boxes in random areas
                const explosionCount = 5;
                for (let i = 0; i < explosionCount; i++) {
                    // Set up explosions as HTML DOM objects
                    // Will fix this later with actual explosion img
                    const explosionX = Math.random() * GameEnv.innerWidth;
                    const explosionY = 0.65 * GameEnv.innerHeight;
                    const explosion = document.createElement('div');
                    explosion.style.position = 'absolute';
                    explosion.style.left = `${explosionX}px`;
                    explosion.style.top = `${explosionY}px`;
                    explosion.style.width = '100px';
                    explosion.style.height = '100px';
                    explosion.style.backgroundColor = 'red';
                    explosion.style.opacity = 0;
                    explosion.style.transition = 'opacity 1s ease-in-out';
                    document.body.appendChild(explosion);

                    // Fade in the explosion
                    setTimeout(() => {
                        explosion.style.opacity = 1;
                    }, 100);

                    // Flash the explosion and check player position
                    setTimeout(() => {
                        explosion.style.opacity = 0;
                        const playerX = GameEnv.PlayerPosition.playerX;
                        const playerY = GameEnv.PlayerPosition.playerY;
                        const distance = Math.sqrt(Math.pow(playerX - explosionX, 2) + Math.pow(playerY - explosionY, 2));
                        if (distance < 100) {
                            this.kill(GameEnv.player);
                        }
                    }, 1100);

                    // Remove explosion after some time
                    setTimeout(() => {
                        document.body.removeChild(explosion);
                    }, 2000);
                }
            }

            // Can probably delete this part right here 

            // Additional difficulty-specific adjustments
            if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
                this.immune = 1;
            } else if (GameEnv.difficulty === "impossible") {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }

            // Positioning and movement adjustments
            this.y = 0.25 * GameEnv.innerHeight;
            this.playerBottomCollision = false;

            // Update the ticker
            this.debounce += 1;
        }
    }
}
export default BossFight;