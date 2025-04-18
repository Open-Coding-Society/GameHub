---
layout: bootstrap
title: BlackJack
description: BlackJack
permalink: /blackjack
Author: Zach
---

<div class="container mt-5">
  <h1 class="text-center">Antibody Blackjack</h1>
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

<script>
  const startGameButton = document.getElementById("start-game");
  const hitButton = document.getElementById("hit");
  const standButton = document.getElementById("stand");
  const gameStatus = document.getElementById("game-status");
  const playerHand = document.getElementById("player-hand");
  const dealerHand = document.getElementById("dealer-hand");

  let deck = [];
  let playerCards = [];
  let dealerCards = [];

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

    const imageElement = document.createElement("img");
    imageElement.src = `{{site.baseurl}}/images/${card.name.replace(/\s+/g, '')}.png`;
    imageElement.alt = card.name;
    imageElement.style.width = "100%";
    imageElement.style.height = "100%";
    imageElement.style.borderRadius = "8px";
    cardElement.appendChild(imageElement);

    const suitColor = (card.suit === "♥" || card.suit === "♦") ? "red" : "black";


    const topLeft = document.createElement("div");
    topLeft.style.position = "absolute";
    topLeft.style.top = "5px";
    topLeft.style.left = "5px";
    topLeft.style.fontSize = "18px"; 
    topLeft.style.fontWeight = "bold";
    topLeft.style.color = suitColor; 
    topLeft.textContent = `${card.rank} ${card.suit}`;
    cardElement.appendChild(topLeft);


    const topRight = document.createElement("div");
    topRight.style.position = "absolute";
    topRight.style.top = "5px";
    topRight.style.right = "5px";
    topRight.style.fontSize = "16px"; 
    topRight.style.fontWeight = "bold";
    topRight.textContent = card.name;
    cardElement.appendChild(topRight);


    const bottomRight = document.createElement("div");
    bottomRight.style.position = "absolute";
    bottomRight.style.bottom = "5px";
    bottomRight.style.right = "5px";
    bottomRight.style.fontSize = "18px"; 
    bottomRight.style.fontWeight = "bold";
    bottomRight.style.color = suitColor; 
    bottomRight.textContent = `${card.rank} ${card.suit}`;
    cardElement.appendChild(bottomRight);

    return cardElement;
  }

  function updateHands() {
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";

    dealerHand.style.display = "flex";
    dealerHand.style.justifyContent = "center";
    dealerHand.style.marginBottom = "20px";
    dealerCards.forEach(card => dealerHand.appendChild(createCardElement(card)));

    playerHand.style.display = "flex";
    playerHand.style.justifyContent = "center";
    playerCards.forEach(card => playerHand.appendChild(createCardElement(card)));

    gameStatus.textContent = `Your Score: ${calculateScore(playerCards)} | Dealer's Score: ${calculateScore(dealerCards)}`;
  }

  function startGame() {
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
    updateHands();
    if (calculateScore(playerCards) > 21) {
      gameStatus.textContent = "You busted! Dealer wins.";
      hitButton.disabled = true;
      standButton.disabled = true;
    }
  }

  function stand() {
    while (calculateScore(dealerCards) < 17) {
      dealerCards.push(deck.pop());
    }
    updateHands();
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);
    if (dealerScore > 21 || playerScore > dealerScore) {
      gameStatus.textContent = "You win!";
    } else if (playerScore < dealerScore) {
      gameStatus.textContent = "Dealer wins!";
    } else {
      gameStatus.textContent = "It's a tie!";
    }
    hitButton.disabled = true;
    standButton.disabled = true;
  }

  startGameButton.addEventListener("click", startGame);
  hitButton.addEventListener("click", hit);
  standButton.addEventListener("click", stand);
</script>