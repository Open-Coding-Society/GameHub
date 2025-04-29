// imports go below
import GameEnv from './GameEnv.js';
import Coin from './Coin.js';

export class Trash extends Coin {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data, xPercentage, yPercentage);
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = yPercentage * GameEnv.bottom;
        this.size();
        this.id = this.initiateId()
        this.scaleSize = data?.scaleSize || 80;
    }
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }
    size() {
        if (this.id) {
            if (GameEnv.trashCount.includes(this.id)) {
                this.hide()
            }
        }
        const scaledHeight = GameEnv.innerHeight * (this.scaleSize / 832);
        const scaledWidth = scaledHeight * this.aspect_ratio;
        const coinX = this.coinX;
        const coinY = (GameEnv.bottom - scaledHeight) * this.coinY;

        // Set variables used in Display and Collision algorithms
        this.bottom = coinY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
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
                GameEnv.trashCount.push(this.id)
            }
           // this is how you find the index of the coin - GameEnv.gameObjects.findIndex(coin => coin.id === this.id)
            this.destroy();

            GameEnv.playSound("coin");

            
        }
    }
}
export default Trash;