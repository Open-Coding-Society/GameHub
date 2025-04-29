import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import PlayerBaseOneD from './PlayerBaseOneD.js';
import SkibidiTitan from './SkibidiTitan.js'; // Import SkibidiTitan

export class PlayerSkibidi extends PlayerBaseOneD {
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
        //this.handleCollisionEvent("powerup"); // created a new case where it detects for collision between player and power-up
    } 
    
    handleDeath() {
        if (this.state.isDying) {
            this.canvas.style.transition = "transform 0.5s";
            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
            GameEnv.playSound("PlayerDeath");
            setTimeout(async () => {
                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
            }, 900);
        }
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
                // Trigger attack once per key press, no holding allowed
            if (!this.state.isAttacking) {  // Check if player isn't already attacking
                this.state.animation = 'attack';  // Set the animation to attack
                GameEnv.playerAttack = true;     // Set player attack state to true
                this.state.isAttacking = true;   // Set the player as attacking

                // Reset the attack state after the animation ends (set it to 500ms for now)
                setTimeout(() => {
                    this.state.isAttacking = false;
                    GameEnv.playerAttack = false;
                }, 500); // 500ms delay for one attack per key tap (adjust timing based on animation)
            }
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
                const skibidiTitan = GameEnv.gameObjects.find(obj => obj.name === 'skibidiTitan');
                if (skibidiTitan.currentHp > 0) {
                    alert("Kill the titan with B buddy, why do you think theres a health bar");
                    this.setX(0)
                    this.setY(700)
                    this.state.animation = 'idle';
                    break;
                }   

                // 1. Caught in finishline
                if (this.collisionData.touchPoints.this.onTopofOther  || this.state.isFinishing ) {
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
            /*
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
            */
        }

    }

}

export default PlayerSkibidi;