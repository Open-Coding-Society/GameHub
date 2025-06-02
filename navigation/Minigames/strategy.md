---
layout: bootstrap
title: Strategy Game
description: Shoot the bird at the blocks and enemies to score high!
permalink: /strategy
Author: Zach
---

<div class="row">
  <div class="col-md-12 text-center" style="margin-top: 20px;">
    <div style="background-color: black; color: white; padding: 15px; border-radius: 8px;">
      <h3>Strategy Game</h3>
      <p>Shoot the bird at the blocks and enemies to score high! Try to destroy as much as possible in two shots.</p>
      <p>After your second shot, you'll see your destroyed percent and can play again.</p>
      <p>If you destroy everything you'll see a special screen!</p>
    </div>
  </div>
</div>

<canvas id="gameCanvas" width="900" height="450" style="border:1px solid #333; display:block; margin:auto;"></canvas>

<script>
// --- Background Music ---
const music = new Audio('{{site.baseurl}}/assets/audio/15delfinosquare.mp3');
music.loop = true;
music.volume = 0.5;
function startMusicOnce() {
  music.play().catch(() => {});
  window.removeEventListener('click', startMusicOnce);
  window.removeEventListener('keydown', startMusicOnce);
}
window.addEventListener('click', startMusicOnce);
window.addEventListener('keydown', startMusicOnce);

// --- Game Setup ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load Images
const birdImg = new Image(); birdImg.src = "{{site.baseurl}}/images/item1.png";
const enemyImg = new Image(); enemyImg.src = "{{site.baseurl}}/images/item2.png";
const tntImg = new Image(); tntImg.src = "{{site.baseurl}}/images/item3.png";
const woodImg = new Image(); woodImg.src = "{{site.baseurl}}/images/item4.png";
const bgImg = new Image(); bgImg.src = "{{site.baseurl}}/images/item5.png";

// Game Variables
let gravity = 0.5;
let launched = false;
let dragging = false;
let gameEnded = false;
let starsEarned = 0;

const bird = {
  x: 150, y: 325, // moved down by 25px
  yInit: 325,
  radius: 20,
  vx: 0, vy: 0,
  img: birdImg,
  dragStart: null,
  reset() {
    this.x = 150; this.y = this.yInit;
    this.vx = 0; this.vy = 0;
    launched = false;
    dragging = false;
    gameEnded = false;
    starsEarned = 0;
    document.getElementById('restartBtn').style.display = 'none';
    updateStarBar(0);
    setupGame();
  }
};

let enemies = [];
let blocks = [];
let tnts = [];
let playAgainBtn = null;
let endScreen = null;
let shots = 0;
let destroyedPercent = 0;
let percentPopup = null;
let stillTimer = null;

// Setup Game Elements
function setupGame() {
  blocks = [];
  tnts = [];
  enemies = [];
  shots = 0;
  destroyedPercent = 0;
  if (percentPopup) {
    percentPopup.remove();
    percentPopup = null;
  }
  if (endScreen) {
    endScreen.remove();
    endScreen = null;
    playAgainBtn = null;
  }
  if (stillTimer) {
    clearTimeout(stillTimer);
    stillTimer = null;
  }

  // Ensure TNTs remain broken after the first shot
  tnts.forEach(tnt => {
    if (tnt.exploded && shots > 0) {
      tnt.exploded = true; // Keep TNT broken
    } else {
      tnt.exploded = false; // Reset explosion radius for first shot
    }
  });

  // 10x5 grid, each cell is 40x40, start at (480,220)
  // Layout string: 5 rows of 10 chars each, left to right, top to bottom
  // + = green guy, * = tnt, - = wood
  const layout = [
    "+-+*--*---",
    "-*--+-+--*",
    "-*-+--*-+-",
    "-*+---*-+-",
    "*--*--+-+-"
  ];
  const blockW = 40, blockH = 40;
  const startX = 480, startY = 220;

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 10; c++) {
      const ch = layout[r][c];
      const x = startX + c * blockW;
      const y = startY + r * blockH;
      if (ch === '-') {
        blocks.push({ x, y, w: blockW, h: blockH, broken: false, img: woodImg });
      } else if (ch === '*') {
        tnts.push({ x, y, w: blockW * 1.2, h: blockH * 1.2, exploded: false, img: tntImg, grid: [r, c] });
      } else if (ch === '+') {
        blocks.push({ x, y, w: blockW, h: blockH, broken: false, img: woodImg });
        enemies.push({
          x: x + blockW / 2 - 20,
          y: y - 40,
          w: 40,
          h: 40,
          alive: true,
          img: enemyImg
        });
      }
    }
  }
}

