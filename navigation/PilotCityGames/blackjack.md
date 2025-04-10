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
      { name: "IgG", value: 1 },
      { name: "IgA", value: 2 },
      { name: "IgM", value: 3 },
      { name: "IgE", value: 4 },
      { name: "IgD", value: 5 },
      { name: "IgG1", value: 6 },
      { name: "IgG2", value: 7 },
      { name: "IgG3", value: 8 },
      { name: "IgG4", value: 9 },
      { name: "IgA1", value: 10 },
      { name: "IgA2", value: 10 },
      { name: "Secretory IgM", value: 10 },
      { name: "IgY", value: 10 }
    ];
    deck = antibodies.map(antibody => antibody.name).sort(() => Math.random() - 0.5); // Shuffle deck
  }

  function calculateScore(cards) {
    const antibodyValues = {
      "IgG": 11, 
      "IgA": 2,
      "IgM": 3,
      "IgE": 4,
      "IgD": 5,
      "IgG1": 6,
      "IgG2": 7,
      "IgG3": 8,
      "IgG4": 9,
      "IgA1": 10,
      "IgA2": 10,
      "Secretory IgM": 10,
      "IgY": 10
    };

    let score = 0;
    let iggCount = 0;

    for (const card of cards) {
      score += antibodyValues[card];
      if (card === "IgG") {
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

  function createCardElement(cardName) {
    const card = document.createElement("div");
    card.className = "card m-2";
    card.style.width = "100px";
    card.style.height = "150px";
    card.style.perspective = "1000px";

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";
    cardInner.style.position = "relative";
    cardInner.style.width = "100%";
    cardInner.style.height = "100%";
    cardInner.style.transformStyle = "preserve-3d";
    cardInner.style.transition = "transform 0.6s";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.style.position = "absolute";
    cardFront.style.width = "100%";
    cardFront.style.height = "100%";
    cardFront.style.backfaceVisibility = "hidden";
    cardFront.style.backgroundColor = "#007bff";
    cardFront.style.color = "white";
    cardFront.style.display = "flex";
    cardFront.style.alignItems = "center";
    cardFront.style.justifyContent = "center";
    cardFront.style.borderRadius = "5px";
    cardFront.style.textAlign = "center"; // Ensure text is centered
    cardFront.textContent = cardName;

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.style.position = "absolute";
    cardBack.style.width = "100%";
    cardBack.style.height = "100%";
    cardBack.style.backfaceVisibility = "hidden";
    cardBack.style.backgroundColor = "#f8f9fa";
    cardBack.style.color = "#333";
    cardBack.style.display = "flex";
    cardBack.style.alignItems = "center";
    cardBack.style.justifyContent = "center";
    cardBack.style.borderRadius = "5px";
    cardBack.style.transform = "rotateY(180deg)";
    cardBack.style.textAlign = "center"; // Ensure text is centered
    cardBack.style.fontSize = "12px"; // Reduce font size for better fit
    cardBack.textContent = getAntibodyDescription(cardName);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener("click", () => {
      cardInner.style.transform = cardInner.style.transform === "rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
    });

    return card;
  }

  function getAntibodyDescription(cardName) {
    const descriptions = {
      "IgG": "Most abundant, long-term immunity.",
      "IgA": "Protects mucosal surfaces.",
      "IgM": "First responder, complement activator.",
      "IgE": "Allergies and parasite defense.",
      "IgD": "B cell activation role.",
      "IgG1": "Effective against viruses/bacteria.",
      "IgG2": "Carbohydrate antigen defense.",
      "IgG3": "Strong complement activator.",
      "IgG4": "Regulates immune responses.",
      "IgA1": "Blood-based infection defense.",
      "IgA2": "Mucosal secretion protection.",
      "Secretory IgM": "Mucosal immunity role.",
      "IgY": "Bird/reptile antibody, IgG-like."
    };
    return descriptions[cardName] || "Unknown antibody.";
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