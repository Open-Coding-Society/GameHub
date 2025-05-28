---
layout: bootstrap
title: Pack
description: Pack Opening Game 
permalink: /pack
Author: Aarush
---

<meta charset="UTF-8" />
<title>:feet: TGDP Pack Opening Game</title>
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
  .common {
    animation-name: fadeIn;
  }
  .uncommon {
    animation-name: slideIn;
  }
  .rare {
    animation-name: spinIn;
  }
  .legendary {
    animation-name: explode;
  }
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
  @keyframes explode {
    0% {transform: scale(0); opacity: 0;}
    50% {transform: scale(1.5); opacity: 1;}
    100% {transform: scale(1);}
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
  .card-img-top {
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 0.25rem;
  }
  #coinBalance {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 15px;
  }
</style>
<div class="container mt-5">
  <h1>:feet: TGDP Pack Opening</h1>
  <div id="coinBalance">Coins: 100</div>
  <p>Each pack costs 5 coins.</p>
  <p>Choose a pack to open:</p>
  <button class="btn btn-success pack-btn" id="jungleBtn" onclick="openPack('jungle')">Jungle Pack</button>
  <button class="btn btn-primary pack-btn" id="oceanBtn" onclick="openPack('ocean')">Ocean Pack</button>
  <button class="btn btn-warning pack-btn" id="desertBtn" onclick="openPack('desert')">Desert Pack</button>
  <button class="btn btn-info pack-btn" id="arcticBtn" onclick="openPack('arctic')">Arctic Pack</button>
  <button class="btn btn-warning binder-btn" onclick="showBinder()">:ledger: Binder</button>
  <div id="openingText" class="pack-opening d-none">Opening Pack...</div>
  <div id="cardArea" class="card-container"></div>
  <div id="binderArea" class="card-container d-none"></div>