setupGame();

// Input
canvas.addEventListener("mousedown", (e) => {
  if (!launched && !gameEnded) {
    let dx = e.offsetX - bird.x;
    let dy = e.offsetY - bird.y;
    if (Math.sqrt(dx * dx + dy * dy) < bird.radius) {
      dragging = true;
      bird.dragStart = { x: e.offsetX, y: e.offsetY };
    }
  }
});
canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    bird.dragStart = { x: e.offsetX, y: e.offsetY };
  }
});
canvas.addEventListener("mouseup", (e) => {
  if (dragging) {
    dragging = false;
    let dx = bird.x - e.offsetX;
    if (dx > 0) {
      launched = true;
      bird.vx = dx * 0.2;
      bird.vy = (bird.y - e.offsetY) * 0.2;
    }
  }
});

// Collision Detection
function checkCollision(a, b) {
  return a.x < b.x + b.w && a.x + bird.radius * 2 > b.x &&
         a.y < b.y + b.h && a.y + bird.radius * 2 > b.y;
}

function explodeTNT(tnt) {
  tnt.exploded = true;
  // Explosion: kill enemies and break blocks in a radius (1.5x as big as before)
  // Also break 2 tiles up/down/left/right and 1 diagonal in all 4 directions
  const blockW = 40, blockH = 40;
  const centerX = tnt.x + tnt.w / 2;
  const centerY = tnt.y + tnt.h / 2;
  // Break blocks in cross (2 up/down/left/right)
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      if (dr === 0 && dc === 0) continue;
      // Only cross and diagonals
      if (Math.abs(dr) === Math.abs(dc) || dr === 0 || dc === 0) {
        const bx = tnt.x + dc * blockW;
        const by = tnt.y + dr * blockH;
        blocks.forEach(b => {
          if (!b.broken && Math.abs(b.x + b.w / 2 - bx - blockW / 2) < 1 && Math.abs(b.y + b.h / 2 - by - blockH / 2) < 1) {
            b.broken = true;
          }
        });
        tnts.forEach(otherTnt => {
          if (!otherTnt.exploded && otherTnt !== tnt && Math.abs(otherTnt.x - bx) < 1 && Math.abs(otherTnt.y - by) < 1) {
            explodeTNT(otherTnt);
          }
        });
      }
    }
  }
  // Also break blocks in a 1.5x bigger radius
  blocks.forEach(b => {
    if (!b.broken && Math.hypot(centerX - (b.x + b.w / 2), centerY - (b.y + b.h / 2)) < 105) {
      b.broken = true;
    }
  });
  enemies.forEach(e => {
    if (e.alive && Math.hypot(centerX - (e.x + e.w / 2), centerY - (e.y + e.h / 2)) < 105) {
      e.alive = false;
    }
  });
}

