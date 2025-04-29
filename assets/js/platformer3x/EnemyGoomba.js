import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Goomba extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + (xPercentage * GameEnv.innerWidth * 0.7); // Restricted range to 70%

        this.immune = 0;

        //Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.2 + 1.3); // Slightly more restricted range
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2.3);
        } else {
            this.speed = this.speed * 3.5; // Reduced speed multiplier
        }
    }

    update() {
        super.update();
        
        // Check for boundaries with slight buffer
        if (this.x <= this.minPosition + 5 || (this.x + this.canvasWidth >= this.maxPosition - 5)) {
            this.speed = -this.speed;
        };

        //Random Event 2: Time Stop All Goombas
        if (GameControl.randomEventId === 2 && GameControl.randomEventState === 1) {
            this.speed = 0;
            if (this.name === "goombaSpecial") {
                GameControl.endRandomEvent();
            };
        };

        //Random Event 3: Kill a Random Goomba
        if (GameControl.randomEventId === 3 && GameControl.randomEventState === 1) {
            this.destroy();
            GameControl.endRandomEvent();
        };

        // Every so often change direction
        switch(GameEnv.difficulty) {
            case "normal":
                if (Math.random() < 0.002) this.speed = -this.speed; // Lowered probability
                break;
            case "hard":
                if (Math.random() < 0.005) this.speed = -this.speed; // Lowered probability
                break;
            case "impossible":
                if (Math.random() < 0.01) this.speed = -this.speed; // Lowered probability
                break;
        }

         //Chance for Goomba to turn Gold
         if (["normal","hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }
        }
        
        //Immunize Goomba & Texture It
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
            // Collision: Top of Goomba with Bottom of Player
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce = true;
                this.explode()
                GameEnv.playSound("goombaDeath");

                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                }).bind(this), 1500);

                setTimeout(function () {
                this.destroy();
                GameEnv.invincible = false;
                }, 2000);
            }
        }

        if (this.collisionData.touchPoints.other.id === "goomba") {
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
            shard.style.backgroundColor = 'brown'; // color of the shards
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

export default Goomba;
