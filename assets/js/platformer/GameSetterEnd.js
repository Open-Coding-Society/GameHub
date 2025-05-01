// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'

// Define the assets
const assets = {  
  backgrounds: {
    end: { src: "/images/platformer/backgrounds/scripps_start.png" },
  },
};

// Game Level defintion...
const objects = [
  // GameObject(s), the order is important to z-index...
  { name: 'end', id: 'background', class: Background, data: assets.backgrounds.end },
];

const GameSetterEnd = {
  tag: 'End',
  assets: assets,
  objects: objects
};

export default GameSetterEnd;