</div>
<script>
  let coins = 100;
  const packCost = 5;
  const packs = {
    jungle: [
      { name: 'Leafy Lemur', rarity: 'common' },
      { name: 'Jungle Squirrel', rarity: 'common' },
      { name: 'Tree Tamarin', rarity: 'uncommon' },
      { name: 'Vine Panther', rarity: 'rare' },
      { name: 'Jungle King', rarity: 'legendary' }
    ],
    ocean: [
      { name: 'Bubble Fish', rarity: 'common' },
      { name: 'Sea Otter', rarity: 'uncommon' },
      { name: 'Coral Crab', rarity: 'common' },
      { name: 'Sharkfin Ray', rarity: 'rare' },
      { name: 'Leviathan', rarity: 'legendary' }
    ],
    desert: [
      { name: 'Sand Scorpion', rarity: 'common' },
      { name: 'Dune Lizard', rarity: 'common' },
      { name: 'Cactus Hare', rarity: 'uncommon' },
      { name: 'Desert Fox', rarity: 'rare' },
      { name: 'Sand Serpent', rarity: 'legendary' }
    ],
    arctic: [
      { name: 'Snow Hare', rarity: 'common' },
      { name: 'Ice Owl', rarity: 'uncommon' },
      { name: 'Polar Fox', rarity: 'rare' },
      { name: 'Glacier Bear', rarity: 'legendary' },
      { name: 'Frost Wolf', rarity: 'rare' }
    ]
  };
  const cardImageMap = {
    'Leafy Lemur': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Blue-eyed_lemur.jpg',
    'Jungle Squirrel': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Red-bellied_Squirrel.JPG',
    'Tree Tamarin': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Golden_Lion_Tamarin_Rio_de_Janeiro_Zoo.jpg',
    'Vine Panther': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Jaguar_1.jpg',
    'Jungle King': 'https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg',
    'Bubble Fish': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Blue_tang_fish_2.jpg',
    'Sea Otter': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Sea_otter_with_kelp.jpg',
    'Coral Crab': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Xanthidae_Crab.jpg',
    'Sharkfin Ray': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Sharkray_Cephalopterus_latirostris_2.jpg',
    'Leviathan': 'https://upload.wikimedia.org/wikipedia/commons/3/37/Blue_Whale_2008-10-24_11-31-57.jpg',
    'Sand Scorpion': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Desert_Scorpion.jpg',
    'Dune Lizard': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Dune_lizard.jpg',
    'Cactus Hare': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Desert_Jackrabbit.jpg',
    'Desert Fox': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Fennec_Fox_2010_2.JPG',
    'Sand Serpent': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Sidewinder_Mojave_desert.jpg',
    'Snow Hare': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Lepus_timidus.jpg',
    'Ice Owl': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Snowy_Owl_-_Alaska.jpg',
    'Polar Fox': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Arctic_Fox_-_Alaska.jpg',
    'Glacier Bear': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Polar_bear_-_Alaska.jpg',
    'Frost Wolf': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Wolf_on_Snow.jpg'
  };
  const collectedCards = [];
  function getImageUrlForName(name) {
    return cardImageMap[name] || 'https://via.placeholder.com/150?text=No+Image';
  }
  // Coin rewards per rarity
  const coinRewards = {
    common: 1,
    uncommon: 3,
    rare: 7,
    legendary: 15
  };
  function getRandomCard(pack) {
    const rand = Math.random();
    let rarity;
    if (rand < 0.6) rarity = 'common';
    else if (rand < 0.85) rarity = 'uncommon';
    else if (rand < 0.97) rarity = 'rare';
    else rarity = 'legendary';
    const candidates = pack.filter(c => c.rarity === rarity);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  function updateCoinDisplay() {
    document.getElementById('coinBalance').textContent = `Coins: ${coins}`;
    // Disable buttons if coins are insufficient
    ['jungleBtn', 'oceanBtn', 'desertBtn', 'arcticBtn'].forEach(id => {
      document.getElementById(id).disabled = coins < packCost;
    });
  }
  function openPack(type) {
    if (coins < packCost) {
      alert("You don't have enough coins to open this pack!");
      return;
    }
    coins -= packCost;
    updateCoinDisplay();
    disableButtons();
    const cardArea = document.getElementById('cardArea');
    const openingText = document.getElementById('openingText');
    const binderArea = document.getElementById('binderArea');
    binderArea.classList.add('d-none');
    cardArea.innerHTML = '';
    openingText.classList.remove('d-none');
    setTimeout(() => {
      openingText.classList.add('d-none');
      const cards = [];
      for (let i = 0; i < 6; i++) {
        cards.push(getRandomCard(packs[type]));
      }
      let totalReward = 0;
      cards.forEach((card, index) => {
        setTimeout(() => {
          const cardDiv = document.createElement('div');
          cardDiv.className = `card game-card ${card.rarity}`;
          const imgUrl = getImageUrlForName(card.name);
          cardDiv.innerHTML = `
            <img src="${imgUrl}" class="card-img-top" alt="${card.name}" width="150" height="150" />
            <div class="card-body">
              <h5 class="card-title">${card.name}</h5>
              <span class="badge bg-${rarityColor(card.rarity)}">${card.rarity.toUpperCase()}</span>
            </div>`;
          cardArea.appendChild(cardDiv);
          saveToBinder(card);
          totalReward += coinRewards[card.rarity] || 0;
          // After last card shown, add reward coins and update display
          if(index === cards.length - 1) {
            coins += totalReward;
            setTimeout(() => {
              alert(`You earned ${totalReward} coins from this pack!`);
              updateCoinDisplay();
              enableButtons();
            }, 400);
          }
        }, index * 400);
      });
    }, 1000);
  }
  function rarityColor(rarity) {
    return {
      common: 'secondary',
      uncommon: 'success',
      rare: 'info',
      legendary: 'warning'
    }[rarity];
  }
  function disableButtons() {
    ['jungleBtn', 'oceanBtn', 'desertBtn', 'arcticBtn'].forEach(id => {
      document.getElementById(id).disabled = true;
    });
  }
  function enableButtons() {
    updateCoinDisplay();
  }
  function saveToBinder(card) {
    if (!collectedCards.find(c => c.name === card.name)) {
      collectedCards.push(card);
    }
  }
  function showBinder() {
    const cardArea = document.getElementById('cardArea');
    const binderArea = document.getElementById('binderArea');
    binderArea.innerHTML = '';
    cardArea.innerHTML = '';
    binderArea.classList.remove('d-none');
    collectedCards.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = `card game-card ${card.rarity}`;
      const imgUrl = getImageUrlForName(card.name);
      cardDiv.innerHTML = `
        <img src="${imgUrl}" class="card-img-top" alt="${card.name}" width="150" height="150" />
        <div class="card-body">
          <h5 class="card-title">${card.name}</h5>
          <span class="badge bg-${rarityColor(card.rarity)}">${card.rarity.toUpperCase()}</span>
        </div>`;
      binderArea.appendChild(cardDiv);
    });
  }
  // Initialize coin display on load
  updateCoinDisplay();
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

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