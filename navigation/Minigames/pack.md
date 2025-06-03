---
layout: bootstrap
title: Pack
description: Pack Opening Game 
permalink: /pack
Author: Zach & Ian
---

<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TGDP Pack Opening Game</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
<style>
  body {
    background: linear-gradient(to right, #DBEAFE, #FEF9C3);
    text-align: center;
    font-family: 'Segoe UI', sans-serif;
  }
  .pack-btn,
  .binder-btn {
    margin: 10px;
  }
  .card-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }
  .game-card {
    width: 150px;
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  .common { animation-name: fadeIn; }
  .uncommon { animation-name: slideIn; }
  .rare { animation-name: spinIn; }
  .epic { animation-name: zoomIn; }
  .legendary { animation-name: explode; }
  .mythic { animation-name: pulse; }
  .exotic { animation-name: glow; }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @keyframes slideIn {
    from {transform: translateY(50px); opacity: 0;}
    to {transform: translateY(0); opacity: 1;}
  }
  @keyframes spinIn {
    from {transform: rotateY(360deg) scale(0); opacity: 0;}
    to {transform: rotateY(0deg) scale(1); opacity: 1;}
  }
  @keyframes zoomIn {
    from {transform: scale(0.5); opacity: 0;}
    to {transform: scale(1); opacity: 1;}
  }
  @keyframes explode {
    0% {transform: scale(0); opacity: 0;}
    50% {transform: scale(1.5); opacity: 1;}
    100% {transform: scale(1); opacity: 1;}
  }
  @keyframes pulse {
    0%, 100% {transform: scale(1);}
    50% {transform: scale(1.2);}
  }
  @keyframes glow {
    0% {box-shadow: 0 0 5px #0ff;}
    50% {box-shadow: 0 0 20px #0ff;}
    100% {box-shadow: 0 0 5px #0ff;}
  }
  .bg-purple { background-color: #6f42c1; color: white; }
  .card-img-top {
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 0.25rem;
  }
  .pack-opening {
    font-size: 2em;
    margin: 20px 0;
    animation: shake 0.5s infinite;
  }
  @keyframes shake {
    0% {transform: translate(1px, 1px);}
    25% {transform: translate(-1px, 2px);}
    50% {transform: translate(-3px, 1px);}
    75% {transform: translate(2px, 1px);}
    100% {transform: translate(1px, -1px);}
  }
  #coinBalance {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 15px;
  }
  /* Binder button orange */
  .binder-btn {
    background-color: orange !important;
    color: white !important;
    border: none !important;
  }
  /* Custom popup styles */
  .popup-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 260px;
    background: #fff;
    color: #222;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    z-index: 9999;
    padding: 24px 20px 16px 20px;
    text-align: left;
    font-size: 1.1em;
    display: none;
  }
  .popup-modal .close-btn {
    position: absolute;
    top: 8px;
    right: 14px;
    background: none;
    border: none;
    font-size: 1.5em;
    color: #888;
    cursor: pointer;
  }
  .popup-modal h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.15em;
    font-weight: bold;
  }
  .popup-modal ul {
    padding-left: 18px;
    margin-bottom: 0;
  }
  .btn-chances {
    background: #ffb6c1 !important;
    color: #b71c1c !important;
    border: none !important;
    margin-left: 10px;
    margin-right: 5px;
  }
  .btn-coins {
    background: #222 !important;
    color: #fff !important;
    border: none !important;
    margin-left: 5px;
  }
</style>
</head>
<body>
<div class="container mt-5">
  <h1>Pack Opening Game</h1>
  <div id="coinBalance">Coins: 100</div>
  <p>
    Each pack costs 10 coins.
    <button class="btn btn-chances" id="chancesBtn">Chances</button>
    <button class="btn btn-coins" id="coinsBtn">Coins</button>
  </p>
  <div id="chancesPopup" class="popup-modal">
    <button class="close-btn" onclick="closePopup('chancesPopup')">&times;</button>
    <h4>Rarity Chances</h4>
    <ul style="margin-bottom:0;">
      <li><span style="color:gray;">Common</span>: 35%</li>
      <li><span style="color:green;">Uncommon</span>: 25%</li>
      <li><span style="color:#003366;">Rare</span>: 15%</li>
      <li><span style="color:purple;">Epic</span>: 10%</li>
      <li><span style="color:orange;">Legendary</span>: 8%</li>
      <li><span style="color:red;">Mythic</span>: 5%</li>
      <li><span style="color:#00bfff;">Exotic</span>: 2%</li>
    </ul>
  </div>
  <div id="coinsPopup" class="popup-modal">
    <button class="close-btn" onclick="closePopup('coinsPopup')">&times;</button>
    <h4>Coin Rewards</h4>
    <ul style="margin-bottom:0;">
      <li><span style="color:gray;">Common</span>: 0 coins</li>
      <li><span style="color:green;">Uncommon</span>: 1 coin</li>
      <li><span style="color:#003366;">Rare</span>: 2 coins</li>
      <li><span style="color:purple;">Epic</span>: 3 coins</li>
      <li><span style="color:orange;">Legendary</span>: 5 coins</li>
      <li><span style="color:red;">Mythic</span>: 10 coins</li>
      <li><span style="color:#00bfff;">Exotic</span>: 20 coins</li>
    </ul>
  </div>
  <p>Choose a pack to open:</p>
  <button class="btn btn-success pack-btn" id="jungleBtn" onclick="openPack('jungle')">🌴 Jungle Pack</button>
  <button class="btn btn-primary pack-btn" id="oceanBtn" onclick="openPack('ocean')">🌊 Ocean Pack</button>
  <button class="btn btn-warning pack-btn" id="desertBtn" onclick="openPack('desert')">🏜️ Desert Pack</button>
  <button class="btn btn-info pack-btn" id="arcticBtn" onclick="openPack('arctic')">⛄ Arctic Pack</button>
  <button class="btn binder-btn" onclick="showBinder()">📓 Binder</button>
  <div id="openingText" class="pack-opening d-none">Opening Pack...</div>
  <div id="cardArea" class="card-container"></div>
  <div id="binderArea" class="card-container d-none"></div>
</div>

<script>
  let coins = 100;
  const packCost = 10;
  let isOpening = false;
  const collectedCards = JSON.parse(localStorage.getItem('collectedCards') || '[]');

  // --- Rarity and color definitions ---
  const rarityOrder = [
    'common',     // gray
    'uncommon',   // green
    'rare',       // dark blue
    'epic',       // purple
    'legendary',  // gold
    'mythic',     // red
    'exotic'      // light blue
  ];
  const dropRates = [0.35, 0.25, 0.15, 0.10, 0.08, 0.05, 0.02];
  const coinRewards = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 5,
    mythic: 10,
    exotic: 20
  };

  // --- Animal name pools for each pack (100 unique animals per pack) ---
  // For brevity, only a few animals are shown per rarity. Fill with your own animal names as needed.
  const animalNames = {
    arctic: {
      common: [
        "Fox", "Seal", "Hare", "Lemming", "Ptarmigan", "Snowy Owl", "Muskox", "Reindeer", "Walrus", "Narwhal",
        "Beluga", "Arctic Wolf", "Arctic Tern", "Snow Goose", "Ermine", "Wolverine", "Caribou", "Ivory Gull", "Ringed Seal", "Bearded Seal",
        "Polar Cod", "Arctic Char", "Greenland Shark", "Snow Bunting", "Arctic Skua", "Dovekie", "Little Auk", "King Eider", "Long-tailed Duck", "Ruddy Turnstone",
        "Purple Sandpiper", "Black Guillemot", "Thick-billed Murre", "Glaucous Gull", "Ross's Gull"
      ],
      uncommon: [
        "Puffin", "Lapland Longspur", "Red-throated Loon", "Northern Fulmar", "Brunnich's Guillemot", "Sabine's Gull", "Arctic Fox", "Bowhead Whale", "Harlequin Duck", "Spectacled Eider",
        "Steller's Eider", "Common Eider", "White Whale", "Greenland Halibut", "Arctic Lamprey", "Snow Sheep", "Yakutian Horse", "Yakutian Cattle", "Yakutian Laika", "Yakutian Pig",
        "Yakutian Reindeer", "Yakutian Sable", "Yakutian Hare", "Yakutian Shrew", "Yakutian Vole"
      ],
      rare: [
        "Ivory Gull", "Arctic Ground Squirrel", "Northern Pika", "Arctic Hare", "Arctic Foxhound", "Arctic Weasel", "Arctic Marten", "Arctic Stoat", "Arctic Lemming", "Arctic Shag",
        "Arctic Warbler", "Arctic Redpoll", "Arctic Bluethroat", "Arctic Pipit", "Arctic Swallow"
      ],
      epic: [
        "Greenland Wolf", "Greenland Falcon", "Greenland Caribou", "Greenland Lemming", "Greenland Hare", "Greenland Fox", "Greenland Seal", "Greenland Bear", "Greenland Goose", "Greenland Gull"
      ],
      legendary: [
        "Spirit Bear", "Ice Lynx", "Frost Owl", "Aurora Fox", "Crystal Wolf", "Blizzard Hare", "Glacier Seal", "Snowstorm Owl"
      ],
      mythic: [
        "Yeti", "Frost Phoenix", "Ice Dragon", "Aurora Unicorn", "Blizzard Griffin"
      ],
      exotic: [
        "Arctic Kirin", "Polar Leviathan"
      ]
    },
    jungle: {
      common: [
        "Monkey", "Parrot", "Toucan", "Sloth", "Tapir", "Capybara", "Agouti", "Coati", "Ocelot", "Howler Monkey",
        "Spider Monkey", "Tamarin", "Marmoset", "Macaw", "Peccary", "Armadillo", "Anteater", "Caiman", "Iguana", "Boa",
        "Tree Frog", "Leafcutter Ant", "Jaguarundi", "Paca", "Kinkajou", "Margay", "Bushmaster", "Anole", "Vine Snake", "Poison Dart Frog",
        "Harpy Eagle", "Sunbittern", "Curassow", "Guianan Cock-of-the-rock", "Manakin"
      ],
      uncommon: [
        "Jaguar", "Tiger", "Leopard", "Puma", "Civet", "Binturong", "Gibbon", "Orangutan", "Proboscis Monkey", "Saki Monkey",
        "Uakari", "Squirrel Monkey", "Red Brocket", "Sambar", "Muntjac", "Serow", "Tapeti", "Agouti Paca", "Olingo", "Olinguito",
        "Tamandua", "Giant Anteater", "Pangolin", "Aye-aye", "Fossa"
      ],
      rare: [
        "Okapi", "Quetzal", "Cassowary", "Hornbill", "Drongo", "Crowned Eagle", "Clouded Leopard", "Golden Lion Tamarin", "Cotton-top Tamarin", "Sifaka",
        "Indri", "Galago", "Potto", "Loris", "Slow Loris"
      ],
      epic: [
        "Emerald Tree Boa", "Green Anaconda", "Goliath Birdeater", "Giant River Otter", "Capuchin Monkey", "Spectacled Bear", "Jaguarundi", "Bush Dog", "Maned Wolf", "Red Uakari"
      ],
      legendary: [
        "White Tiger", "Golden Jaguar", "Rainbow Macaw", "Emerald Python", "Spirit Sloth", "Sun Parakeet", "Shadow Ocelot", "Thunder Monkey"
      ],
      mythic: [
        "Jungle Kirin", "Rainforest Dragon", "Emerald Phoenix", "Thunder Griffin", "Spirit Anaconda"
      ],
      exotic: [
        "Jungle Leviathan", "Mythic Quetzal"
      ]
    },
    ocean: {
      common: [
        "Clownfish", "Seahorse", "Turtle", "Crab", "Starfish", "Sea Urchin", "Sea Cucumber", "Jellyfish", "Shrimp", "Lobster",
        "Anchovy", "Sardine", "Mackerel", "Herring", "Cod", "Flounder", "Halibut", "Plaice", "Sole", "Skate",
        "Ray", "Dogfish", "Catfish", "Eel", "Pipefish", "Blenny", "Gobies", "Wrasse", "Parrotfish", "Butterflyfish",
        "Angelfish", "Damselfish", "Surgeonfish", "Triggerfish", "Boxfish"
      ],
      uncommon: [
        "Shark", "Dolphin", "Porpoise", "Beluga", "Narwhal", "Orca", "Pilot Whale", "Minke Whale", "Humpback Whale", "Blue Whale",
        "Fin Whale", "Sperm Whale", "Bowhead Whale", "Gray Whale", "Right Whale", "Manatee", "Dugong", "Sea Otter", "Walrus", "Sea Lion",
        "Fur Seal", "Elephant Seal", "Leopard Seal", "Weddell Seal", "Ross Seal"
      ],
      rare: [
        "Swordfish", "Marlin", "Sailfish", "Barracuda", "Giant Squid", "Colossal Squid", "Vampire Squid", "Oarfish", "Sunfish", "Mola Mola",
        "Oceanic Whitetip", "Thresher Shark", "Hammerhead", "Basking Shark", "Greenland Shark"
      ],
      epic: [
        "Manta Ray", "Mobula Ray", "Giant Manta", "Devil Ray", "Blue Ringed Octopus", "Giant Pacific Octopus", "Cuttlefish", "Nautilus", "Moray Eel", "Ribbon Eel"
      ],
      legendary: [
        "White Whale", "Golden Dolphin", "Rainbow Eel", "Spirit Shark", "Thunder Whale", "Shadow Squid", "Sunfish King", "Pearl Orca"
      ],
      mythic: [
        "Ocean Kirin", "Sea Dragon", "Abyssal Phoenix", "Storm Leviathan", "Mythic Narwhal"
      ],
      exotic: [
        "Ocean Leviathan", "Mythic Kraken"
      ]
    },
    desert: {
      common: [
        "Scorpion", "Lizard", "Camel", "Vulture", "Coyote", "Fennec Fox", "Jerboa", "Sand Cat", "Horned Viper", "Desert Hedgehog",
        "Desert Tortoise", "Gila Monster", "Roadrunner", "Jackrabbit", "Kangaroo Rat", "Sidewinder", "Desert Iguana", "Sandfish", "Monitor Lizard", "Desert Locust",
        "Dung Beetle", "Antlion", "Desert Spider", "Trapdoor Spider", "Desert Hare", "Desert Fox", "Desert Wolf", "Desert Lynx", "Desert Finch", "Desert Sparrow",
        "Desert Warbler", "Desert Wheatear", "Desert Shrike", "Desert Pipit", "Desert Lark"
      ],
      uncommon: [
        "Addax", "Oryx", "Gazelle", "Springbok", "Dromedary", "Bactrian Camel", "Sand Boa", "Horned Lizard", "Desert Monitor", "Desert Skink",
        "Desert Gecko", "Desert Cobra", "Desert Horned Viper", "Desert Racer", "Desert Chameleon", "Desert Hedgehog", "Desert Bat", "Desert Mole", "Desert Rat", "Desert Mouse",
        "Desert Jerboa", "Desert Hare", "Desert Fox", "Desert Cat", "Desert Dog"
      ],
      rare: [
        "Caracal", "Serval", "Sand Grouse", "Bustard", "Desert Eagle Owl", "Desert Falcon", "Desert Buzzard", "Desert Kite", "Desert Hawk", "Desert Raven",
        "Desert Crow", "Desert Magpie", "Desert Jay", "Desert Starling", "Desert Robin"
      ],
      epic: [
        "Sandworm", "Deathstalker", "Giant Desert Centipede", "Giant Desert Scorpion", "Giant Desert Lizard", "Giant Desert Spider", "Giant Desert Beetle", "Giant Desert Ant", "Giant Desert Locust", "Giant Desert Mantis"
      ],
      legendary: [
        "Golden Scorpion", "Golden Lizard", "Golden Camel", "Golden Vulture", "Golden Coyote", "Golden Fox", "Golden Wolf", "Golden Lynx"
      ],
      mythic: [
        "Desert Kirin", "Sand Dragon", "Sun Phoenix", "Storm Griffin", "Mythic Jackal"
      ],
      exotic: [
        "Desert Leviathan", "Mythic Sphinx"
      ]
    }
  };

  // Helper to fill up each rarity to the required count with unique names
  function fillRarity(arr, count, prefix) {
    let base = arr.slice();
    let i = 1;
    while (base.length < count) {
      base.push(`${prefix} ${i++}`);
    }
    return base.slice(0, count);
  }

  // Generate 100 unique cards per pack, split by rarity
  function generatePackCards(theme) {
    const animals = animalNames[theme];
    return [
      ...fillRarity(animals.common, 35, "Common " + theme),
      ...fillRarity(animals.uncommon, 25, "Uncommon " + theme),
      ...fillRarity(animals.rare, 15, "Rare " + theme),
      ...fillRarity(animals.epic, 10, "Epic " + theme),
      ...fillRarity(animals.legendary, 8, "Legendary " + theme),
      ...fillRarity(animals.mythic, 5, "Mythic " + theme),
      ...fillRarity(animals.exotic, 2, "Exotic " + theme)
    ].map((name, idx) => {
      let rarity;
      if (idx < 35) rarity = 'common';
      else if (idx < 60) rarity = 'uncommon';
      else if (idx < 75) rarity = 'rare';
      else if (idx < 85) rarity = 'epic';
      else if (idx < 93) rarity = 'legendary';
      else if (idx < 98) rarity = 'mythic';
      else rarity = 'exotic';
      return { name, rarity };
    });
  }

  // --- Packs with 100 unique animals each ---
  const packs = {
    arctic: generatePackCards('arctic'),
    jungle: generatePackCards('jungle'),
    ocean: generatePackCards('ocean'),
    desert: generatePackCards('desert')
  };

  // --- Card image map: use an emoji for each animal name (fallback to 🐾 if not found) ---
  const animalEmojis = {
    // Arctic
    "Fox": "🦊", "Seal": "🦭", "Hare": "🐇", "Lemming": "🐭", "Ptarmigan": "🐦", "Snowy Owl": "🦉", "Muskox": "🐂", "Reindeer": "🦌", "Walrus": "🦭", "Narwhal": "🐋",
    "Beluga": "🐋", "Arctic Wolf": "🐺", "Arctic Tern": "🐦", "Snow Goose": "🦢", "Ermine": "🐀", "Wolverine": "🦡", "Caribou": "🦌", "Ivory Gull": "🕊️", "Ringed Seal": "🦭", "Bearded Seal": "🦭",
    "Polar Cod": "🐟", "Arctic Char": "🐟", "Greenland Shark": "🦈", "Snow Bunting": "🐦", "Arctic Skua": "🐦", "Dovekie": "🐧", "Little Auk": "🐧", "King Eider": "🦆", "Long-tailed Duck": "🦆", "Ruddy Turnstone": "🐦",
    "Purple Sandpiper": "🐦", "Black Guillemot": "🐧", "Thick-billed Murre": "🐧", "Glaucous Gull": "🕊️", "Ross's Gull": "🕊️",
    // Jungle
    "Monkey": "🐒", "Parrot": "🦜", "Toucan": "🦜", "Sloth": "🦥", "Tapir": "🦛", "Capybara": "🐹", "Agouti": "🐭", "Coati": "🦝", "Ocelot": "🐆", "Howler Monkey": "🐒",
    "Spider Monkey": "🐒", "Tamarin": "🐒", "Marmoset": "🐒", "Macaw": "🦜", "Peccary": "🐗", "Armadillo": "🐾", "Anteater": "🐾", "Caiman": "🐊", "Iguana": "🦎", "Boa": "🐍",
    "Tree Frog": "🐸", "Leafcutter Ant": "🐜", "Jaguarundi": "🐆", "Paca": "🐭", "Kinkajou": "🦝", "Margay": "🐆", "Bushmaster": "🐍", "Anole": "🦎", "Vine Snake": "🐍", "Poison Dart Frog": "🐸",
    "Harpy Eagle": "🦅", "Sunbittern": "🐦", "Curassow": "🐦", "Guianan Cock-of-the-rock": "🐦", "Manakin": "🐦",
    // Ocean
    "Clownfish": "🐠", "Seahorse": "🐎", "Turtle": "🐢", "Crab": "🦀", "Starfish": "🌟", "Sea Urchin": "🦔", "Sea Cucumber": "🥒", "Jellyfish": "🎐", "Shrimp": "🦐", "Lobster": "🦞",
    "Anchovy": "🐟", "Sardine": "🐟", "Mackerel": "🐟", "Herring": "🐟", "Cod": "🐟", "Flounder": "🐟", "Halibut": "🐟", "Plaice": "🐟", "Sole": "🐟", "Skate": "🐟",
    "Ray": "🐟", "Dogfish": "🐟", "Catfish": "🐟", "Eel": "🐍", "Pipefish": "🐟", "Blenny": "🐟", "Gobies": "🐟", "Wrasse": "🐟", "Parrotfish": "🐠", "Butterflyfish": "🐠",
    "Angelfish": "🐠", "Damselfish": "🐠", "Surgeonfish": "🐠", "Triggerfish": "🐠", "Boxfish": "🐠",
    // Desert
    "Scorpion": "🦂", "Lizard": "🦎", "Camel": "🐫", "Vulture": "🦅", "Coyote": "🦊", "Fennec Fox": "🦊", "Jerboa": "🐭", "Sand Cat": "🐱", "Horned Viper": "🐍", "Desert Hedgehog": "🦔",
    "Desert Tortoise": "🐢", "Gila Monster": "🦎", "Roadrunner": "🐦", "Jackrabbit": "🐇", "Kangaroo Rat": "🐭", "Sidewinder": "🐍", "Desert Iguana": "🦎", "Sandfish": "🐟", "Monitor Lizard": "🦎", "Desert Locust": "🦗",
    "Dung Beetle": "🐞", "Antlion": "🐜", "Desert Spider": "🕷️", "Trapdoor Spider": "🕷️", "Desert Hare": "🐇", "Desert Fox": "🦊", "Desert Wolf": "🐺", "Desert Lynx": "🐱", "Desert Finch": "🐦", "Desert Sparrow": "🐦",
    "Desert Warbler": "🐦", "Desert Wheatear": "🐦", "Desert Shrike": "🐦", "Desert Pipit": "🐦", "Desert Lark": "🐦"
    // Add more as needed for all animals in your lists
  };
  
  const cardImageMap = {};
  Object.values(packs).flat().forEach(card => {
    // Center emoji, make it 0.7x the previous size, and keep the animal name below the emoji
    cardImageMap[card.name] = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:105px;width:105px;margin:auto;">
      <span style="font-size:84px;line-height:1;">${animalEmojis[card.name] || "🐾"}</span>
      <div style="font-size:1em;margin-top:2px;">${card.name}</div>
    </div>`;
  });

  // --- Rarity color mapping ---
  function getRarityColor(rarity) {
    switch (rarity) {
      case 'common': return 'secondary';   // gray
      case 'uncommon': return 'success';   // green
      case 'rare': return 'primary';       // dark blue
      case 'epic': return 'purple';        // purple
      case 'legendary': return 'warning';  // gold
      case 'mythic': return 'danger';      // red
      case 'exotic': return 'info';        // light blue
      default: return 'secondary';
    }
  }

  function getRandomRarity() {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < dropRates.length; i++) {
      cumulative += dropRates[i];
      if (rand < cumulative) return rarityOrder[i];
    }
    return 'common';
  }

  function getCardsByRarity(pack, rarity) {
    return packs[pack].filter(card => card.rarity === rarity);
  }

  function getRandomCard(pack) {
    const rarity = getRandomRarity();
    const possibleCards = getCardsByRarity(pack, rarity);
    return possibleCards[Math.floor(Math.random() * possibleCards.length)];
  }

  function openPack(pack) {
    if (isOpening) return;
    if (coins < packCost) {
      alert('Not enough coins! You received 50 more coins to keep playing.');
      coins += 50;
      updateCoins();
      return;
    }
    coins -= packCost;
    updateCoins();
    isOpening = true;
    document.getElementById('openingText').classList.remove('d-none');
    document.getElementById('cardArea').innerHTML = '';
    document.getElementById('binderArea').classList.add('d-none');

    setTimeout(() => {
      const cards = [];
      for (let i = 0; i < 5; i++) {
        cards.push(getRandomCard(pack));
      }
      displayCards(cards);
      isOpening = false;
      document.getElementById('openingText').classList.add('d-none');
    }, 1500);
  }

  function getPackIcon(pack) {
    switch (pack) {
      case 'jungle': return '🌴';
      case 'ocean': return '🌊';
      case 'desert': return '🏜️';
      case 'arctic': return '⛄';
      default: return '';
    }
  }

  function displayCards(cards) {
    const cardArea = document.getElementById('cardArea');
    cardArea.innerHTML = '';
    let coinsEarned = 0;
    // Find which pack was opened by checking the last opened pack button
    let lastPack = null;
    // Try to infer from the last opened pack button (since openPack is called with the pack name)
    // We'll store the last opened pack in a variable
    if (displayCards.lastPack) lastPack = displayCards.lastPack;

    cards.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = `card game-card border border-${card.rarity} bg-light shadow-sm`;
      cardDiv.style.width = '150px';

      // Use emoji HTML for image (centered, smaller, name below)
      let imgHtml = cardImageMap[card.name];

      // Find the pack for this card (since all cards in a pack opening are from the same pack)
      let packIcon = lastPack ? getPackIcon(lastPack) : '';

      cardDiv.innerHTML = `
        ${imgHtml}
        <div class="card-body p-2" style="padding-top:0;">
          <p class="card-text mb-0" style="margin:0;">
            <span class="badge bg-${getRarityColor(card.rarity)}">
              ${capitalize(card.rarity)}
              <span style="margin-left:6px;">${packIcon}</span>
            </span>
          </p>
        </div>
      `;
      cardDiv.classList.add(card.rarity);
      cardArea.appendChild(cardDiv);

      // Add to binder and localStorage
      addToBinder(card);

      // Add coin reward for this card
      coinsEarned += coinRewards[card.rarity] || 0;
    });

    // Show coin reward and update balance
    if (coinsEarned > 0) {
      const rewardDiv = document.createElement('div');
      rewardDiv.style.fontWeight = 'bold';
      rewardDiv.style.fontSize = '1.2em';
      rewardDiv.style.marginTop = '10px';
      rewardDiv.textContent = `You earned ${coinsEarned} coin${coinsEarned === 1 ? '' : 's'} from this pack!`;
      cardArea.appendChild(rewardDiv);
    }
    coins += coinsEarned;
    updateCoins();
  }

  // Patch openPack to remember the last opened pack for displayCards
  const _openPack = openPack;
  openPack = function(pack) {
    displayCards.lastPack = pack;
    return _openPack.apply(this, arguments);
  };

  function addToBinder(card) {
    // Track the last 50 opened cards in localStorage
    let lastOpened = JSON.parse(localStorage.getItem('lastOpenedCards') || '[]');
    lastOpened.push(card);
    if (lastOpened.length > 50) lastOpened = lastOpened.slice(-50);
    localStorage.setItem('lastOpenedCards', JSON.stringify(lastOpened));
  }

  function showBinder() {
    const binderArea = document.getElementById('binderArea');
    const cardArea = document.getElementById('cardArea');
    cardArea.innerHTML = '';
    binderArea.innerHTML = '';
    binderArea.classList.remove('d-none');

    // Get the last 50 opened cards from localStorage, most recent first
    let lastOpened = JSON.parse(localStorage.getItem('lastOpenedCards') || '[]');
    if (lastOpened.length === 0) {
      binderArea.innerHTML = '<p>No cards opened yet.</p>';
      return;
    }
    lastOpened = lastOpened.slice().reverse(); // Most recent first

    // Helper to find which pack a card is from
    function findPackForCard(card) {
      for (const packName of Object.keys(packs)) {
        if (packs[packName].some(c => c.name === card.name && c.rarity === card.rarity)) {
          return packName;
        }
      }
      return null;
    }

    // Show 5 cards per line, up to 10 lines, card size same as pack opening (150px)
    for (let i = 0; i < Math.min(10, Math.ceil(lastOpened.length / 5)); i++) {
      const rowDiv = document.createElement('div');
      rowDiv.style.display = 'flex';
      rowDiv.style.justifyContent = 'center';
      rowDiv.style.gap = '10px';
      for (let j = 0; j < 5; j++) {
        const idx = i * 5 + j;
        if (idx >= lastOpened.length) break;
        const card = lastOpened[idx];
        const cardDiv = document.createElement('div');
        cardDiv.className = `card game-card border border-${card.rarity} bg-light shadow-sm`;
        cardDiv.style.width = '150px';

        // Use emoji HTML for image (centered, smaller, name below)
        let imgHtml = cardImageMap[card.name];

        // Find the pack for this card
        let packName = findPackForCard(card);
        let packIcon = packName ? getPackIcon(packName) : '';

        cardDiv.innerHTML = `
          ${imgHtml}
          <div class="card-body p-2" style="padding-top:0;">
            <span class="badge bg-${getRarityColor(card.rarity)}" style="font-size:1em;">
              ${capitalize(card.rarity)}
              <span style="margin-left:6px;">${packIcon}</span>
            </span>
          </div>
        `;
        rowDiv.appendChild(cardDiv);
      }
      binderArea.appendChild(rowDiv);
    }
  }

  function updateCoins() {
    document.getElementById('coinBalance').textContent = `Coins: ${coins}`;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Popup logic for Chances and Coins
  document.getElementById('chancesBtn').onclick = function() {
    document.getElementById('chancesPopup').style.display = 'block';
  };
  document.getElementById('coinsBtn').onclick = function() {
    document.getElementById('coinsPopup').style.display = 'block';
  };
  function closePopup(id) {
    document.getElementById(id).style.display = 'none';
  }

  updateCoins();
</script>
</body>
</html>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/11confrontingmyself.mp3'); // Change path as needed
music.loop = true;
music.volume = 0.5;

// Play music after first user interaction (required by browsers)
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);
</script>
