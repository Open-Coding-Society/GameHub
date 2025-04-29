import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Fishies extends Character {
    // Constructor sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        // Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        // Initial Position of Fishies
        this.x = xPercentage * GameEnv.innerWidth;

        // Access in which a Fishies can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;

        // Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 3 + 3);
        } else {
            this.speed = this.speed * 5;
        }
    }

    update() {
        super.update();
        
        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        };

        // Random Event 2: Time Stop All Fishies
        if (GameControl.randomEventId === 2 && GameControl.randomEventState === 1) {
            this.speed = 0;
            if (this.name === "fishiesSpecial") {
                GameControl.endRandomEvent();
            };
        };

        // Random Event 3: Kill a Random Fishies
        // Whichever Fishies receives this message first will die, then end the event so the others don't die
        if (GameControl.randomEventId === 3 && GameControl.randomEventState === 1) {
            this.destroy();
            GameControl.endRandomEvent();
        };

        // Every so often change direction
        switch(GameEnv.difficulty) {
            case "normal":
                if (Math.random() < 0.005) this.speed = -this.speed;
                break;
            case "hard":
                if (Math.random() < 0.01) this.speed = -this.speed;
                break;
            case "impossible":
                if (Math.random() < 0.02) this.speed = -this.speed;
                break;
        }

         // Chance for Fishies to turn Gold
         if (["normal","hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }
        }
        
        // Immunize Fishies & Texture It
        if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
                this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
            this.immune = 1;
        }

        // Move the enemy
        this.x -= this.speed;
        // Randomly trigger a jump (increased probability)
        if (Math.random() < 0.1) { // Adjust the probability as needed
            this.jump();
        }
        this.playerBottomCollision = false;
    }
    
    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "finishline") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }

        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision: Top of Fishies with Bottom of Player
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.fishiesBounce = true;
                this.explode()
                GameEnv.playSound("fishiesDeath");

                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                }).bind(this), 1500);

                // Set a timeout to make GameEnv.invincible false after 2000 milliseconds (2 seconds)
                setTimeout(function () {
                this.destroy();
                GameEnv.invincible = false;
                }, 2000);
            }
        }

        if (this.collisionData.touchPoints.other.id === "fishies") {
            if (GameEnv.difficulty !== "impossible" && (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right)) {
                this.speed = -this.speed;      
            }
        }
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }
     // Define the explosion action
     explode() {
        const shards = 10; // number of shards
        for (let i = 0; i < shards; i++) {
            const shard = document.createElement('div');
            shard.style.position = 'absolute';
            shard.style.width = '5px';
            shard.style.height = '5px';
            shard.style.backgroundColor = 'blue'; // color of the shards
            shard.style.left = `${this.x}px`;
            shard.style.top = `${this.y}px`;
            this.canvas.parentElement.appendChild(shard); // add shard to the canvas container

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;

            const shardX = Math.cos(angle) * speed;
            const shardY = Math.sin(angle) * speed;

            shard.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${shardX * 20}px, ${shardY * 20}px)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out',
                fill: 'forwards'
            });

            setTimeout(() => {
                shard.remove();
            }, 1000);
        }
        this.canvas.style.opacity = 0;
    }

    // Define the jump action
    jump() {
        // Implement your jump logic here
        // For example, change the y position or apply a vertical velocity
    }
}

export default Fishies;
