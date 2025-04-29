import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class BlockPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;

        // Add glow effect
        // Change the value of enableGlow to toggle glow
        let enableGlow = false;

        if (enableGlow) {
            this.canvas.style.boxShadow = "0 0 10px 5px rgba(0, 255, 255, 0.7)";
        } else {
            this.canvas.style.boxShadow = "0 0 0px 0px rgba(0, 255, 255, 0.7)";
        }
    }

    // Required, but no update action
    update() {
        //console.log(this.platformY)
        this.collisionChecks();
    }

    collisionAction() {
            // Collision only applies to the item block when Mario collides with it
            if (this.collisionData.touchPoints.other.id === "player" && this.name === "itemBlock2") {
                this.handleItemBlockCollision();
            }
        }
    
    handleItemBlockCollision() {
        // Make the item block disappear by hiding it
        this.isVisible = false;
        // Update status of key
        GameEnv.powerUpCollected = true
        // Remove the block from the display
        this.canvas.style.display = 'none';
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;  // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        //this.canvas.width = this.width;
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }
}

export default BlockPlatform;