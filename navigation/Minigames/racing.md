---
layout: bootstrap
title: Racing
description: Racing Game
permalink: /racing  
Author: Ian
---

<style>
  body {
    margin: 0;
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    user-select: none;
  }
  canvas {
    display: block;
    margin: auto;
    background: radial-gradient(circle, #0d1117 0%, #000000 80%);
  }
  #hud {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 14px;
    line-height: 1.5;
    user-select: none;
  }
  #menu, #winScreen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #161b22dd;
    padding: 20px 40px;
    border-radius: 10px;
    text-align: center;
    color: #58a6ff;
    font-weight: 600;
    font-size: 22px;
    display: none;
  }
  #menu button, #winScreen button {
    margin-top: 15px;
    background: #238636;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
  }
  #menu button:hover, #winScreen button:hover {
    background: #2ea043;
  }
</style>

<div id="hud"></div>

<div id="menu">
  GitHub Racing!<br />
  Press <b>Space</b> to Start
</div>

<div id="winScreen">
  You Win!<br />
  <div id="finalTime"></div>
  <button id="restartBtn">Restart</button>
</div>

<canvas id="gameCanvas" width="800" height="600"></canvas>

<script>
(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const hud = document.getElementById('hud');
  const menu = document.getElementById('menu');
  const winScreen = document.getElementById('winScreen');
  const restartBtn = document.getElementById('restartBtn');
  const finalTimeEl = document.getElementById('finalTime');

  const GAME_STATE = { MENU: 0, COUNTDOWN: 1, PLAYING: 2, WIN: 3 };
  let currentState = GAME_STATE.MENU;

  let countdown = 3; // Countdown timer
  let countdownInterval;

  // Path points loop
  const path = [
    {x: 100, y: 540},
    {x: 150, y: 380},
    {x: 240, y: 300},
    {x: 350, y: 300},
    {x: 440, y: 360},
    {x: 520, y: 480},
    {x: 640, y: 480},
    {x: 730, y: 400},
    {x: 730, y: 300},
    {x: 600, y: 150},
    {x: 470, y: 140},
    {x: 360, y: 190},
    {x: 300, y: 280},
    {x: 200, y: 380}
  ];

    // Define red start/finish line between these two points (index 13 -> 0)
    // Replace this:
  // const startLine = { from: path[path.length - 1], to: path[0] };

  // With a vertical finish line segment:
  const finishLineX = 400;  // X position of finish line, adjust as needed
  const finishLineY1 = 290; // vertical line start Y
  const finishLineY2 = 340; // vertical line end Y

  const startLine = { from: {x: finishLineX, y: finishLineY1}, to: {x: finishLineX, y: finishLineY2} };


  function createCar(color) {
    return {
      pos: 0,
      t: 0,
      lap: 1,
      stunned: 0,
      obstaclePenalty: 0,
      boost: 0,
      color: color,
      item: null,
      passedStartLine: false // track if car crossed start line this lap
    };
  }

  const player = createCar('#58a6ff');
  const npcs = [
    createCar('#ff7b72'),
    createCar('#eac55e'),
    createCar('#8bc34a')
  ];

  const cars = [player, ...npcs];

  const keys = { w: false, s: false, a: false, d: false, space: false };

  let obstacles = [];
  const obstacleSpawnInterval = 8000;
  let obstacleTimer = 0;
  let obstacleActiveDuration = 4000;
  let obstacleActive = false;

  let powerUps = [];
  const powerUpSpawnInterval = 15000;
  let powerUpTimer = 0;

  let lapMessage = '';
  let gameEnded = false;
  let startTime = 0;
  let elapsedTime = 0;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getCarXY(car) {
    const p1 = path[car.pos];
    const p2 = path[(car.pos + 1) % path.length];
    const x = lerp(p1.x, p2.x, car.t);
    const y = lerp(p1.y, p2.y, car.t);
    return { x, y };
  }

  // Line intersection helper for start line detection
  function lineSegmentsIntersect(p1, p2, q1, q2) {
    // Based on vector cross product
    function ccw(a,b,c) {
      return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    }
    return (ccw(p1,q1,q2) !== ccw(p2,q1,q2)) && (ccw(p1,p2,q1) !== ccw(p1,p2,q2));
  }

  function drawTrack() {
    // Track wide path
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Path points for reference
    ctx.fillStyle = '#21262d';
    path.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fill();
    });

  // Replace the old start/finish line drawing with this:
  ctx.strokeStyle = '#ff4136'; // bright red
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(startLine.from.x, startLine.from.y);
  ctx.lineTo(startLine.to.x, startLine.to.y);
  ctx.stroke();

  }

  function drawCar(car) {
    const { x, y } = getCarXY(car);
    const nextPoint = path[(car.pos + 1) % path.length];
    const angle = Math.atan2(nextPoint.y - y, nextPoint.x - x);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = car.color;
    ctx.shadowColor = car.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw item indicator on player car
    if (car === player && car.item) {
      ctx.fillStyle = car.item === 'shell' ? '#FF6347' : '#FFA500';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(car.item === 'shell' ? '🐢' : '🍄', 0, -25);
    }

    ctx.restore();
  }

  function spawnObstacle() {
    // Pick a random position along the path but away from start line
    const index = Math.floor(Math.random() * (path.length - 3)) + 2;
    const base = path[index];
    obstacles.push({
      x: base.x + (Math.random() * 60 - 30),
      y: base.y + (Math.random() * 60 - 30),
      radius: 18,
      alpha: 1
    });
  }

  function drawObstacles() {
    if (!obstacleActive) return;
    obstacles.forEach(o => {
      ctx.fillStyle = `rgba(255, 130, 0, ${o.alpha})`;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function checkObstacleCollision(car) {
    if (!obstacleActive) return false;
    const { x, y } = getCarXY(car);
    for (const o of obstacles) {
      const dx = x - o.x;
      const dy = y - o.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 15 + o.radius) {
        return true;
      }
    }
    return false;
  }

  function spawnPowerUp() {
    // Random location along path excluding near start line
    const index = Math.floor(Math.random() * (path.length - 4)) + 3;
    const base = path[index];
    const types = ['shell', 'mushroom'];
    powerUps.push({
      x: base.x + (Math.random() * 60 - 30),
      y: base.y + (Math.random() * 60 - 30),
      radius: 14,
      type: types[Math.floor(Math.random() * types.length)],
      alpha: 1,
      collected: false
    });
  }

  function drawPowerUps() {
    powerUps.forEach(pu => {
      if (pu.collected) return;
      ctx.fillStyle = pu.type === 'shell' ? '#FF6347' : '#FFA500';
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, pu.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(pu.type === 'shell' ? '🐢' : '🍄', pu.x, pu.y + 6);
    });
  }

  function checkPowerUpCollision(car) {
    if (car.item) return; // Only 1 item at a time
    const { x, y } = getCarXY(car);
    for (const pu of powerUps) {
      if (pu.collected) continue;
      const dx = x - pu.x;
      const dy = y - pu.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 15 + pu.radius) {
        pu.collected = true;
        car.item = pu.type;
      }
    }
  }

  function usePowerUp(car) {
    if (!car.item) return;

    if (car.item === 'shell') {
      // Fire shell to stun closest NPC ahead
      let target = null;
      let minDist = Infinity;
      const playerPos = car.pos + car.t;

      for (const npc of npcs) {
        if (npc.stunned > 0) continue;
        let npcPos = npc.pos + npc.t;
        let dist = npcPos - playerPos;
        if (dist < 0) dist += path.length; // loop adjustment
        if (dist > 0 && dist < minDist) {
          minDist = dist;
          target = npc;
        }
      }
      if (target) {
        target.stunned = 3000; // 3 seconds stunned
        lapMessage = 'Shell hit!';
        setTimeout(() => lapMessage = '', 2000);
      }
    } else if (car.item === 'mushroom') {
      car.boost = 5000; // 5 seconds speed boost
      lapMessage = 'Speed Boost!';
      setTimeout(() => lapMessage = '', 2000);
    }

    car.item = null;
  }

  // Update drawHUD to show NPC laps and positions
  function drawHUD() {
    let html = `<strong>Your Lap:</strong> ${player.lap}/3`;
    if (player.item) html += `&nbsp;<strong>Item:</strong> ${player.item === 'shell' ? '🐢 Shell' : '🍄 Mushroom'}`;
    if (lapMessage) html += `<br><span style="color:#58a6ff;font-weight:bold">${lapMessage}</span>`;
    if (!gameEnded && currentState === GAME_STATE.PLAYING) {
      html += `<br><span style="color:#ffbe00">Avoid obstacles! Use <b>Space</b> to use item.</span>`;
    }
    if (obstacleActive) {
      html += `<br><span style="color:#ff4136">Obstacles active!</span>`;
    }
    html += `<br><strong>Time:</strong> ${(elapsedTime / 1000).toFixed(2)}s`;

    // Add NPC lap info
    npcs.forEach((npc, i) => {
      html += `<br><span style="color:${npc.color}">NPC ${i+1}: Lap ${npc.lap}/3</span>`;
    });

    hud.innerHTML = html;
  }

  // Inside moveCar, tweak NPC speed to be faster than player:
  function moveCar(car, dt, isPlayer = false) {
    if (currentState !== GAME_STATE.PLAYING) return;
    if (car.stunned > 0) {
      car.stunned -= dt;
      if (car.stunned < 0) car.stunned = 0;
      return;
    }

    let baseSpeed = 0.002 * dt;

    if (car.obstaclePenalty > 0) {
      baseSpeed *= 0.5;
      car.obstaclePenalty -= dt;
      if (car.obstaclePenalty < 0) car.obstaclePenalty = 0;
    }

    if (car.boost > 0) {
      baseSpeed *= 1.8;
      car.boost -= dt;
      if (car.boost < 0) car.boost = 0;
    }

    if (isPlayer) {
      if (keys.w) baseSpeed *= 2.0;
      if (keys.s) baseSpeed *= 0.4;
      if (keys.a) {
        car.t -= 0.0008 * dt;
        if (car.t < 0) {
          car.t += 1;
          car.pos = (car.pos - 1 + path.length) % path.length;
        }
      }
      if (keys.d) {
        car.t += 0.0008 * dt;
        if (car.t > 1) {
          car.t -= 1;
          car.pos = (car.pos + 1) % path.length;
        }
      }
    } else {
      // NPC speed 20-30% faster base speed + simple obstacle slowdown
      let speedMultiplier = 1.25; // adjust speed advantage here

      const { x, y } = getCarXY(car);
      let nearObstacle = false;
      for (const o of obstacles) {
        if (!obstacleActive) break;
        const dx = x - o.x;
        const dy = y - o.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 70) {
          nearObstacle = true;
          break;
        }
      }
      baseSpeed *= speedMultiplier;
      baseSpeed *= nearObstacle ? 0.6 : 1 + 0.1 * Math.sin(car.t * 10);
    }

    car.t += baseSpeed;
    while (car.t > 1) {
      car.t -= 1;
      car.pos = (car.pos + 1) % path.length;
    }
    while (car.t < 0) {
      car.t += 1;
      car.pos = (car.pos - 1 + path.length) % path.length;
    }

    // Detect crossing start line for lap increment (unchanged)
    const prevPos = car.pos === 0 ? path.length - 1 : car.pos - 1;
    const prevPoint = lerpPoint(path[prevPos], path[car.pos], car.t - baseSpeed);
    const currPoint = lerpPoint(path[car.pos], path[(car.pos + 1) % path.length], car.t);

    if (lineSegmentsIntersect(prevPoint, currPoint, startLine.from, startLine.to)) {
      if (!car.passedStartLine) {
        car.lap++;
        if (car.lap > 3) {
          if (car === player) {
            gameEnded = true;
            currentState = GAME_STATE.WIN;
            elapsedTime = performance.now() - startTime;
            finalTimeEl.textContent = `Your time: ${(elapsedTime / 1000).toFixed(2)}s`;
            winScreen.style.display = 'block';
          } else {
            // NPC wins
            gameEnded = true;
            currentState = GAME_STATE.WIN;
            finalTimeEl.textContent = `NPC won the race!`;
            winScreen.style.display = 'block';
          }
        }
        car.passedStartLine = true;
        if (car === player) {
          lapMessage = `Lap ${car.lap}`;
          setTimeout(() => lapMessage = '', 2500);
        }
      }
    } else {
      car.passedStartLine = false;
    }
  }


  function checkLap(car) {
  const prevPos = car.pos === 0 ? path.length - 1 : car.pos - 1;
  const prevPoint = lerpPoint(path[prevPos], path[car.pos], car.t);
  const currPoint = getCarXY(car);

  // Check if car crosses the vertical finish line between last frame and this frame
  // We consider crossing if the car moves from left side (x < finishLineX) to right side (x > finishLineX)
  // or vice versa, but only count crossing going forward (left to right) to prevent double counting.

  // Here we detect crossing from left to right only:
  if (prevPoint.x < finishLineX && currPoint.x >= finishLineX) {
    // Also check that y position is within the vertical line segment's range
    const yCross = lerp(prevPoint.y, currPoint.y, (finishLineX - prevPoint.x) / (currPoint.x - prevPoint.x));
    if (yCross >= finishLineY1 && yCross <= finishLineY2) {
      if (!car.passedStartLine) {
        car.lap++;
        car.passedStartLine = true;
        if (car === player) {
          lapMessage = `Lap ${car.lap} completed!`;
        }
        if (car.lap > 3) {
          if (car === player) {
            currentState = GAME_STATE.WIN;
            elapsedTime = Date.now() - startTime;
            finalTimeEl.textContent = `Time: ${(elapsedTime / 1000).toFixed(2)}s`;
            winScreen.style.display = 'block';
          }
        }
      }
    }
  } else if (currPoint.x < finishLineX - 10) {
    // Reset passed flag once car is sufficiently left of finish line so next crossing counts
    car.passedStartLine = false;
  }
}


  function lerpPoint(p1, p2, t) {
    // Clamp t between 0 and 1 for safety
    t = Math.min(Math.max(t, 0), 1);
    return { x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t) };
  }

  function update(dt) {
    if (currentState !== GAME_STATE.PLAYING) return;

    elapsedTime = performance.now() - startTime;

    obstacleTimer += dt;
    powerUpTimer += dt;

    if (obstacleTimer > obstacleSpawnInterval) {
      obstacles = [];
      spawnObstacle();
      obstacleActive = true;
      obstacleTimer = 0;
      setTimeout(() => { obstacleActive = false; obstacles = []; }, obstacleActiveDuration);
    }

    if (powerUpTimer > powerUpSpawnInterval) {
      spawnPowerUp();
      powerUpTimer = 0;
    }

    // Move cars
    cars.forEach(car => {
      if (checkObstacleCollision(car)) {
        car.obstaclePenalty = 1500; // slow down 1.5 sec
      }
      moveCar(car, dt, car === player);
      checkPowerUpCollision(car);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawObstacles();
    drawPowerUps();
    cars.forEach(drawCar);
    drawHUD();
  }

  let lastTime = performance.now();

  function gameLoop(ts) {
    const dt = ts - lastTime;
    lastTime = ts;
    if (currentState === GAME_STATE.PLAYING) update(dt);
    draw();
    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    player.pos = 0;
    player.t = 0;
    player.lap = 1;
    player.stunned = 0;
    player.boost = 0;
    player.item = null;
    player.passedStartLine = false;

    npcs.forEach(npc => {
      npc.pos = Math.floor(Math.random() * path.length);
      npc.t = Math.random();
      npc.lap = 1;
      npc.stunned = 0;
      npc.boost = 0;
      npc.item = null;
      npc.passedStartLine = false;
    });

    obstacles = [];
    powerUps = [];
    obstacleTimer = 0;
    powerUpTimer = 0;
    obstacleActive = false;
    lapMessage = '';
    gameEnded = false;
    elapsedTime = 0;
    startTime = performance.now();
    currentState = GAME_STATE.PLAYING;
    menu.style.display = 'none';
    winScreen.style.display = 'none';
  }

  function startCountdown() {
    countdown = 3;
    currentState = GAME_STATE.COUNTDOWN;
    menu.style.display = 'none';
    winScreen.style.display = 'none';

    const countdownEl = document.createElement('div');
    countdownEl.id = 'countdown';
    countdownEl.style.position = 'absolute';
    countdownEl.style.top = '50%';
    countdownEl.style.left = '50%';
    countdownEl.style.transform = 'translate(-50%, -50%)';
    countdownEl.style.fontSize = '48px';
    countdownEl.style.color = '#ff4136';
    countdownEl.style.fontWeight = 'bold';
    document.body.appendChild(countdownEl);

    countdownInterval = setInterval(() => {
      if (countdown > 0) {
        countdownEl.textContent = countdown;
        countdown--;
      } else {
        clearInterval(countdownInterval);
        document.body.removeChild(countdownEl);
        currentState = GAME_STATE.PLAYING;
        startGame();
      }
    }, 1000);
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (currentState === GAME_STATE.MENU) {
        startCountdown();
      } else if (currentState === GAME_STATE.PLAYING) {
        usePowerUp(player);
      }
      e.preventDefault();
    }
    if (currentState === GAME_STATE.PLAYING) {
      if (e.key.toLowerCase() === 'w') keys.w = true;
      if (e.key.toLowerCase() === 's') keys.s = true;
      if (e.key.toLowerCase() === 'a') keys.a = true;
      if (e.key.toLowerCase() === 'd') keys.d = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (currentState === GAME_STATE.PLAYING) {
      if (e.key.toLowerCase() === 'w') keys.w = false;
      if (e.key.toLowerCase() === 's') keys.s = false;
      if (e.key.toLowerCase() === 'a') keys.a = false;
      if (e.key.toLowerCase() === 'd') keys.d = false;
    }
  });

  restartBtn.addEventListener('click', () => {
    currentState = GAME_STATE.MENU;
    winScreen.style.display = 'none';
    menu.style.display = 'block';
  });

  menu.style.display = 'block';
  requestAnimationFrame(gameLoop);
})();
</script>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/29rainbowroad.mp3'); // Change path as needed
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
