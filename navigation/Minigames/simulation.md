---
layout: bootstrap
title: Simulation
description: Simulation Game
permalink: /simulation
Author: Zach
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
</style>
<nav class="navbar navbar-dark mb-4 px-4">
  <a class="navbar-brand text-light" href="#">Robinhood Market Game</a>
  <span class="navbar-text">Balance: $<span id="balance">10000</span></span>
  <button class="btn btn-custom" onclick="generateMarket()">Generate Market</button>
</nav>

<div class="container">
  <div id="stocks" class="row"></div>
</div>

<script>
  let balance = 10000;
  const stocks = {
    "TechCorp": { price: 100, history: [100], shares: 0 },
    "MemeInc": { price: 50, history: [50], shares: 0 },
    "AIWorks": { price: 200, history: [200], shares: 0 }
  };

  function createStockCards() {
    const container = document.getElementById("stocks");
    for (let name in stocks) {
      const col = document.createElement("div");
      col.className = "col-md-4";

      const card = document.createElement("div");
      card.className = "stock-card";
      card.innerHTML = `
<h4 class="mb-2">${name}</h4>
<canvas id="chart-${name}"></canvas>
<p class="mt-3">Price: $<span id="price-${name}">${stocks[name].price}</span></p>
<div class="input-group mb-3">
<input type="number" class="form-control" id="invest-${name}" placeholder="Amount to Invest">
<button class="btn btn-custom" onclick="invest('${name}')">Invest</button>
  </div>
`;

      col.appendChild(card);
      container.appendChild(col);
      renderChart(name);
    }
  }

  function generateMarket() {
    for (let name in stocks) {
      const stock = stocks[name];
      const change = (Math.random() - 0.5) * 20;
      stock.price = Math.max(1, stock.price + change);
      stock.history.push(stock.price);
      document.getElementById(`price-${name}`).innerText = stock.price.toFixed(2);
      updateChart(name);
    }
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
      amountInput.value = "";
    } else {
      alert("Invalid investment amount");
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

  createStockCards();
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