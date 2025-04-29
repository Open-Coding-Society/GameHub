import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import PlayerBaseOneD from './PlayerBaseOneD.js'; ///With this you can change the direction of the sprite sheet with just the sprite rows.
import BossFight from './BossFight.js';

/**
 * @class PlayerBossFight class
 * @description PlayerBossFight.js key objective is to eent the user-controlled character in the game.   
 * 
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The Player object.  
 * 
 * @extends PlayerBase 
 */
export class PlayerBossFight extends PlayerBaseOneD { /// Using PlayerBaseOneD added the sprite mirror but deleted the sprite not showing the animations

    /** GameObject instantiation: constructor for PlayerSkibidi object
     * @extends Character 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);
        this.invincible = true;
        this.timer = false;
        GameEnv.invincible = false; // Player is NOT invincible


        this.animationSpeed = data?.animationSpeed;
        this.counter = this.animationSpeed;
        // Goomba variables, deprecate?
        this.timer = false;
        GameEnv.invincible = false; // Player is not invincible 
    }

    /**
     * @override
     * gameLoop helper: Update Player jump height, replaces PlayerBase updateJump using settings from GameEnv
     */
    updateJump() {  
        let jumpHeightFactor;
    
        console.log("Current Difficulty:", GameEnv.difficulty);  // Debugging output
    
        if (GameEnv.powerUpCollected) {  
            jumpHeightFactor = 1.20;  // Ensure this is used when power-up is collected
        } else if (GameEnv.difficulty === "easy") {
            jumpHeightFactor = 0.50;
        } else if (GameEnv.difficulty === "super_easy") {
            jumpHeightFactor = 0.90;  
        } else if (GameEnv.difficulty === "normal") {
            jumpHeightFactor = 0.40;
        } else {
            jumpHeightFactor = 0.30;
        }
    
        console.log("Jump Height Factor Set To:", jumpHeightFactor);  // Debugging output
        console.log("Old Y Position:", this.y); 
    
        this.setY(this.y - (this.bottom * jumpHeightFactor));
    
        console.log("New Y Position:", this.y);
    }    
    

    updateFrameX(){
        if (this.frameX < this.maxFrame) {
            if(this.counter > 0){
                this.frameX = this.frameX;
                this.counter--;
            }
            else{
                this.frameX++;
                this.counter = this.animationSpeed;
            }
        } else {
            this.frameX = this.minFrame;
        }
    }

    /**
     * @override
     * gameLoop: Watch for Player collision events 
     */ 
    handleCollisionStart() {
        super.handleCollisionStart(); // calls the super class method
        // adds additional collision events
        this.handleCollisionEvent("finishline");
        this.handleCollisionEvent("SkibidiToilet");
        this.handleCollisionEvent("laser");
        this.handleCollisionEvent("powerup"); // created a new case where it detects for collision between player and power-up
    }

        handleKeyUp(event) {
        const key = event.key;
        if (key in this.pressedKeys) {
            delete this.pressedKeys[key];
            if (Object.keys(this.pressedKeys).length > 0) {
                // If there are still keys in pressedKeys, update the state to the last one
                const lastKey = Object.keys(this.pressedKeys)[Object.keys(this.pressedKeys).length - 1];
                this.updateAnimationState(lastKey);
                //GameEnv.updateParallaxDirection(lastKey)
            } else {
                // If there are no more keys in pressedKeys, update the state to null
                GameEnv.playerAttack = false;
                this.updateAnimationState(null);
              //  GameEnv.updateParallaxDirection(null)
            }
        }
    }
   
    /**
    * @override
    */
    updateAnimationState(key) {
        switch (key) {
            case 'a':
            case 'd':
                this.state.animation = 'walk';
                GameEnv.playerAttack = false;
                break;
            case 'w':
                if (this.state.movement.up == false) {
                this.state.movement.up = true;
                this.state.animation = 'jump';
                }
                GameEnv.playerAttack = false;
                break;
            case 's':
                if ("a" in this.pressedKeys || "d" in this.pressedKeys) {
                this.state.animation = 'run';
                }
                GameEnv.playerAttack = false;
                break;
            case 'b':
                this.state.animation = 'attack';  // Always trigger attack when b is pressed
                GameEnv.playerAttack = true;
                break;
            default:
                this.state.animation = 'idle';
                GameEnv.playerAttack = false;
                break;
        }
    }

