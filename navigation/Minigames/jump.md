---
layout: bootstrap
title: Road
description: Road Game
permalink: /road
Author: Aarush
---

<script>
// filepath: /home/kasm-user/nighthawk/GenomeGamersFrontend/navigation/Worlds/world0.md
// ...existing code...

// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/18moonviewhighway.mp3'); // Change path as needed
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

<h2>Crossy Road Minigame</h2>
<canvas id="crossyCanvas" width="400" height="500" style="border:1px solid #333; background:#b3e6b3"></canvas>
<p id="crossyScore"></p>
<script>
const canvas = document.getElementById('crossyCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 10;
const COLS = 8;
const CELL = 50;
const PLAYER_SIZE = 40;
const CAR_HEIGHT = 40;
const CAR_WIDTH = 60;

let player = { x: Math.floor(COLS/2), y: ROWS-1 };
let score = 0;
let gameOver = false;

function randomCarRow() {
  // Cars only on rows 1-8 (not start/end)
  let rows = [];
  for (let i = 1; i < ROWS-1; i++) rows.push(i);
  return rows;
}

let cars = [];
function addCarRowAtTop() {
  // Randomly decide to add a car or not in each lane
  for (let col = 0; col < COLS; col++) {
    if (Math.random() < 0.5) {
      let dir = Math.random() > 0.5 ? 1 : -1;
      let speed = 1 + Math.random() * 2;
      let x = dir === 1 ? -CAR_WIDTH : canvas.width;
      cars.push({ x, y: 1, dir, speed, col });
    }
  }
}
function resetCars() {
  cars = [];
  // Fill initial cars except for row 0 and last row
  for (let row = 1; row < ROWS-1; row++) {
    for (let col = 0; col < COLS; col++) {
      if (Math.random() < 0.5) {
        let dir = Math.random() > 0.5 ? 1 : -1;
        let speed = 1 + Math.random() * 2;
        let x = dir === 1 ? -CAR_WIDTH : canvas.width;
        cars.push({ x, y: row, dir, speed, col });
      }
    }
  }
}
resetCars();

function drawPlayer() {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#222";
  ctx.beginPath();
  ctx.arc(
    player.x * CELL + CELL/2,
    player.y * CELL + CELL/2,
    PLAYER_SIZE/2, 0, 2*Math.PI
  );
  ctx.fill();
  ctx.stroke();
  // Draw beak
  ctx.beginPath();
  ctx.moveTo(player.x*CELL+CELL/2, player.y*CELL+CELL/2);
  ctx.lineTo(player.x*CELL+CELL/2+10, player.y*CELL+CELL/2-5);
  ctx.lineTo(player.x*CELL+CELL/2+10, player.y*CELL+CELL/2+5);
  ctx.closePath();
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.restore();
}

function drawCars() {
  for (let car of cars) {
    ctx.save();
    ctx.fillStyle = "#f55";
    ctx.fillRect(car.x, car.y*CELL + (CELL-CAR_HEIGHT)/2, CAR_WIDTH, CAR_HEIGHT);
    ctx.strokeRect(car.x, car.y*CELL + (CELL-CAR_HEIGHT)/2, CAR_WIDTH, CAR_HEIGHT);
    ctx.restore();
  }
}

function moveCars() {
  for (let car of cars) {
    car.x += car.dir * car.speed;
    // Loop cars horizontally
    if (car.dir === 1 && car.x > canvas.width) car.x = -CAR_WIDTH;
    if (car.dir === -1 && car.x < -CAR_WIDTH) car.x = canvas.width;
  }
}

function checkCollision() {
  for (let car of cars) {
    let px = player.x * CELL + CELL/2;
    let py = player.y * CELL + CELL/2;
    let cx = car.x + CAR_WIDTH/2;
    let cy = car.y*CELL + CELL/2;
    if (
      Math.abs(px - cx) < (CAR_WIDTH/2 + PLAYER_SIZE/2 - 10) &&
      Math.abs(py - cy) < (CAR_HEIGHT/2 + PLAYER_SIZE/2 - 10)
    ) {
      return true;
    }
  }
  return false;
}

function drawGoal() {
  ctx.save();
  ctx.fillStyle = "#ffe066";
  ctx.fillRect(0, 0, canvas.width, CELL);
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGoal();
  drawCars();
  drawPlayer();
}

function update() {
  if (gameOver) return;
  moveCars();
  if (checkCollision()) {
    gameOver = true;
    document.getElementById('crossyScore').textContent = "Game Over! Score: " + score;
    return;
  }
  if (player.y === 0) {
    score++;
    // Move everything down by one row
    player.y++;
    for (let car of cars) {
      car.y++;
    }
    // Remove cars that go off the bottom
    cars = cars.filter(car => car.y < ROWS-1);
    // Add new car row at the top
    addCarRowAtTop();
    document.getElementById('crossyScore').textContent = "Score: " + score;
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}
gameLoop();

document.addEventListener('keydown', function(e) {
  if (gameOver) return;
  if (e.key === "ArrowUp" && player.y > 0) player.y--;
  if (e.key === "ArrowDown" && player.y < ROWS-1) player.y++;
  if (e.key === "ArrowLeft" && player.x > 0) player.x--;
  if (e.key === "ArrowRight" && player.x < COLS-1) player.x++;
});

document.getElementById('crossyScore').textContent = "Score: 0";
</script>


