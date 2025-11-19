const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;

// Player
const player = {
  x: 300,
  y: 350,
  r: 10,
  speed: 4,
  color: "#4af"
};

// Collectible
let orb = {
  x: Math.random() * 580 + 10,
  y: Math.random() * 300 + 10,
  r: 6,
  color: "yellow"
};

// Obstacles
let obstacles = [];

function spawnObstacle() {
  obstacles.push({
    x: Math.random() * 580 + 10,
    y: -20,
    size: 20,
    speed: 2 + Math.random() * 3,
    color: "red"
  });
}

setInterval(spawnObstacle, 800);

// Movement tracking
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup",   e => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowLeft"] || keys["a"])  player.x -= player.speed;
  if (keys["ArrowRight"]|| keys["d"])  player.x += player.speed;
  if (keys["ArrowUp"]   || keys["w"])  player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"])  player.y += player.speed;

  // Keep inside canvas
  player.x = Math.max(player.r, Math.min(600 - player.r, player.x));
  player.y = Math.max(player.r, Math.min(400 - player.r, player.y));
}

function updateObstacles() {
  obstacles.forEach(o => o.y += o.speed);
  obstacles = obstacles.filter(o => o.y < 420);
}

function checkCollisions() {
  // Orb collection
  const dx = player.x - orb.x;
  const dy = player.y - orb.y;
  if (Math.hypot(dx, dy) < player.r + orb.r) {
    score += 10;
    document.getElementById("score").textContent = score;
    orb.x = Math.random() * 580 + 10;
    orb.y = Math.random() * 380 + 10;
  }

  // Obstacle collision
  for (let o of obstacles) {
    if (
      player.x > o.x - o.size/2 - player.r &&
      player.x < o.x + o.size/2 + player.r &&
      player.y > o.y - o.size/2 - player.r &&
      player.y < o.y + o.size/2 + player.r
    ) {
      gameOver = true;
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrb() {
  ctx.fillStyle = orb.color;
  ctx.beginPath();
  ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacles() {
  obstacles.forEach(o => {
    ctx.fillStyle = o.color;
    ctx.fillRect(o.x - o.size/2, o.y - o.size/2, o.size, o.size);
  });
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("GAME OVER", 200, 200);

    ctx.font = "20px Arial";
    ctx.fillText("Refresh to restart", 225, 240);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  updateObstacles();
  checkCollisions();

  drawPlayer();
  drawOrb();
  drawObstacles();

  requestAnimationFrame(loop);
}

loop();