// Game Loop
function update() {
  if (launched && !gameEnded) {
    bird.vy += gravity;
    bird.x += bird.vx;
    bird.y += bird.vy;

    // ground bounce
    if (bird.y + bird.radius > canvas.height) {
      bird.y = canvas.height - bird.radius;
      bird.vy *= -0.3;
      bird.vx *= 0.6;
    }

    // enemy hit
    enemies.forEach(e => {
      if (e.alive && checkCollision(bird, e)) e.alive = false;
    });

    // tnt hit
    tnts.forEach(tnt => {
      if (!tnt.exploded && checkCollision(bird, tnt)) explodeTNT(tnt);
    });

    // block break
    blocks.forEach(b => {
      if (!b.broken && checkCollision(bird, b)) b.broken = true;
    });

    // If bird is off screen or stuck at the bottom, handle respawn or end
    let stopped = Math.abs(bird.vx) < 0.1 && Math.abs(bird.vy) < 0.1 && bird.y + bird.radius >= canvas.height;
    let offscreen = (
      bird.x + bird.radius < 0 || bird.x - bird.radius > canvas.width ||
      bird.y + bird.radius < 0 || bird.y - bird.radius > canvas.height
    );

    let destroyedBlocks = blocks.filter(b => b.broken).length;
    let destroyedTNTs = tnts.filter(t => t.exploded).length;
    let destroyedEnemies = enemies.filter(e => !e.alive).length;
    let totalThings = blocks.length + tnts.length + enemies.length;
    let destroyed = destroyedBlocks + destroyedTNTs + destroyedEnemies;
    let destroyedPercentNow = Math.round((destroyed / totalThings) * 100);

    if ((stopped || offscreen) && !gameEnded) {
      if (shots === 0) {
        if (destroyedPercentNow === 100) {
          // Skip second shot and show gold end screen for 100% on first shot
          gameEnded = true;
          setTimeout(() => {
            if (!percentPopup) {
              percentPopup = document.createElement('div');
              percentPopup.textContent = `🎉 Destroyed: 100%`;
              Object.assign(percentPopup.style, {
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                backgroundColor: "gold", color: "black", padding: "30px",
                borderRadius: "12px", zIndex: "1001", textAlign: "center", fontSize: "2em", fontWeight: "bold"
              });
              document.body.appendChild(percentPopup);
            }
            setTimeout(() => {
              if (!endScreen) {
                endScreen = document.createElement('div');
                Object.assign(endScreen.style, {
                  display: 'flex', position: 'fixed', top: 'calc(50% + 80px)', left: '50%', transform: "translate(-50%, 0)",
                  background: 'none', color: 'white', justifyContent: 'center', alignItems: 'center',
                  flexDirection: 'column', zIndex: '1002'
                });
                playAgainBtn = document.createElement('button');
                playAgainBtn.textContent = '🔁 Play Again';
                playAgainBtn.style.padding = '10px 20px';
                playAgainBtn.style.fontSize = '18px';
                playAgainBtn.style.background = '#FFD700';
                playAgainBtn.style.color = 'black';
                playAgainBtn.style.border = 'none';
                playAgainBtn.style.borderRadius = '5px';
                playAgainBtn.style.cursor = 'pointer';
                playAgainBtn.onclick = () => {
                  if (endScreen) endScreen.remove();
                  endScreen = null;
                  playAgainBtn = null;
                  if (percentPopup) percentPopup.remove();
                  percentPopup = null;
                  starsEarned = 0;
                  launched = false;
                  dragging = false;
                  gameEnded = false;
                  shots = 0;
                  destroyedPercent = 0;
                  setupGame();
                  bird.x = 150; bird.y = bird.yInit; bird.vx = 0; bird.vy = 0;
                  draw();
                };
                endScreen.appendChild(playAgainBtn);
                document.body.appendChild(endScreen);
              }
              endScreen.style.display = 'flex';
            }, 1200);
          }, 500);
        } else {
          // Respawn bird after 1 second if stuck or offscreen
          if (!stillTimer) {
            stillTimer = setTimeout(() => {
              bird.x = 150; bird.y = bird.yInit; bird.vx = 0; bird.vy = 0;
              launched = false;
              dragging = false;
              stillTimer = null;
              shots++;
            }, 1000);
          }
        }
      } else if (shots === 1) {
        // Wait 1s of being stopped or offscreen before ending game
        if (!stillTimer) {
          stillTimer = setTimeout(() => {
            shots++;
            endGame();
            stillTimer = null;
          }, 1000);
        }
      }
    } else if (!(stopped || offscreen) && stillTimer) {
      clearTimeout(stillTimer);
      stillTimer = null;
    }
  }
}

