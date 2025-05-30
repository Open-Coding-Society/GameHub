---
layout: bootstrap
title: Pack
description: Pack Opening Game 
permalink: /pack
Author: Aarush & Ian
---

<meta charset="UTF-8" />
<title>👣 TGDP Pack Opening Game</title>
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
    100% {transform: scale(1); opacity: 1;}
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
  <h1>👣 TGDP Pack Opening</h1>
  <div id="coinBalance">Coins: 100</div>
  <p>Each pack costs 5 coins.</p>
  <p>Choose a pack to open:</p>
  <button class="btn btn-success pack-btn" id="jungleBtn" onclick="openPack('jungle')">Jungle Pack</button>
  <button class="btn btn-primary pack-btn" id="oceanBtn" onclick="openPack('ocean')">Ocean Pack</button>
  <button class="btn btn-warning pack-btn" id="desertBtn" onclick="openPack('desert')">Desert Pack</button>
  <button class="btn btn-info pack-btn" id="arcticBtn" onclick="openPack('arctic')">Arctic Pack</button>
  <button class="btn btn-warning binder-btn" onclick="showBinder()">📓 Binder</button>
  <div id="openingText" class="pack-opening d-none">Opening Pack...</div>
  <div id="cardArea" class="card-container"></div>
  <div id="binderArea" class="card-container d-none"></div>
</div>
<script>
  let coins = 100;
  const packCost = 5;
  let isOpening = false;
  const collectedCards = JSON.parse(localStorage.getItem('collectedCards') || '[]');

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
    'Leafy Lemur': '{{site.baseurl}}/images/icon1.png',
    'Jungle Squirrel': '{{site.baseurl}}/images/icon2.png',
    'Tree Tamarin': '{{site.baseurl}}/images/icon3.png',
    'Vine Panther': '{{site.baseurl}}/images/icon4.png',
    'Jungle King': '{{site.baseurl}}/images/icon5.png',
    'Bubble Fish': '{{site.baseurl}}/images/icon6.png',
    'Sea Otter': '{{site.baseurl}}/images/icon7.png',
    'Coral Crab': '{{site.baseurl}}/images/icon8.png',
    'Sharkfin Ray': '{{site.baseurl}}/images/icon9.png',
    'Leviathan': '{{site.baseurl}}/images/icon10.png',
    'Sand Scorpion': '{{site.baseurl}}/images/icon11.png',
    'Dune Lizard': '{{site.baseurl}}/images/icon12.png',
    'Cactus Hare': '{{site.baseurl}}/images/icon13.png',
    'Desert Fox': '{{site.baseurl}}/images/icon14.png',
    'Sand Serpent': '{{site.baseurl}}/images/icon15.png',
    'Snow Hare': '{{site.baseurl}}/images/icon16.png',
    'Ice Owl': '{{site.baseurl}}/images/icon17.png',
    'Polar Fox': '{{site.baseurl}}/images/icon18.png',
    'Glacier Bear': '{{site.baseurl}}/images/icon19.png',
    'Frost Wolf': '{{site.baseurl}}/images/icon20.png'
  };

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
    ['jungleBtn', 'oceanBtn', 'desertBtn', 'arcticBtn'].forEach(id => {
      document.getElementById(id).disabled = coins < packCost || isOpening;
    });
  }

  function openPack(type) {
    if (isOpening) return;
    if (coins < packCost) {
      alert("You don't have enough coins to open this pack!");
      return;
    }

    isOpening = true;
    coins -= packCost;
    updateCoinDisplay();

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
          const imgUrl = cardImageMap[card.name] || '{{site.baseurl}}/images/placeholder.png';
          cardDiv.innerHTML = `
            <img src="${imgUrl}" class="card-img-top" alt="${card.name}" width="150" height="150" />
            <div class="card-body">
              <h5 class="card-title">${card.name}</h5>
              <span class="badge bg-${rarityColor(card.rarity)}">${card.rarity.toUpperCase()}</span>
            </div>`;
          cardArea.appendChild(cardDiv);
          saveToBinder(card);
          totalReward += coinRewards[card.rarity] || 0;

          if (index === cards.length - 1) {
            coins += totalReward;
            setTimeout(() => {
              alert(`You earned ${totalReward} coins from this pack!`);
              isOpening = false;
              updateCoinDisplay();
            }, 800); // wait for animation to complete before alert
          }
        }, index * 500);
      });
    }, 1000);
  }

  function rarityColor(rarity) {
    return {
      common: 'secondary',
      uncommon: 'success',
      rare: 'primary',
      legendary: 'danger'
    }[rarity] || 'secondary';
  }

  function saveToBinder(card) {
    if (!collectedCards.find(c => c.name === card.name)) {
      collectedCards.push(card);
      localStorage.setItem('collectedCards', JSON.stringify(collectedCards));
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
      const imgUrl = cardImageMap[card.name] || '{{site.baseurl}}/images/placeholder.png';
      cardDiv.innerHTML = `
        <img src="${imgUrl}" class="card-img-top" alt="${card.name}" width="150" height="150" />
        <div class="card-body">
          <h5 class="card-title">${card.name}</h5>
          <span class="badge bg-${rarityColor(card.rarity)}">${card.rarity.toUpperCase()}</span>
        </div>`;
      binderArea.appendChild(cardDiv);
    });
  }

  // Initialize
  updateCoinDisplay();
</script>

<script>
  // --- Background Music ---
  const music = new Audio('{{site.baseurl}}/assets/audio/11confrontingmyself.mp3');
  music.loop = true;
  music.volume = 0.5;

  function startMusicOnce() {
    music.play().catch(() => {});
    window.removeEventListener('click', startMusicOnce);
    window.removeEventListener('keydown', startMusicOnce);
  }
  window.addEventListener('click', startMusicOnce);
  window.addEventListener('keydown', startMusicOnce);
</script>
