---
layout: bootstrap
title: Simulation
description: Simulation Game
permalink: /simulation
Author: Ian
---

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stock Market Game</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body {
    background-color: #0a0f13;
    color: #f0f3f5;
  }
  .navbar {
    background-color: #1c1f26;
  }
  .stock-card {
    background-color: #1c1f26;
    border: 1px solid #333;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    color: #f0f3f5;
  }
  canvas {
    max-width: 100%;
    height: 200px;
  }
  .btn-custom {
    background-color: #00c805;
    color: white;
    border: none;
  }
  .btn-custom:hover {
    background-color: #00b104;
  }
  .form-control {
    background-color: #2b2e34;
    color: #f0f3f5;
    border: 1px solid #444;
  }
  .item-card {
    background-color: #23272f;
    border: 1px solid #444;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    color: #f0f3f5;
  }
  .news-card {
    background-color: #23272f;
    border: 1px solid #444;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
    color: #f0f3f5;
    font-style: italic;
  }
  /* Popup styles */
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
  /* Enhanced animation styles for purchased items */
  .fly-animation {
    position: fixed;
    font-size: 2em;
    animation: flyDynamic 5s linear;
    z-index: 9999;
  }

  @keyframes flyDynamic {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    25% {
      transform: translate(50px, -50px) rotate(45deg);
    }
    50% {
      transform: translate(-50px, 50px) rotate(-45deg);
    }
    75% {
      transform: translate(50px, 50px) rotate(90deg);
    }
    100% {
      transform: translate(-50px, -50px) rotate(-90deg);
      opacity: 0;
    }
  }
</style>
<nav class="navbar navbar-dark mb-4 px-4">
  <a class="navbar-brand text-light" href="#">Simulation Market Game</a>
  <span class="navbar-text">Balance: $<span id="balance">100000</span></span>
  <button class="btn btn-custom" onclick="generateMarket()">Generate Market</button>
</nav>

<div class="container">
  <div id="news" class="news-card mb-4"></div>
  <div id="stocks" class="row"></div>
  <h3 class="mt-5">Spend Your Money</h3>
  <div id="items" class="row"></div>
</div>

<div id="balancePopup" class="popup-modal">
  <button class="close-btn" onclick="closePopup('balancePopup')">&times;</button>
  <h4>Balance Replenished</h4>
  <p>Your balance has been replenished with $5000 to keep playing!</p>
</div>

