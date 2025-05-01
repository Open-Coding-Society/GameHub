import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class Tube extends GameObject {
    constructor(canvas, image) {
        super(canvas, image, 0);
    }

    // Required, but no update action
    update() {
    }

    // Draw position is always 0,0
    draw() {
        // Define the cropping area (source rectangle)
        const cropX = 0; // Start cropping from the left
        const cropY = 0; // Start cropping from the top
        const cropWidth = this.image.width; // Full width of the image
        const cropHeight = this.image.height; // Full height of the image
    
        // Define the destination area (where to draw on the canvas)
        const destX = 0; // Draw at the top-left corner of the canvas
        const destY = 0; // Draw at the top-left corner of the canvas
        const destWidth = this.canvas.width; // Scale to the canvas width
        const destHeight = this.canvas.height; // Scale to the canvas height
    
        // Draw the cropped image onto the canvas
        this.ctx.drawImage(
            this.image,       // Source image
            cropX, cropY,     // Top-left corner of the cropping area
            cropWidth, cropHeight, // Width and height of the cropping area
            destX, destY,     // Top-left corner of the destination area
            destWidth, destHeight // Width and height of the destination area
        );
    }

    // Set Tube position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerHeight * (100 / 832);
        // Formula for Width is scaled: scaledWidth/scaledHeight == this.width/this.height
        const scaledWidth = scaledHeight * this.aspect_ratio;
        const tubeX = .80 * GameEnv.innerWidth;
        const tubeY = (GameEnv.bottom - scaledHeight);

        // set variables used in Display and Collision algorithms
        this.bottom = tubeY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
    
        //this.canvas.width = this.width; 
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${tubeX}px`;
        this.canvas.style.top = `${tubeY}px`; 

    }
}

export default Tube;