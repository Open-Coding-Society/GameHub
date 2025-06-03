---
layout: bootstrap
title: BlackJack
description: BlackJack
permalink: /blackjack
Author: Zach
---

<style>
  body {
    background-image: url('{{site.baseurl}}/images/blackjacklayout.png'); 
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }

  .container {
    position: relative;
    z-index: 1; 
    background-color: rgba(0, 0, 0, 0.7); 
    border-radius: 8px;
    padding: 20px;
  }

  h1.text-center {
    color: #ffffff; 
    font-size: 2.5875rem; 
  }

  .description {
    font-size: 1.2rem; 
    color: #ffffff;
  }

  .card-title {
    color: #cccccc; 
  }
</style>

<!--Teleports Back to given World-->
<style>
  #canvas-container {
    position: relative;
    display: inline-block;
  }
  .right-center-icon {
    position: absolute;
    top: 50%;
    right: 32px;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    cursor: pointer;
    z-index: 10;
    border-radius: 10px;
    background: rgba(0,0,0,0.12);
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }
  .right-center-icon:hover {
    background: rgba(0,0,0,0.22);
  }
</style>
  
<div id="canvas-container" style="position: relative;">
  <canvas id="gameCanvas" width="100" height="50"></canvas>
  <a href="{{site.baseurl}}/world1">
    <img src="{{site.baseurl}}/images/icon30.png" alt="Home Icon" class="right-center-icon">
  </a>
</div>