    /**
     * @override
     * gameloop: Handles additional Player reaction / state updates to the collision for game level 
     */
    handlePlayerReaction() {
        super.handlePlayerReaction(); // calls the super class method
        // handles additional player reactions
        switch (this.state.collision) {
            case "finishline":
                // 1. Caught in finishline
                if (this.collisionData.touchPoints.this.onTopofOther  || this.state.isFinishing ) {
                    const titan = GameEnv.gameObjects.find(obj => obj.name === 'titan');
                    if (titan.currentHp <= 0) {
                        // Position player in the center of the finishline 
                        this.x = this.collisionData.newX;
                        this.state.movement = { up: false, down: false, left: false, right: false, falling: false};
                        this.state.isFinishing = true;
                        this.gravityEnabled = true;
                        // Using natural gravity wait for player to reach floor
                        if (Math.abs(this.y - this.bottom) <= GameEnv.gravity) {
                            // Force end of level condition
                            this.x = GameEnv.innerWidth + 1;
                        }
                    } else {
                        alert("Titan is not dead. You may not proceed");
                        this.setX(0);
                        this.state.animation = 'idle';
                        break;
                    }
                    
                // 2. Collision between player right and finishline   
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement.right = false;
                    this.state.movement.left = true;
                // 3. Collision between player left and finishline
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement.left = false;
                    this.state.movement.right = true;
                }
                break;
            case "SkibidiToilet": // Note: Goomba.js and Player.js could be refactored
                // 1. Player jumps on goomba, interaction with Goomba.js
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom && this.state.isDying == false) {
                    // GoombaBounce deals with player.js and goomba.js
                    if (GameEnv.goombaBounce === true) {
                        GameEnv.goombaBounce = false;
                        this.y = this.y - 100;
                    }
                    if (GameEnv.goombaBounce1 === true) {
                        GameEnv.goombaBounce1 = false; 
                        this.y = this.y - 250
                    }
                // 2. Player touches goomba sides of goomba 
                } else if (this.collisionData.touchPoints.this.right || this.collisionData.touchPoints.this.left) {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (this.state.isDying == false) {
                            this.state.isDying = true;
                            this.canvas.style.transition = "transform 0.5s";
                            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                            GameEnv.playSound("PlayerDeath");
                            setTimeout(async() => {
                                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                            }, 900); 
                        }
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.right) {
                        this.x -= 10;
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.left) {
                       this.x += 10;
                    }
                
                }
                break;
            case "laser": // 
                if (this.collisionData.touchPoints.this.right || this.collisionData.touchPoints.this.left) {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (this.state.isDying == false) {
                            this.state.isDying = true;
                            this.canvas.style.transition = "transform 0.5s";
                            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                            GameEnv.playSound("PlayerDeath");
                            setTimeout(async() => {
                                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                            }, 900); 
                        }
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.right) {
                        this.x -= 10;
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.left) {
                    this.x += 10;
                    }
                
                }
                break;  
            case "powerup": 
            if (GameEnv.powerUpCollected) {  
                console.log("Power-up collision detected! Changing difficulty...");
                GameEnv.difficulty = "super_easy"; // Force change
                jumpHeightFactor = 1.20;
            }
            if (this.collisionData.touchPoints.this.right && GameEnv.powerUpCollected) { 
                this.state.movement.right = false;
                this.state.movement.left = true;
                jumpHeightFactor = 1.20; // Updating the jump factor to make player jump higher
            } else if (this.collisionData.touchPoints.this.left && GameEnv.powerUpCollected) { 
                this.state.movement.left = false;
                this.state.movement.right = true;
                jumpHeightFactor = 0.80; // Updating the jump factor to make player jump higher
            }
            
                GameEnv.update();
                console.log("Power Up",GameEnv.gameObjects[GameEnv.gameObjects.length - 1]);
                break;
        }

    }

}

export default PlayerBossFight;