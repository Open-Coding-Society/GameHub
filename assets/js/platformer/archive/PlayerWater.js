import GameEnv from '../GameEnv.js';
import PlayerBase from '../PlayerBase.js';
import GameControl from '../GameControl.js';

/**
 * @class PlayerWater class
 * @description Handles the user-controlled character in the water-themed level.
 * 
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by the user to control The Player object.
 * 
 * @extends PlayerBase 
 */
export class PlayerWater extends PlayerBase {

    /** GameObject instantiation: constructor for PlayerWater object
     * @extends Character 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);
        this.timer = false;
        GameEnv.invincible = false; // Player is not invincible 
    }

    /**
     * @override
     * Updates Player jump height based on GameEnv difficulty.
     */
    updateJump() {  
        let jumpHeightFactor = 0;
        if (GameEnv.difficulty === "easy") {
            jumpHeightFactor = 0.50;
        } else if (GameEnv.difficulty === "normal") {
            jumpHeightFactor = 0.40;
        }
        if (GameEnv.currentLevel.tag === "boss") {
            jumpHeightFactor = 0;
        }
        this.setY(this.y - (this.bottom * jumpHeightFactor));
    }

    /**
     * @override
     * Watches for Player collision events.
     */
    handleCollisionStart() {
        super.handleCollisionStart(); 
        this.handleCollisionEvent("finishline");
        this.handleCollisionEvent("goomba");
        this.handleCollisionEvent("mushroom");
        this.handleCollisionEvent("boss");

        // Add the additional collisions here
        this.handleCollisionEvent("jumpPlatform");
    }

    /**
     * @override
     * Handles Player reactions to collisions based on game environment.
     */
    handlePlayerReaction() {
        super.handlePlayerReaction(); 

        if (GameEnv.ifWater) {
            // Check if all coins are collected before allowing level exit
            const allCoinsCollected = GameEnv.gameObjects.every(obj => obj.jsonifiedElement.id !== "coin");
            if (!allCoinsCollected) {
                console.log("All coins must be collected to proceed.");
                return;  // Stop here if not all coins are collected
            } else {
                console.log("All coins collected! You can now exit the level.");
            }
        }

        switch (this.state.collision) {
            case "finishline":
                if (GameEnv.keyCollected) {
                    GameControl.transitionToNextLevel();  // Proceed to the next level if key is collected
                }
                break;

            case "goomba":
            case "boss":
                if (this.collisionData.touchPoints?.this.top && this.collisionData.touchPoints?.other.bottom && !this.state.isDying) {
                    if (GameEnv.goombaBounce) {
                        GameEnv.goombaBounce = false;
                        this.y -= 100;
                    }
                    if (GameEnv.goombaBounce1) {
                        GameEnv.goombaBounce1 = false;
                        this.y -= 250;
                    }
                } else if (this.collisionData.touchPoints?.this.right || this.collisionData.touchPoints?.this.left) {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (!this.state.isDying) {
                            this.state.isDying = true;
                            this.canvas.style.transition = "transform 0.5s";
                            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                            GameEnv.playSound("PlayerDeath");
                            setTimeout(() => {
                                GameControl.transitionToLevel(GameEnv.currentLevel);
                            }, 900);
                        }
                    } else if (GameEnv.difficulty === "easy") {
                        this.x += this.collisionData.touchPoints?.this.right ? -10 : 10;
                    }
                }
                break;

            case "mushroom":
                if (!GameEnv.destroyedMushroom) {
                    GameEnv.destroyedMushroom = true;
                    this.canvas.style.filter = 'invert(1)';
                    setTimeout(() => {
                        this.canvas.style.filter = 'invert(0)';
                    }, 2000);
                }
                break;

            // New collision logic for jump platforms
            case "jumpPlatform":
                if (this.topOfPlatform === true) {
                    this.y -= 150; // Bounce effect when the player lands on the platform
                }
                break;
        }
    }
}

/**
 * Extends GameControl with level transition functionality.
 */
GameControl.transitionToNextLevel = async function () {
    console.log("Transitioning to the next level...");

    // Ensure that all coins are collected before advancing
    const allCoinsCollected = GameEnv.gameObjects.every(obj => obj.jsonifiedElement.id !== "coin");
    if (!allCoinsCollected) {
        console.log("All coins must be collected to proceed.");
        return;
    }

    GameEnv.playSound("LevelComplete");
    const currentIndex = GameEnv.levels.indexOf(GameEnv.currentLevel);
    if (currentIndex < GameEnv.levels.length - 1) {
        GameEnv.currentLevel = GameEnv.levels[currentIndex + 1];
        GameEnv.loadLevel(GameEnv.currentLevel);
    } else {
        console.log("Game Completed!");
        this.showGameCompleteScreen();
    }
};

GameControl.showGameCompleteScreen = function () {
    const messageElement = document.createElement("div");
    messageElement.textContent = "Congratulations! You've completed the game!";
    messageElement.style.position = "absolute";
    messageElement.style.top = "50%";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translate(-50%, -50%)";
    messageElement.style.fontSize = "2.5rem";
    messageElement.style.color = "#fff";
    messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    messageElement.style.padding = "30px";
    messageElement.style.borderRadius = "15px";
    document.body.appendChild(messageElement);
};

export default PlayerWater;
