import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';
/**
 * @class PlayerBase class
 * @description PlayerBase.js key objective is to handle the user-controlled player's actions and animations.
 *
 * The PlayerBase class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by the user to control The PlayerBase object.
 *
 * @extends Character
 */
export class PlayerBase extends Character {
    initEnvironmentState = {
        collision: 'floor',
        collisions: [],
        animation: 'idle',
        direction: 'right',
        movement: { up: false, down: false, left: true, right: true, falling: false },
        isDying: false,
        isFinishing: false,
    };
    constructor(canvas, image, data) {
        super(canvas, image, data);
        // Player Data
        GameEnv.player = this;
        this.name = GameEnv.userID;
        // Player control data
        this.state = { ...this.initEnvironmentState };
        this.playerData = data;
        this.pressedKeys = {};
        this.runSpeed = this.speed * 3;
        this.shouldBeSynced = true;
        // Event listeners
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);
    }
    destroy() {
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);
        super.destroy();
    }
    update() {
        this.updateAnimation();
        this.updateMovement();
        super.update();
    }
    updateJump() {
        this.setY(this.y - (this.bottom * 0.35));
    }
    updateMovement() {
        const speedMultiplier = GameEnv.playerSpeedMultiplier || 1; // Default to 1 if not set
        switch (this.state.animation) {
            case 'idle':
                break;
            case 'jump':
                if (this.state.movement.up && !this.state.movement.falling) {
                    GameEnv.playSound("PlayerJump");
                    this.updateJump();
                    this.state.movement.falling = true;
                }
                // No break to allow default case to run
            default:
                if (this.state.direction === 'left' && this.state.movement.left && 'a' in this.pressedKeys) {
                    this.setX(this.x - (this.state.animation === 'run' ? this.runSpeed : this.speed) * speedMultiplier);
                } else if (this.state.direction === 'right' && this.state.movement.right && 'd' in this.pressedKeys) {
                    this.setX(this.x + (this.state.animation === 'run' ? this.runSpeed : this.speed) * speedMultiplier);
                }
        }
        GameEnv.PlayerPosition.playerX = this.x;
        GameEnv.PlayerPosition.playerY = this.y;
    }
    updateAnimation() {
        switch (this.state.animation) {
            case 'idle':
                this.setSpriteAnimation(this.playerData.idle[this.state.direction]);
                break;
            case 'walk':
                this.setSpriteAnimation(this.playerData.walk[this.state.direction]);
                break;
            case 'run':
                this.setSpriteAnimation(this.playerData.run[this.state.direction]);
                break;
            case 'jump':
                this.setSpriteAnimation(this.playerData.jump[this.state.direction]);
                break;
            default:
                console.error(`Invalid state: ${this.state.animation}`);
        }
    }
    updateAnimationState(key) {
        switch (key) {
            case 'a':
            case 'd':
                this.state.animation = 'walk';
                break;
            case 'w':
                if (this.state.movement.up === false) {
                    this.state.movement.up = true;
                    this.state.animation = 'jump';
                }
                break;
            case 's':
                if ("a" in this.pressedKeys || "d" in this.pressedKeys) {
                    this.state.animation = 'run';
                }
                break;
            default:
                this.state.animation = 'idle';
                break;
        }
    }
    handleKeyDown(event) {
        const key = event.key;
        if (!(event.key in this.pressedKeys)) {
            if (this.pressedKeys['a'] && key === 'd') {
                delete this.pressedKeys['a'];
                return;
            } else if (this.pressedKeys['d'] && key === 'a') {
                return;
            }
            if (key === 'a') {
                this.state.direction = 'left';
            } else if (key === 'd') {
                this.state.direction = 'right';
            }
            if (key === 'b' && GameEnv.wandCollected) {
                GameEnv.spellUsed = true
            }
            this.pressedKeys[event.key] = true;
            this.updateAnimationState(key);
            GameEnv.transitionHide = true;
            GameControl.startTimer();
        }
        GameEnv.updateParallaxDirection(key);
    }
    handleKeyUp(event) {
        const key = event.key;
        if (key in this.pressedKeys) {
            delete this.pressedKeys[key];
            if (Object.keys(this.pressedKeys).length > 0) {
                const lastKey = Object.keys(this.pressedKeys)[Object.keys(this.pressedKeys).length - 1];
                this.updateAnimationState(lastKey);
                GameEnv.updateParallaxDirection(lastKey);
            } else {
                this.updateAnimationState(null);
                GameEnv.updateParallaxDirection(null);
            }
        }
    }
    collisionAction() {
        this.handleCollisionStart();
        this.handleCollisionEnd();
        this.setActiveCollision();
        this.handlePlayerReaction();
    }
    handleCollisionStart() {
        this.handleCollisionEvent("jumpPlatform");
        this.handleCollisionEvent("wall");
        this.handleCollisionEvent("floor");
    }
    handleCollisionEvent(collisionType) {
        if (this.collisionData.touchPoints.other.id === collisionType) {
            if (!this.state.collisions.includes(collisionType)) {
                this.state.collisions.push(collisionType);
            }
        }
    }
    handleCollisionEnd() {
        if (this.state.collision === "floor") {
        } else if (this.state.collisions.includes(this.state.collision) && this.collisionData.touchPoints.other.id !== this.state.collision) {
            this.state.collisions = this.state.collisions.filter(collision => collision !== this.state.collision);
        }
    }
    setActiveCollision() {
        if (this.state.collisions.length > 0) {
            this.state.collision = this.state.collisions[this.state.collisions.length - 1];
        } else {
            this.state.collision = "floor";
        }
    }
    handlePlayerReaction() {
        this.gravityEnabled = true;
        switch (this.state.collision) {
            case "jumpPlatform":
                if (this.collisionData.touchPoints.this.onTopofOther) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false };
                    this.gravityEnabled = false;
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false };
                    this.y -= 4;
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false };
                    this.y -= 4;
                }
                break;
            case "wall":
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false };
                    this.gravityEnabled = false;
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false };
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false };
                }
                break;
            case "floor":
                if (this.onTop) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false };
                } else {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: true };
                }
                break;
        }
    }
}
export default PlayerBase;