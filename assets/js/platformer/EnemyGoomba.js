import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Goomba extends Character {
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition, range = 300, safeDistance = 200) {
        super(canvas, image, data);

        this.name = name; // Name of the Goomba
        this.y = yPercentage; // Y-coordinate
        this.x = xPercentage * GameEnv.innerWidth; // Initial X-coordinate

        // Initial range boundaries (relative to the starting position)
        this.originalMinPosition = this.x - range; // Minimum range boundary
        this.originalMaxPosition = this.x + range; // Maximum range boundary

        // Minimum safe distance to maintain from the player
        this.safeDistance = safeDistance;

        this.immune = 0; // Immunity status

        // Base movement speed of the Goomba
        this.speed = 3;

        // Unique movement modifier for asynchronous behavior
        // Ensures that each Goomba moves with a slightly different speed
        this.movementModifier = Math.random() * 2 + 0.5; // Speed multiplier between 0.5x and 2.5x
    }

    /**
     * Dynamically adjust the movement range to maintain a safe distance
     * from the player's current position.
     */
    updateMovementRange() {
        // Get the current X position of the player (default to 0 if not available)
        const playerX = GameEnv.player.x || 0;

        // Adjusted range to maintain safe distance from the player
        const adjustedMinPosition = playerX + this.safeDistance;
        const adjustedMaxPosition = playerX - this.safeDistance;

        // Calculate the final movement range while ensuring boundaries
        this.minPosition = Math.max(this.originalMinPosition, adjustedMinPosition);
        this.maxPosition = Math.min(this.originalMaxPosition, adjustedMaxPosition);

        // Fallback: If the adjusted range becomes invalid (max < min),
        // revert to the original range to prevent disappearing sprites
        if (this.maxPosition <= this.minPosition) {
            this.minPosition = this.originalMinPosition;
            this.maxPosition = this.originalMaxPosition;
        }
    }

    /**
     * Update the Goomba's position and handle its movement.
     * This method is called every frame.
     */
    update() {
        super.update();

        // Adjust the Goomba's movement using its unique movement multiplier
        this.x += this.speed * this.movementModifier;

        // Update the Goomba's movement range dynamically
        this.updateMovementRange();

        // Reverse direction when the Goomba hits its movement boundaries
        if (this.x <= this.minPosition || this.x >= this.maxPosition) {
            this.reverseDirection();
        }

        // Handle random events
        // Event 2: Stop all Goombas
        if (GameControl.randomEventId === 2 && GameControl.randomEventState === 1) {
            this.speed = 0; // Stop movement
            if (this.name === "goombaSpecial") {
                GameControl.endRandomEvent();
            }
        }

        // Event 3: Kill a random Goomba
        if (GameControl.randomEventId === 3 && GameControl.randomEventState === 1) {
            this.destroy(); // Remove this Goomba
            GameControl.endRandomEvent();
        }

        // Chance for Goomba to turn gold (based on difficulty level)
        if (["normal", "hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)'; // Gold effect
                this.immune = 1; // Make Goomba immune
            }
        }

        // Apply unique textures based on difficulty
        if (GameEnv.difficulty === "hard") {
            this.canvas.style.filter = "invert(100%)"; // Invert texture
            this.canvas.style.scale = 1.25; // Scale up
            this.immune = 1; // Make Goomba immune
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)'; // Bright gold effect
            this.immune = 1; // Make Goomba immune
        }

        // Randomly trigger a jump (10% chance per frame)
        if (Math.random() < 0.1) {
            this.jump();
        }

        this.playerBottomCollision = false; // Reset collision state
    }

    /**
     * Reverse the direction of the Goomba's movement.
     */
    reverseDirection() {
        this.speed = -this.speed; // Invert speed to reverse movement
    }

    /**
     * Handle collisions with other game objects.
     */
    collisionAction() {
        const other = this.collisionData.touchPoints.other;
    
        if (other.id === "finishline") {
            if (other.left || other.right) {
                this.reverseDirection(); // Bounce back
            }
        }
    
        if (other.id === "wall") {
            if (other.left || other.right) {
                this.reverseDirection(); // Bounce back
            }
        }
    
        if (other.id === "player") {
            // If the player lands on top of the Goomba and it's not immune
            if (other.bottom && this.immune === 0) {
                GameEnv.goombaBounce = true; // Player bounces on collision
                this.explode(); // Destroy the Goomba
                GameEnv.playSound("goombaDeath");
    
                setTimeout(() => {
                    this.destroy(); // Remove the Goomba
                }, 1500);
            } else if (other.left || other.right || other.top) {
                // If the player collides from the side or bottom, the player dies
                this.triggerPlayerDeath();
            }
        }
    
        if (other.id === "goomba") {
            if (GameEnv.difficulty !== "impossible" && (other.left || other.right)) {
                this.reverseDirection(); // Bounce back on collision
            }
        }
    
        if (other.id === "jumpPlatform") {
            if (other.left || other.right) {
                this.reverseDirection(); // Bounce back
            }
        }
    }
    

    /**
     * Trigger the player's death sequence.
     */
    triggerPlayerDeath() {
        if (typeof GameEnv.triggerPlayerDeath === "function") {
            GameEnv.triggerPlayerDeath(); // Call the death logic
        }
    }

    /**
     * Create an explosion effect when the Goomba is destroyed.
     */
    explode() {
        const shards = 10; // Number of shards
        for (let i = 0; i < shards; i++) {
            const shard = document.createElement('div');
            shard.style.position = 'absolute';
            shard.style.width = '5px';
            shard.style.height = '5px';
            shard.style.backgroundColor = 'brown'; // Color of the shards
            shard.style.left = `${this.x}px`;
            shard.style.top = `${this.y}px`;
            this.canvas.parentElement.appendChild(shard); // Add shard to the canvas

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;

            const shardX = Math.cos(angle) * speed;
            const shardY = Math.sin(angle) * speed;

            shard.animate(
                [
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${shardX * 20}px, ${shardY * 20}px)`, opacity: 0 },
                ],
                {
                    duration: 1000,
                    easing: 'ease-out',
                    fill: 'forwards',
                }
            );

            setTimeout(() => {
                shard.remove(); // Remove shard after animation
            }, 1000);
        }
        this.canvas.style.opacity = 0; // Make the Goomba disappear
    }

    /**
     * Handle the Goomba's jump behavior (to be implemented).
     */
    jump() {
        // Implement jump logic here
    }
}

export default Goomba;