<script>
  let balance = 100000; // Updated starting balance
  const stocks = {
    "TechCorp": { price: 50, history: [50], shares: 0 }, // Updated price
    "MemeInc": { price: 100, history: [100], shares: 0 }, // Updated price
    "AIWorks": { price: 500, history: [500], shares: 0 } // Updated price
  };

  const items = [
    { name: "Gaming PC", price: 5000 },
    { name: "Vacation", price: 10000 },
    { name: "Sports Car", price: 150000 },
    { name: "Private Jet", price: 1000000 }
  ];

  // --- Fake News System ---
  const newsTemplates = [
    { up: "Analysts predict a strong quarter for {stock}.", down: "Rumors of layoffs at {stock} worry investors." },
    { up: "{stock} announces breakthrough technology.", down: "{stock} faces regulatory scrutiny." },
    { up: "Positive earnings report boosts {stock}.", down: "Disappointing sales numbers for {stock}." },
    { up: "{stock} secures major partnership.", down: "{stock} CEO steps down unexpectedly." }
  ];
  let currentNews = {};

  function generateFakeNews() {
    currentNews = {};
    let newsHtml = "";
    for (let name in stocks) {
      const trend = Math.random() > 0.5 ? "up" : "down";
      const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
      const newsText = template[trend].replace("{stock}", name);
      currentNews[name] = trend;
      newsHtml += `<div><b>${name}:</b> ${newsText} <span style="color:${trend === "up" ? "#00c805" : "#ff3b3b"};">(${trend === "up" ? "↑" : "↓"})</span></div>`;
    }
    document.getElementById("news").innerHTML = newsHtml;
  }

  function createStockCards() {
    const container = document.getElementById("stocks");
    container.innerHTML = "";
    for (let name in stocks) {
      const col = document.createElement("div");
      col.className = "col-md-4";

      const card = document.createElement("div");
      card.className = "stock-card";
      card.innerHTML = `
<h4 class="mb-2">${name}</h4>
<canvas id="chart-${name}"></canvas>
<p class="mt-3">Price: $<span id="price-${name}">${stocks[name].price.toFixed(2)}</span></p>
<p>Shares Owned: <span id="shares-${name}">${stocks[name].shares.toFixed(2)}</span></p>
<div class="input-group mb-2">
  <input type="number" class="form-control" id="invest-${name}" placeholder="Amount to Invest">
  <button class="btn btn-custom" onclick="invest('${name}')">Invest</button>
</div>
<div class="input-group mb-2">
  <input type="number" class="form-control" id="withdraw-${name}" placeholder="Shares to Withdraw">
  <button class="btn btn-secondary" onclick="withdraw('${name}')">Withdraw</button>
</div>
`;

      col.appendChild(card);
      container.appendChild(col);
      renderChart(name);
    }
  }

  function generateMarket() {
    generateFakeNews();
    for (let name in stocks) {
      const stock = stocks[name];
      // News influences the direction
      let baseChange = (Math.random() - 0.5) * 20;
      if (currentNews[name] === "up") baseChange = Math.abs(baseChange);
      if (currentNews[name] === "down") baseChange = -Math.abs(baseChange);
      stock.price = Math.max(1, stock.price + baseChange);
      stock.history.push(stock.price);
      document.getElementById(`price-${name}`).innerText = stock.price.toFixed(2);
      updateChart(name);
    }
  }

  function checkBalance() {
    if (balance < 1) {
      balance += 5000;
      document.getElementById("balance").innerText = balance.toFixed(2);
      document.getElementById("balancePopup").style.display = "block";
    }
  }

  function closePopup(id) {
    document.getElementById(id).style.display = "none";
  }

  function invest(name) {
    const amountInput = document.getElementById(`invest-${name}`);
    const amount = parseFloat(amountInput.value);
    const stock = stocks[name];

    if (!isNaN(amount) && amount > 0 && amount <= balance) {
      const shares = amount / stock.price;
      stock.shares += shares;
      balance -= amount;
      document.getElementById("balance").innerText = balance.toFixed(2);
      document.getElementById(`shares-${name}`).innerText = stock.shares.toFixed(2);
      amountInput.value = "";
    } else {
      alert("Invalid investment amount");
    }
    checkBalance();
  }

  // Withdraw by shares instead of amount
  function withdraw(name) {
    const sharesInput = document.getElementById(`withdraw-${name}`);
    const sharesToSell = parseFloat(sharesInput.value);
    const stock = stocks[name];

    if (!isNaN(sharesToSell) && sharesToSell > 0) {
      if (sharesToSell <= stock.shares) {
        const amount = sharesToSell * stock.price;
        stock.shares -= sharesToSell;
        balance += amount;
        document.getElementById("balance").innerText = balance.toFixed(2);
        document.getElementById(`shares-${name}`).innerText = stock.shares.toFixed(2);
        sharesInput.value = "";
      } else {
        alert("Not enough shares to withdraw this amount");
      }
    } else {
      alert("Invalid number of shares");
    }
  }

  const charts = {};

  function renderChart(name) {
    const ctx = document.getElementById(`chart-${name}`).getContext('2d');
    charts[name] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: stocks[name].history.length }, (_, i) => i),
        datasets: [{
          label: name + ' Price',
          data: stocks[name].history,
          borderColor: '#00c805',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#f0f3f5' }
          }
        },
        scales: {
          x: {
            ticks: { color: '#f0f3f5' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#f0f3f5' }
          }
        }
      }
    });
  }

  function updateChart(name) {
    const chart = charts[name];
    chart.data.labels.push(chart.data.labels.length);
    chart.data.datasets[0].data = stocks[name].history;
    chart.update();
  }

  const itemCounts = {
    "Gaming PC": 0,
    "Vacation": 0,
    "Sports Car": 0,
    "Private Jet": 0
  };

  function updateItemCounts() {
    items.forEach(item => {
      const countElement = document.getElementById(`count-${item.name}`);
      if (countElement) {
        countElement.textContent = itemCounts[item.name];
      }
    });
  }

  function createItemCards() {
    const container = document.getElementById("items");
    container.innerHTML = "";
    items.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-md-3";
      const card = document.createElement("div");
      card.className = "item-card position-relative";
      card.innerHTML = `
        <h5>${item.name}</h5>
        <p>Price: $${item.price.toLocaleString()}</p>
        <button class="btn btn-custom" onclick="buyItem('${item.name}', ${item.price})">Buy</button>
        <span id="count-${item.name}" class="position-absolute bottom-0 end-0 me-2 mb-2" style="font-size: 1.2em;">${itemCounts[item.name]}</span>
      `;
      col.appendChild(card);
      container.appendChild(col);
    });
  }

  function createFlyingEmojis(emojis, duration, count) {
    for (let i = 0; i < count; i++) {
      const emoji = document.createElement("div");
      emoji.className = "fly-animation";
      emoji.style.left = `${Math.random() * 100}vw`;
      emoji.style.top = `${Math.random() * 100}vh`;
      emoji.style.animationDuration = `${Math.random() * 2 + duration}s`;
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      document.body.appendChild(emoji);

      setTimeout(() => emoji.remove(), duration * 1000); // Remove after animation ends
    }
  }

  function buyItem(name, price) {
    if (balance >= price) {
      balance -= price;
      document.getElementById("balance").innerText = balance.toFixed(2);
      alert(`You bought: ${name}!`);

      // Increment item count and update display
      itemCounts[name]++;
      updateItemCounts();

      // Trigger enhanced animations based on item purchased
      switch (name) {
        case "Gaming PC":
          createFlyingEmojis(["💻", "🖥️", "🕹️", "🎮", "📱"], 5, 30);
          break;
        case "Vacation":
          createFlyingEmojis(["🏖️", "🏨", "🌴", "✈️", "🌊", "🍹"], 10, 50);
          break;
        case "Sports Car":
          createFlyingEmojis(["🏎️", "🚗", "🛣️", "🚦", "🏁"], 15, 70);
          break;
        case "Private Jet":
          createFlyingEmojis(["✈️", "🛫", "🛬", "🎉", "🎊", "🌟"], 20, 100);
          break;
      }
    } else {
      alert("Not enough balance to buy this item.");
    }
    checkBalance();
  }

  // Initial setup
  generateFakeNews();
  createStockCards();
  createItemCards();
</script>

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/16dsyoshifalls.mp3'); // Change path as needed
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