<div class="container mt-5">
  <h1 class="text-center">Antibody Blackjack</h1>
  <p class="text-center description">Get as close as you can to 21 without going over!</p>
  <div class="row justify-content-center mt-4">
    <div class="col-md-6">
      <div class="card">  
        <div class="card-body">
          <h5 class="card-title">Game Status</h5>
          <p id="game-status" class="card-text">Press "Start Game" to begin!</p>
          <div class="d-flex justify-content-between">
            <button id="start-game" class="btn btn-primary">Start Game</button>
            <button id="hit" class="btn btn-success" disabled>Hit</button>
            <button id="stand" class="btn btn-warning" disabled>Stand</button>
            <button id="split" class="btn btn-secondary" disabled>Split</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center mt-4">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Dealer's Hand</h5>
          <div id="dealer-hand" class="d-flex flex-wrap justify-content-center"></div>
          <h5 class="card-title mt-4">Your Hand</h5>
          <div id="player-hand" class="d-flex flex-wrap justify-content-center"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="module">
  import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

  function showPopup(message) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    popup.style.color = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.zIndex = "1000";
    popup.style.textAlign = "center";
    popup.style.fontSize = "18px";

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000); 
  }

  async function updatePoints(points) {
    try {
      const response = await fetch(`${pythonURI}/api/points`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ points })
      });

      const data = await response.json();
      console.log('Response:', response); 
      console.log('Response Data:', data); 

      if (response.ok) {
        console.log('Points updated successfully:', data.total_points);
        showPopup("You gained 50 points!"); 
      } else {
        console.error('Failed to update points:', data.message);
      }
    } catch (error) {
      console.error('Error updating points:', error);
    }
  }

  const startGameButton = document.getElementById("start-game");
  const hitButton = document.getElementById("hit");
  const standButton = document.getElementById("stand");
  const splitButton = document.getElementById("split");
  const gameStatus = document.getElementById("game-status");
  const playerHand = document.getElementById("player-hand");
  const dealerHand = document.getElementById("dealer-hand");

  let deck = [];
  let playerCards = [];
  let dealerCards = [];
  let playerHand1 = [];
  let playerHand2 = [];
  let isPlayingFirstHand = true;

  function createDeck() {
    const antibodies = [
      { name: "IgG", value: 11, description: "IgG: Most abundant, long-term immunity." },
      { name: "IgA", value: 2, description: "IgA: Protects mucosal surfaces." },
      { name: "IgM", value: 3, description: "IgM: First responder, complement activator." },
      { name: "IgE", value: 4, description: "IgE: Allergies and parasite defense." },
      { name: "IgD", value: 5, description: "IgD: B cell activation role." },
      { name: "IgG1", value: 6, description: "IgG1: Effective against viruses/bacteria." },
      { name: "IgG2", value: 7, description: "IgG2: Carbohydrate antigen defense." },
      { name: "IgG3", value: 8, description: "IgG3: Strong complement activator." },
      { name: "IgG4", value: 9, description: "IgG4: Regulates immune responses." },
      { name: "IgA1", value: 10, description: "IgA1: Blood-based infection defense." },
      { name: "IgA2", value: 10, description: "IgA2: Mucosal secretion protection." },
      { name: "Secretory IgM", value: 10, description: "Secretory IgM: Mucosal immunity role." },
      { name: "IgY", value: 10, description: "IgY: Bird/reptile antibody, IgG-like." }
    ];

    const suits = ["♥", "♦", "♣", "♠"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    deck = [];
    antibodies.forEach((antibody, index) => {
      suits.forEach((suit) => {
        deck.push({
          name: antibody.name,
          value: antibody.value,
          rank: ranks[index],
          suit: suit,
          description: antibody.description
        });
      });
    });

    deck.sort(() => Math.random() - 0.5); 
  }

  function calculateScore(cards) {
    let score = 0;
    let iggCount = 0;

    for (const card of cards) {
      score += card.value;
      if (card.name === "IgG") {
        iggCount++;
      }
    }

    while (score > 21 && iggCount > 0) {
      score -= 10; 
      iggCount--;
    }

    return score;
  }

  function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.style.width = "160px";
    cardElement.style.height = "240px";
    cardElement.className = "card m-2";
    cardElement.style.border = "1px solid black";
    cardElement.style.borderRadius = "8px";
    cardElement.style.backgroundColor = "white";
    cardElement.style.position = "relative";
    cardElement.style.display = "flex";
    cardElement.style.flexDirection = "column";
    cardElement.style.justifyContent = "space-between";
    cardElement.style.padding = "5px";
    cardElement.style.color = "black";
    cardElement.style.cursor = "pointer"; 

    const frontFace = document.createElement("div");
    frontFace.style.width = "100%";
    frontFace.style.height = "100%";
    frontFace.style.position = "absolute";
    frontFace.style.backfaceVisibility = "hidden";
    frontFace.style.transform = "rotateY(0deg)";
    frontFace.style.display = "flex";
    frontFace.style.flexDirection = "column";
    frontFace.style.justifyContent = "space-between";

    const imageElement = document.createElement("img");
    imageElement.src = `{{site.baseurl}}/images/${card.name.replace(/\s+/g, '')}.png`;
    imageElement.alt = card.name;
    imageElement.style.width = "100%";
    imageElement.style.height = "100%";
    imageElement.style.borderRadius = "8px";
    frontFace.appendChild(imageElement);

    const suitColor = (card.suit === "♥" || card.suit === "♦") ? "red" : "black";

    const topLeft = document.createElement("div");
    topLeft.style.position = "absolute";
    topLeft.style.top = "5px";
    topLeft.style.left = "5px";
    topLeft.style.fontSize = "18px";
    topLeft.style.fontWeight = "bold";
    topLeft.style.color = suitColor;
    topLeft.textContent = `${card.rank} ${card.suit}`;
    frontFace.appendChild(topLeft);

    const topRight = document.createElement("div");
    topRight.style.position = "absolute";
    topRight.style.top = "5px";
    topRight.style.right = "5px";
    topRight.style.fontSize = "16px";
    topRight.style.fontWeight = "bold";
    topRight.textContent = card.name;
    frontFace.appendChild(topRight);

    const backFace = document.createElement("div");
    backFace.style.width = "100%";
    backFace.style.height = "100%";
    backFace.style.position = "absolute";
    backFace.style.backfaceVisibility = "hidden";
    backFace.style.transform = "rotateY(180deg)";
    backFace.style.display = "flex";
    backFace.style.alignItems = "center";
    backFace.style.justifyContent = "center";
    backFace.style.backgroundColor = "white";
    backFace.style.borderRadius = "8px";
    backFace.style.padding = "10px";
    backFace.style.textAlign = "center";
    backFace.style.color = "black";
    backFace.textContent = card.description;

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);

    cardElement.style.transformStyle = "preserve-3d";
    cardElement.style.transition = "transform 0.6s";

    cardElement.addEventListener("click", () => {
      if (cardElement.style.transform === "rotateY(180deg)") {
        cardElement.style.transform = "rotateY(0deg)";
      } else {
        cardElement.style.transform = "rotateY(180deg)";
      }
    });

    return cardElement;
  }

  function resetGame() {
    deck = [];
    playerCards = [];
    dealerCards = [];
    playerHand1 = [];
    playerHand2 = [];
    isPlayingFirstHand = true;
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";
    gameStatus.textContent = "Press 'Start Game' to begin!";
    hitButton.disabled = true;
    standButton.disabled = true;
    splitButton.disabled = true;
  }

  function updateHands() {
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";

    dealerHand.style.display = "flex";
    dealerHand.style.justifyContent = "center";
    dealerHand.style.marginBottom = "20px";
    dealerCards.forEach(card => dealerHand.appendChild(createCardElement(card)));

    if (playerHand1.length > 0 && playerHand2.length > 0) {
      const handsContainer = document.createElement("div");
      handsContainer.style.display = "flex";
      handsContainer.style.justifyContent = "center";
      handsContainer.style.gap = "40px";

      const hand1Container = document.createElement("div");
      hand1Container.style.display = "flex";
      hand1Container.style.flexDirection = "column";
      hand1Container.style.alignItems = "center";

      const hand2Container = document.createElement("div");
      hand2Container.style.display = "flex";
      hand2Container.style.flexDirection = "column";
      hand2Container.style.alignItems = "center";

      playerHand1.forEach((card, index) => {
        const cardElement = createCardElement(card);
        cardElement.style.position = "relative";
        cardElement.style.marginTop = `${index * 30}px`;
        hand1Container.appendChild(cardElement);
      });

      playerHand2.forEach((card, index) => {
        const cardElement = createCardElement(card);
        cardElement.style.position = "relative";
        cardElement.style.marginTop = `${index * 30}px`;
        hand2Container.appendChild(cardElement);
      });

      handsContainer.appendChild(hand1Container);
      handsContainer.appendChild(hand2Container);
      playerHand.appendChild(handsContainer);
    } else {
      playerCards.forEach((card, index) => {
        const cardElement = createCardElement(card);
        cardElement.style.position = "relative";
        cardElement.style.marginTop = `${index * 30}px`;
        playerHand.appendChild(cardElement);
      });
    }

    if (playerCards.length === 2 && playerCards[0].rank === playerCards[1].rank) {
      splitButton.disabled = false;
    } else {
      splitButton.disabled = true;
    }
  }

  function startGame() {
    resetGame();
    createDeck();
    playerCards = [deck.pop(), deck.pop()];
    dealerCards = [deck.pop()];
    updateHands();
    gameStatus.textContent = "Game started! Your turn.";
    hitButton.disabled = false;
    standButton.disabled = false;
  }

  function hit() {
    playerCards.push(deck.pop());
    const currentHandScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    gameStatus.textContent = `Your Score: ${currentHandScore} | Dealer's Score: ${dealerScore}`;

    updateHands();

    splitButton.disabled = true;

    if (currentHandScore > 21) {
      if (playerHand1.length > 0 && playerHand2.length > 0) {
        if (isPlayingFirstHand) {
          isPlayingFirstHand = false;
          playerCards = playerHand2;
          gameStatus.textContent = "Second Card! Your Turn.";
          updateHands();
        } else {
          finalizeSplitGame();
        }
      } else {
        gameStatus.textContent = "You busted! Dealer wins.";
        hitButton.disabled = true;
        standButton.disabled = true;
      }
    }
  }

  function split() {
    if (playerCards.length === 2 && playerCards[0].rank === playerCards[1].rank) {
      playerHand1 = [playerCards[0]];
      playerHand2 = [playerCards[1]];
      playerCards = playerHand1;
      isPlayingFirstHand = true;
      gameStatus.textContent = "First Card! Your Turn.";
      updateHands();
      hitButton.disabled = false;
      standButton.disabled = false;
      splitButton.disabled = true;
    }
  }

  function stand() {
    splitButton.disabled = true;

    if (playerHand1.length > 0 && playerHand2.length > 0) {
      if (isPlayingFirstHand) {
        isPlayingFirstHand = false;
        playerCards = playerHand2;
        gameStatus.textContent = "Second Card! Your Turn.";
        updateHands();
      } else {
        finalizeSplitGame();
      }
    } else {
      finalizeNormalGame();
    }
  }

  function finalizeNormalGame() {
    while (calculateScore(dealerCards) < 17) {
      dealerCards.push(deck.pop());
    }
    updateHands();

    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    if (playerScore > 21) {
      gameStatus.textContent = "You busted! Dealer wins.";
    } else if (dealerScore > 21 || playerScore > dealerScore) {
      gameStatus.textContent = "You win!";
      updatePoints(50);
    } else if (playerScore < dealerScore) {
      gameStatus.textContent = "Dealer wins!";
    } else {
      gameStatus.textContent = "It's a tie!";
    }

    hitButton.disabled = true;
    standButton.disabled = true;
  }

  function finalizeSplitGame() {
    const firstHandScore = calculateScore(playerHand1);
    const secondHandScore = calculateScore(playerHand2);

    if (firstHandScore > 21 && secondHandScore > 21) {
      gameStatus.textContent = "Dealer wins!";
      hitButton.disabled = true;
      standButton.disabled = true;
      return;
    }

    while (calculateScore(dealerCards) < 17) {
      dealerCards.push(deck.pop());
    }
    updateHands();

    const dealerScore = calculateScore(dealerCards);

    const firstHandResult = firstHandScore > 21 ? "bust" : dealerScore > 21 || firstHandScore > dealerScore ? "win" : firstHandScore < dealerScore ? "lose" : "tie";
    const secondHandResult = secondHandScore > 21 ? "bust" : dealerScore > 21 || secondHandScore > dealerScore ? "win" : secondHandScore < dealerScore ? "lose" : "tie";

    let resultMessage = "";

    if (firstHandResult === "win" && secondHandResult === "win") {
      resultMessage = "You win!";
      updatePoints(50);
    } else if (firstHandResult === "lose" && secondHandResult === "lose") {
      resultMessage = "Dealer wins!";
    } else if (firstHandResult === "tie" && secondHandResult === "tie") {
      resultMessage = "It's a tie!";
    } else if ((firstHandResult === "win" && secondHandResult === "lose") || (firstHandResult === "lose" && secondHandResult === "win")) {
      resultMessage = "It's a tie!";
    } else if (firstHandResult === "tie" && secondHandResult === "lose") {
      resultMessage = "Dealer wins!";
    } else if (firstHandResult === "tie" && secondHandResult === "win") {
      resultMessage = "You win!";
      updatePoints(50);
    } else if ((firstHandResult === "bust" && secondHandResult === "tie") || (firstHandResult === "tie" && secondHandResult === "bust")) {
      resultMessage = "Dealer wins!";
    } else if (secondHandResult === "bust") {
      resultMessage = firstHandResult === "win" ? "You win!" : "Dealer wins!";
      if (firstHandResult === "win") updatePoints(50);
    } else if (firstHandResult === "bust") {
      resultMessage = secondHandResult === "win" ? "You win!" : "Dealer wins!";
      if (secondHandResult === "win") updatePoints(50);
    }

    gameStatus.textContent = resultMessage;
    hitButton.disabled = true;
    standButton.disabled = true;
  }

  startGameButton.addEventListener("click", startGame);
  hitButton.addEventListener("click", hit);
  standButton.addEventListener("click", stand);
  splitButton.addEventListener("click", split);
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/3awake.mp3'); // Change path as needed
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