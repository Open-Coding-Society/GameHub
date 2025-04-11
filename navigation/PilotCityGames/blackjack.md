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
          <h5 class="card-title">Your Hand</h5>
          <div id="player-hand" class="d-flex flex-wrap justify-content-center"></div>
          <h5 class="card-title mt-4">Dealer's Hand</h5>
          <div id="dealer-hand" class="d-flex flex-wrap justify-content-center"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  // Blackjack Game Logic
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
      { name: "IgG", value: 11, description: "Most abundant, long-term immunity." },
      { name: "IgA", value: 2, description: "Protects mucosal surfaces." },
      { name: "IgM", value: 3, description: "First responder, complement activator." },
      { name: "IgE", value: 4, description: "Allergies and parasite defense." },
      { name: "IgD", value: 5, description: "B cell activation role." },
      { name: "IgG1", value: 6, description: "Effective against viruses/bacteria." },
      { name: "IgG2", value: 7, description: "Carbohydrate antigen defense." },
      { name: "IgG3", value: 8, description: "Strong complement activator." },
      { name: "IgG4", value: 9, description: "Regulates immune responses." },
      { name: "IgA1", value: 10, description: "Blood-based infection defense." },
      { name: "IgA2", value: 10, description: "Mucosal secretion protection." },
      { name: "Secretory IgM", value: 10, description: "Mucosal immunity role." },
      { name: "IgY", value: 10, description: "Bird/reptile antibody, IgG-like." }
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

    deck.sort(() => Math.random() - 0.5); // Shuffle the deck
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

    // Adjust IgG value from 11 to 1 if score exceeds 21
    while (score > 21 && iggCount > 0) {
      score -= 10; // Reduce score by 10 (11 - 1)
      iggCount--;
    }

    return score;
  }

  function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.style.width = "110px"; // Revert to standard card size
    cardElement.style.height = "160px"; // Revert to standard card size
    cardElement.className = "card m-2";
    cardElement.style.border = "1px solid black";
    cardElement.style.borderRadius = "8px";
    cardElement.style.backgroundColor = "white";
    cardElement.style.position = "relative";
    cardElement.style.display = "flex";
    cardElement.style.flexDirection = "column";
    cardElement.style.justifyContent = "space-between";
    cardElement.style.padding = "5px";
    cardElement.style.color = "black"; // Ensure text is visible

    // Determine suit color
    const suitColor = (card.suit === "♥" || card.suit === "♦") ? "red" : "black";

    // Top-left antibody name
    const topLeft = document.createElement("div");
    topLeft.style.position = "absolute";
    topLeft.style.top = "5px";
    topLeft.style.left = "5px";
    topLeft.style.fontSize = card.name === "Secretory IgM" ? "10px" : "12px"; // Slightly smaller for "Secretory IgM"
    topLeft.style.fontWeight = "bold";
    topLeft.textContent = card.name;
    cardElement.appendChild(topLeft);

    // Top-right rank and suit
    const topRight = document.createElement("div");
    topRight.style.position = "absolute";
    topRight.style.top = "5px";
    topRight.style.right = "5px";
    topRight.style.fontSize = "12px";
    topRight.style.fontWeight = "bold";
    topRight.style.color = suitColor; // Apply suit color
    topRight.textContent = `${card.rank} ${card.suit}`;
    cardElement.appendChild(topRight);

    // Center antibody description
    const centerText = document.createElement("div");
    centerText.style.flexGrow = "1";
    centerText.style.display = "flex";
    centerText.style.alignItems = "center";
    centerText.style.justifyContent = "center";
    centerText.style.textAlign = "center";
    centerText.style.fontSize = "10px";
    centerText.style.overflow = "hidden";
    centerText.style.textOverflow = "ellipsis";
    centerText.style.whiteSpace = "normal";
    centerText.textContent = card.description;
    cardElement.appendChild(centerText);

    // Bottom-left rank and suit
    const bottomLeft = document.createElement("div");
    bottomLeft.style.position = "absolute";
    bottomLeft.style.bottom = "5px";
    bottomLeft.style.left = "5px";
    bottomLeft.style.fontSize = "12px";
    bottomLeft.style.fontWeight = "bold";
    bottomLeft.style.color = suitColor; // Apply suit color
    bottomLeft.textContent = `${card.rank} ${card.suit}`;
    cardElement.appendChild(bottomLeft);

    return cardElement;
  }

  function updateHands() {
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";
    playerCards.forEach(card => playerHand.appendChild(createCardElement(card)));
    dealerCards.forEach(card => dealerHand.appendChild(createCardElement(card)));
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