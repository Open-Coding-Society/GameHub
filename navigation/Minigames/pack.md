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
</style>
</head>
<body>
<div class="container mt-5">
  <h1>Pack Opening Game</h1>
  <div id="coinBalance">Coins: 100</div>
  <p>Each pack costs 5 coins.</p>
  <p>Choose a pack to open:</p>
  <button class="btn btn-success pack-btn" id="jungleBtn" onclick="openPack('jungle')">🌴 Jungle Pack</button>
  <button class="btn btn-primary pack-btn" id="oceanBtn" onclick="openPack('ocean')">🌊 Ocean Pack</button>
  <button class="btn btn-warning pack-btn" id="desertBtn" onclick="openPack('desert')">🏜️ Desert Pack</button>
  <button class="btn btn-info pack-btn" id="arcticBtn" onclick="openPack('arctic')">⛄ Arctic Pack</button>
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

  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic'];
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

  const packs = {
    arctic: [
      { name: 'Fox', rarity: 'common' },
      { name: 'Rabbit', rarity: 'common' },
      { name: 'Deer', rarity: 'uncommon' },
      { name: 'Owl', rarity: 'uncommon' },
      { name: 'Wolf', rarity: 'rare' },
      { name: 'Bear', rarity: 'rare' },
      { name: 'Lynx', rarity: 'epic' },
      { name: 'Eagle', rarity: 'legendary' },
      { name: 'Phoenix', rarity: 'mythic' },
      { name: 'Dragon', rarity: 'exotic' }
    ],
    jungle: [
      { name: 'Monkey', rarity: 'common' },
      { name: 'Parrot', rarity: 'common' },
      { name: 'Tiger', rarity: 'uncommon' },
      { name: 'Jaguar', rarity: 'uncommon' },
      { name: 'Anaconda', rarity: 'rare' },
      { name: 'Cheetah', rarity: 'rare' },
      { name: 'Panther', rarity: 'epic' },
      { name: 'Gorilla', rarity: 'legendary' },
      { name: 'Hydra', rarity: 'mythic' },
      { name: 'Chimera', rarity: 'exotic' }
    ],
    ocean: [
      { name: 'Clownfish', rarity: 'common' },
      { name: 'Seahorse', rarity: 'common' },
      { name: 'Turtle', rarity: 'uncommon' },
      { name: 'Crab', rarity: 'uncommon' },
      { name: 'Shark', rarity: 'rare' },
      { name: 'Dolphin', rarity: 'rare' },
      { name: 'Manta Ray', rarity: 'epic' },
      { name: 'Whale', rarity: 'legendary' },
      { name: 'Kraken', rarity: 'mythic' },
      { name: 'Leviathan', rarity: 'exotic' }
    ],
    desert: [
      { name: 'Scorpion', rarity: 'common' },
      { name: 'Lizard', rarity: 'common' },
      { name: 'Camel', rarity: 'uncommon' },
      { name: 'Vulture', rarity: 'uncommon' },
      { name: 'Coyote', rarity: 'rare' },
      { name: 'Fennec Fox', rarity: 'rare' },
      { name: 'Sandworm', rarity: 'epic' },
      { name: 'Manticore', rarity: 'legendary' },
      { name: 'Sphinx', rarity: 'mythic' },
      { name: 'Djinn', rarity: 'exotic' }
    ],
  };

  const cardImageMap = {
    // Arctic
    'Fox': '{{site.baseurl}}/images/symbol100.png',
    'Rabbit': '{{site.baseurl}}/images/symbol100.png',
    'Deer': '{{site.baseurl}}/images/symbol100.png',
    'Owl': '{{site.baseurl}}/images/symbol100.png',
    'Wolf': '{{site.baseurl}}/images/symbol100.png',
    'Bear': '{{site.baseurl}}/images/symbol100.png',
    'Lynx': '{{site.baseurl}}/images/symbol100.png',
    'Eagle': '{{site.baseurl}}/images/symbol100.png',
    'Phoenix': '{{site.baseurl}}/images/symbol100.png',
    'Dragon': '{{site.baseurl}}/images/symbol100.png',
    // Jungle
    'Monkey': '{{site.baseurl}}/images/symbol100.png',
    'Parrot': '{{site.baseurl}}/images/symbol100.png',
    'Tiger': '{{site.baseurl}}/images/symbol100.png',
    'Jaguar': '{{site.baseurl}}/images/symbol100.png',
    'Anaconda': '{{site.baseurl}}/images/symbol100.png',
    'Cheetah': '{{site.baseurl}}/images/symbol100.png',
    'Panther': '{{site.baseurl}}/images/symbol100.png',
    'Gorilla': '{{site.baseurl}}/images/symbol100.png',
    'Hydra': '{{site.baseurl}}/images/symbol100.png',
    'Chimera': '{{site.baseurl}}/images/symbol100.png',
    // Ocean
    'Clownfish': '{{site.baseurl}}/images/symbol100.png',
    'Seahorse': '{{site.baseurl}}/images/symbol100.png',
    'Turtle': '{{site.baseurl}}/images/symbol100.png',
    'Crab': '{{site.baseurl}}/images/symbol100.png',
    'Shark': '{{site.baseurl}}/images/symbol100.png',
    'Dolphin': '{{site.baseurl}}/images/symbol100.png',
    'Manta Ray': '{{site.baseurl}}/images/symbol100.png',
    'Whale': '{{site.baseurl}}/images/symbol100.png',
    'Kraken': '{{site.baseurl}}/images/symbol100.png',
    'Leviathan': '{{site.baseurl}}/images/symbol100.png',
    // Desert
    'Scorpion': '{{site.baseurl}}/images/symbol100.png',
    'Lizard': '{{site.baseurl}}/images/symbol100.png',
    'Camel': '{{site.baseurl}}/images/symbol100.png',
    'Vulture': '{{site.baseurl}}/images/symbol100.png',
    'Coyote': '{{site.baseurl}}/images/symbol100.png',
    'Fennec Fox': '{{site.baseurl}}/images/symbol100.png',
    'Sandworm': '{{site.baseurl}}/images/symbol100.png',
    'Manticore': '{{site.baseurl}}/images/symbol100.png',
    'Sphinx': '{{site.baseurl}}/images/symbol100.png',
    'Djinn': '{{site.baseurl}}/images/symbol100.png',
  };

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

  function displayCards(cards) {
    const cardArea = document.getElementById('cardArea');
    cardArea.innerHTML = '';
    let coinsEarned = 0;
    cards.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = `card game-card border border-${card.rarity} bg-light shadow-sm`;
      cardDiv.style.width = '150px';

      cardDiv.innerHTML = `
        <img src="${cardImageMap[card.name] || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${card.name}" />
        <div class="card-body p-2">
          <h5 class="card-title mb-1">${card.name}</h5>
          <p class="card-text mb-0"><span class="badge bg-${getRarityColor(card.rarity)}">${capitalize(card.rarity)}</span></p>
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
        cardDiv.innerHTML = `
          <img src="${cardImageMap[card.name] || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${card.name}" style="width:150px;height:150px;" />
          <div class="card-body p-2">
            <div style="font-size:1em;">${card.name}</div>
            <span class="badge bg-${getRarityColor(card.rarity)}" style="font-size:1em;">${capitalize(card.rarity)}</span>
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

  function getRarityColor(rarity) {
    switch (rarity) {
      case 'common': return 'secondary';
      case 'uncommon': return 'success';
      case 'rare': return 'primary';
      case 'epic': return 'purple'; // custom purple class defined in CSS
      case 'legendary': return 'warning';
      case 'mythic': return 'danger';
      case 'exotic': return 'info';
      default: return 'secondary';
    }
  }

  updateCoins();
</script>
</body>
</html>
