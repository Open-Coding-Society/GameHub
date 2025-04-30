// GameSetHills.js Key objective is to define objects for a GameLevel
import BackgroundParallax from './BackgroundParallax.js';
import BackgroundScripps from './BackgroundScripps.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import PlayerWinter from './PlayerWinter.js';
import Goomba from './EnemyGoomba.js';
import FlyingGoomba from './FlyingGoomba.js';
import Mushroom from './Mushroom.js';
import FinishLine from './FinishLine.js';
import BlockPlatform from './BlockPlatform.js';
import Trash from './Trash.js'

// Define the GameSetup object literal
const assets = {  
  obstacles: {
    trash: { 
    src: "/images/platformer/sprites/pill.png", 
    width: 225, // Adjust based on the desired base width
    height: 225, // Adjust based on the aspect ratio of the image
    scaleSize: 80, // Adjust to control the scaling factor
    },
    cabin: {
      src: "/images/platformer/cave.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 150,
    },      
  },
  platforms: {
    grass: { src: "/images/platformer/platforms/snowyfloor.png" },
    bricks: { src: "/images/platformer/platforms/brick_wall.png" },
    block: { src: "/images/platformer/platforms/cobblestone.png" }, 
  },
  backgrounds: {
    hills: { src: "/images/platformer/backgrounds/beefall.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    mountains: { src: "/images/platformer/backgrounds/scripps.jpg", parallaxSpeed: 0.1, moveOnKeyAction: true },
    clouds: { src: "/images/platformer/backgrounds/clouds.png", parallaxSpeed: 0.5 },
  },
  transitions: {
    loading: { src: "/images/platformer/transitions/greenscreen.png" },
  },
  players: {
    mario: {
    src: "/images/platformer/sprites/white_mario.png",
    width: 256,
    height: 256,
    scaleSize: 80,
    speedRatio: 0.7,
    idle: {
      left: { row: 1, frames: 15 },
      right: { row: 0, frames: 15 },
    },
    walk: {
      left: { row: 3, frames: 7 },
      right: { row: 2, frames: 7 },
    },
    run: {
      left: { row: 5, frames: 15 },
      right: { row: 4, frames: 15 },
    },
    jump: {
      left: { row: 11, frames: 15 },
      right: { row: 10, frames: 15 },
    },
    hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  },
  enemies: {
    goomba: {
    src: "/images/platformer/sprites/viruses.png",
    width: 448,
    height: 452,
    scaleSize: 60,
    speedRatio: 0.7,
    xPercentage: 0.6,
    hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
    },
    flyingGoomba: {
    src: "/images/platformer/sprites/viruses.png",
    width: 448,
    height: 452,
    scaleSize: 60,
    speedRatio: 0.7,
    },
    mushroom: {
    src: "/images/platformer/platforms/medicine.png",
    width: 280,
    height: 180,
    hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
    },
  }
  };

  // Hills Game Level defintion...
  const objects = [
  { name: 'mountains', id: 'background', class: BackgroundScripps, data: assets.backgrounds.mountains },
  { name: 'clouds', id: 'background', class: BackgroundParallax, data: assets.backgrounds.clouds },
  { name: 'hills', id: 'background', class: BackgroundParallax, data: assets.backgrounds.hills },
  { name: 'grass', id: 'floor', class: Platform, data: assets.platforms.grass },
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.1, yPercentage: 1},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.067, yPercentage: 0.55},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.1, yPercentage: 0.55},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.03, yPercentage: 0.55},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.1, yPercentage: 0.76 },
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.31, yPercentage: 0.8},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.3475, yPercentage: 0.8},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.3775, yPercentage: 0.8},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.525, yPercentage: 0.85},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.5625, yPercentage: 0.85},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.5999, yPercentage: 0.85},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2752, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.3126, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.35, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.3825, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.4125, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.4425, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.48, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.5174, yPercentage: 0.4},
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.5548, yPercentage: 0.4},
  { name: 'blocks', id: 'wall', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.7, yPercentage: 1 },
  { name: 'goomba', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05 },
  { name: 'goomba', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.45, yPercentage: 0.35, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
  { name: 'goomba', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
  { name: 'goomba', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
  { name: 'goomba', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"] },
  { name: 'goomba', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"] },
  { name: 'goombaSpecial', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.75, yPercentage: 1, minPosition: 0.5 }, // special name is used for random event 2 to make sure that only one of the Goombas ends the random event
  { name: 'goombaSpecial', id: '', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
  { name: 'flyingGoomba', id: '', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] },
  { name: 'flyingGoomba', id: '', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["hard", "impossible"] },
  { name: 'flyingGoomba', id: '', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["impossible"] },
  { name: 'mushroom', id: '', class: Mushroom, data: assets.enemies.mushroom, xPercentage: 0.4, yPercentage: 0.65 },
  { name: 'trash', id: 'trash', class: Trash, data: assets.obstacles.trash, xPercentage: 0.09, yPercentage: 0.88 },  
  { name: 'trash', id: 'trash', class: Trash, data: assets.obstacles.trash, xPercentage: 0.057, yPercentage: 0.4},
  { name: 'trash', id: 'trash', class: Trash, data: assets.obstacles.trash, xPercentage: 0.69, yPercentage: 0.88 },
  { name: 'trash', id: 'trash', class: Trash, data: assets.obstacles.trash, xPercentage: 0.55, yPercentage: 0.69}, 
  { name: 'mario', id: 'player', class: PlayerWinter, data: assets.players.mario },
  { name: 'loading', id: 'background', class: BackgroundTransitions, data: assets.transitions.loading },
  ];

  const GameSetHills = {
  tag: 'Hills',
  assets: assets,
  objects: objects
  };

export default GameSetHills;