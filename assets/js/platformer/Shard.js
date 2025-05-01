import BossFight from './BossFight.js';
import GameControl from './GameControl.js';
import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class Shard extends GameObject {
    constructor(canvas, image, data) {
        super(canvas, image, data, 0.5, 0.5);
        this.coinX = Math.random() * GameEnv.innerWidth;
        this.coinY = 0.5 + Math.random() * 0.5; // Limit to bottom half of screen
        this.size();
        this.id = this.initiateId();
    }

    initiateId() {
        const currentCoins = GameEnv.gameObjects

        return currentCoins.length //assign id to the coin's position in the gameObject Array (is unique to the coin)
    }

    // Required, but no update action
    update() {
        this.collisionChecks()
    }

    // Draw position is always 0,0
    draw() {
        // Save the current transformation matrix
        this.ctx.save();

        // Rotate the canvas 90 degrees to the left
        this.ctx.rotate(-Math.PI / 2);

        // Draw the image at the rotated position (swap x and y)
        this.ctx.drawImage(this.image, -this.image.height, 0);

        // Restore the original transformation matrix
        this.ctx.restore();
    }

    // Center and set Coin position with adjustable height and width
    size() {
        if (this.id) {
            if (GameEnv.claimedCoinIds.includes(this.id)) {
                this.hide()
            }
        }

        const scaledWidth = this.image.width * 0.2;
        const scaledHeight = this.image.height * 0.169;

        const coinX = this.coinX;
        const coinY = (GameEnv.bottom - scaledHeight) * this.coinY;

        // Set variables used in Display and Collision algorithms
        this.bottom = coinY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${coinX}px`;
        this.canvas.style.top = `${coinY}px`;
    }
    collisionAction() {
        // check player collision
        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.id) {
            GameEnv.claimedCoinIds.push(this.id);
            }
            this.destroy();

            GameControl.gainCoin(5);
            GameEnv.playSound("coin");
            
            console.log("Shard colleted");
            const boss = GameEnv.gameObjects.find(obj => obj instanceof BossFight);
            if (boss) {
                boss.currentHp -= 50;
                console.log("Boss damaged by shard");
            }
        }
    }
    
    // Method to hide the coin
    hide() {
        this.canvas.style.display = 'none';
    }

    // Method to show the coin
    show() {
        this.canvas.style.display = 'block';
    }

    reset() {
        this.coinX =Math.random() * GameEnv.innerWidth;
        this.coinY = 0.5 + Math.random() * 0.5;
        this.size();
        this.show();
    }
}

export default Shard;