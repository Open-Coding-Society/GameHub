import FlyingEnemy from './FlyingEnemy.js';

export class FancyTurtle extends FlyingEnemy {
    /**
     * Constructor sets up the FancyTurtle object
     * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
     * @param {HTMLImageElement} image - The image sprite for the FancyTurtle.
     * @param {Object} data - Sprite sheet data for animations.
     * @param {number} xPercentage - Initial X position as a percentage of canvas width.
     * @param {number} yPercentage - Initial Y position as a percentage of canvas height.
     * @param {string} name - Name of the character.
     * @param {number} minPosition - Minimum position boundary for movement.
     */
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);
        this.initFancyBehavior(); // Add turtle-specific behaviors
    }

    /**
     * Initializes unique FancyTurtle behavior or properties
     */
    initFancyBehavior() {
        this.isGlowing = true; // Example property: the turtle glows
        this.speedMultiplier = 1.5; // Moves faster than a normal enemy
    }

    /**
     * Updates the FancyTurtle's state on each frame
     */
    update() {
        super.update(); // Call the parent class's update method
        this.animateGlow(); // Additional behavior: glowing effect
    }

    /**
     * Adds a glowing animation effect to the FancyTurtle
     */
    animateGlow() {
        if (this.isGlowing) {
            const ctx = this.canvas.getContext('2d');
            ctx.save();
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 300) * 0.5; // Pulsating glow effect
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
}

export default FancyTurtle;