function endGame() {
  if (gameEnded) return;
  gameEnded = true;
  let destroyedBlocks = blocks.filter(b => b.broken).length;
  let destroyedTNTs = tnts.filter(t => t.exploded).length;
  let destroyedEnemies = enemies.filter(e => !e.alive).length;
  let totalThings = blocks.length + tnts.length + enemies.length;
  let destroyed = destroyedBlocks + destroyedTNTs + destroyedEnemies;
  destroyedPercent = Math.round((destroyed / totalThings) * 100);

  if (!percentPopup) {
    percentPopup = document.createElement('div');
    percentPopup.textContent = `Destroyed: ${destroyedPercent}%`;
    Object.assign(percentPopup.style, {
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      backgroundColor: destroyedPercent === 100 ? "gold" : "rgba(0, 0, 0, 0.85)", // Gold for 100%
      color: destroyedPercent === 100 ? "black" : "white",
      padding: "30px", borderRadius: "12px", zIndex: "1001", textAlign: "center", fontSize: "2em"
    });
    document.body.appendChild(percentPopup);

    // Add confetti effect for 100%
    if (destroyedPercent === 100) {
      const confettiCanvas = document.createElement('canvas');
      confettiCanvas.id = 'confettiCanvas';
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.top = '0';
      confettiCanvas.style.left = '0';
      confettiCanvas.style.width = '100vw';
      confettiCanvas.style.height = '100vh';
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.zIndex = '1002';
      document.body.appendChild(confettiCanvas);

      const confettiCtx = confettiCanvas.getContext('2d');
      const confettiParticles = Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 5 + 2,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      }));

      function drawConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach(p => {
          confettiCtx.fillStyle = p.color;
          confettiCtx.beginPath();
          confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          confettiCtx.fill();
          p.x += p.dx;
          p.y += p.dy;
          if (p.y > window.innerHeight) p.y = 0;
          if (p.x > window.innerWidth || p.x < 0) p.dx *= -1;
        });
        requestAnimationFrame(drawConfetti);
      }

      drawConfetti();

      setTimeout(() => {
        document.body.removeChild(confettiCanvas);
      }, 5000); // Remove confetti after 5 seconds
    }
  }

  setTimeout(() => {
    if (!endScreen) {
      endScreen = document.createElement('div');
      Object.assign(endScreen.style, {
        display: 'flex', position: 'fixed', top: 'calc(50% + 80px)', left: '50%', transform: "translate(-50%, 0)",
        background: 'none', color: 'white', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column', zIndex: '1002'
      });
      playAgainBtn = document.createElement('button');
      playAgainBtn.textContent = '🔁 Play Again';
      playAgainBtn.style.padding = '10px 20px';
      playAgainBtn.style.fontSize = '18px';
      playAgainBtn.style.background = destroyedPercent === 100 ? '#FFD700' : '#4caf50'; // Gold for 100%
      playAgainBtn.style.color = destroyedPercent === 100 ? 'black' : 'white';
      playAgainBtn.style.border = 'none';
      playAgainBtn.style.borderRadius = '5px';
      playAgainBtn.style.cursor = 'pointer';
      playAgainBtn.onclick = () => {
        if (endScreen) endScreen.remove();
        endScreen = null;
        playAgainBtn = null;
        if (percentPopup) percentPopup.remove();
        percentPopup = null;
        starsEarned = 0;
        launched = false;
        dragging = false;
        gameEnded = false;
        shots = 0;
        destroyedPercent = 0;
        setupGame();
        bird.x = 150; bird.y = bird.yInit; bird.vx = 0; bird.vy = 0;
        draw();
      };
      endScreen.appendChild(playAgainBtn);
      document.body.appendChild(endScreen);
    }
    endScreen.style.display = 'flex';
  }, 1200);
}

function updateStarBar(stars) {
  // No-op: star bar removed
}

function drawSlingshot() {
  // Draw slingshot base, moved down by 25px
  ctx.save();
  ctx.strokeStyle = "#8B5A2B";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(150, 345);
  ctx.lineTo(150, 395);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(170, 345);
  ctx.lineTo(170, 395);
  ctx.stroke();
  ctx.restore();

  // Draw elastic if dragging
  if (!launched || dragging) {
    ctx.save();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 345);
    ctx.lineTo(bird.x, bird.y);
    ctx.moveTo(170, 345);
    ctx.lineTo(bird.x, bird.y);
    ctx.stroke();
    ctx.restore();
  }
}

// Remove showShotPopup function entirely

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Draw Slingshot
  drawSlingshot();

  // Draw Bird
  ctx.drawImage(bird.img, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);

  // Draw Enemies
  enemies.forEach(e => {
    if (e.alive)
      ctx.drawImage(e.img, e.x, e.y, e.w, e.h);
  });

  // Draw Blocks
  blocks.forEach(b => {
    if (!b.broken)
      ctx.drawImage(b.img, b.x, b.y, b.w, b.h);
  });

  // Draw TNT (explosion effect if exploded)
  tnts.forEach(tnt => {
    if (!tnt.exploded) {
      ctx.drawImage(tnt.img, tnt.x, tnt.y, tnt.w, tnt.h);
    } else if (shots === 0) {
      // Show explosion radius only for the first shot
      ctx.save();
      ctx.beginPath();
      ctx.arc(tnt.x + tnt.w / 2, tnt.y + tnt.h / 2, 110, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,180,0,0.7)";
      ctx.fill();
      ctx.restore();
    }
  });

  // Draw dashed aiming line if dragging
  if (dragging && bird.dragStart) {
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bird.x, bird.y);
    ctx.lineTo(bird.dragStart.x, bird.dragStart.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  update();
  requestAnimationFrame(draw);
}

draw();
</script>
