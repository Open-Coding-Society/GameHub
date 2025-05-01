import Background from './Background.js';

export class BackgroundSnowfall extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);
        this.snowflakes = [];
        this.snowflakeImage = new Image();
        this.snowflakeImage.src = 'images/platformer/backgrounds/bee__1_-removebg-preview.png'; // Correct path to the image
        this.snowflakeImage.onload = () => {
            console.log('Snowflake image loaded successfully');
            this.createSnowflakes();
        };
        this.snowflakeImage.onerror = (error) => {
            console.error('Failed to load snowflake image:', error);
            console.error('Image source:', this.snowflakeImage.src);
        };
    }

    createSnowflakes() {
        for (let i = 0; i < 10; i++) { // Number of snowflakes
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 4.5 + 3.0, // Size of snowflakes
                speed: Math.random() * 0.5 + 0.2 // Speed of snowflakes
            });
        }
    }

    update() {
        for (let flake of this.snowflakes) {
            flake.x -= flake.speed;
            if (flake.x < 0) {
                flake.x = this.canvas.width;
                flake.y = Math.random() * this.canvas.height;
            }
        }
        super.update();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let flake of this.snowflakes) {
            this.ctx.drawImage(this.snowflakeImage, flake.x, flake.y, flake.radius * 2, flake.radius * 2);
        }
        super.draw();
    }
}

export default BackgroundSnowfall;
