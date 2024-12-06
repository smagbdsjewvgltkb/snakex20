const loginForm = document.getElementById("login-form");
const loginContainer = document.getElementById("login-container");
const gameContainer = document.getElementById("game-container");
const userDisplay = document.getElementById("user-display");
const logoutButton = document.getElementById("logout");
const gameOverMessage = document.getElementById("game-over");
const restartButton = document.getElementById("restart-button");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
const rows = canvas.height / boxSize;
const columns = canvas.width / boxSize;

let snake = [{ x: 5, y: 5 }];
let food = generateFood();
let direction = { x: 1, y: 0 }; // Inicia moviéndose a la derecha
let isGameOver = false;
let gameInterval; // Variable para almacenar el intervalo de actualización

// Función para dibujar un cuadro
function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
}

// Función para dibujar las paredes
function drawWalls() {
  ctx.fillStyle = "#00ff00";
  for (let x = 0; x < columns; x++) {
    drawBox(x, 0, "#00ff00");
    drawBox(x, rows - 1, "#00ff00");
  }
  for (let y = 0; y < rows; y++) {
    drawBox(0, y, "#00ff00");
    drawBox(columns - 1, y, "#00ff00");
  }
}

// Función para dibujar la Snake
function drawSnake() {
  snake.forEach((segment) => drawBox(segment.x, segment.y, "#00ff00"));
}

// Función para dibujar la comida
function drawFood() {
  drawBox(food.x, food.y, "red");
}

// Función para generar una nueva comida que no esté dentro de las paredes
function generateFood() {
  let validPosition = false;
  let foodX, foodY;
  
  // Generar posiciones válidas para la comida
  while (!validPosition) {
    foodX = Math.floor(Math.random() * (columns - 2)) + 1; // Evitar las paredes (x: 1 - columns - 2)
    foodY = Math.floor(Math.random() * (rows - 2)) + 1;    // Evitar las paredes (y: 1 - rows - 2)
    
    // Verificar si la nueva posición de la comida no está dentro de la serpiente
    validPosition = !snake.some(segment => segment.x === foodX && segment.y === foodY);
  }

  return { x: foodX, y: foodY };
}

// Función para mover la Snake
function moveSnake() {
  if (isGameOver) return;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Verificar colisiones con las paredes o consigo misma
  if (
    head.x <= 0 || head.x >= columns - 1 || head.y <= 0 || head.y >= rows - 1 ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    isGameOver = true;
    gameOverMessage.style.display = "block";
    restartButton.style.display = "block";
    clearInterval(gameInterval); // Detener el juego al perder
    return;
  }

  snake.unshift(head);

  // Verificar si come
  if (head.x === food.x && head.y === food.y) {
    food = generateFood(); // Generar nueva comida
  } else {
    snake.pop();
  }
}

// Actualizar el juego
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar la pantalla
  drawWalls(); // Dibujar las paredes
  drawSnake(); // Dibujar la snake
  drawFood();  // Dibujar la comida
  moveSnake(); // Mover la snake
}

// Detectar teclas para mover la Snake
function handleKey(e) {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

document.addEventListener("keydown", handleKey);

// Login Persistente
function checkSession() {
  const user = localStorage.getItem("user");
  if (user) {
    userDisplay.textContent = user;
    loginContainer.style.display = "none";
    gameContainer.style.display = "block";
    gameInterval = setInterval(update, 200); // Iniciar el juego con un intervalo de 200ms
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username && password) {
    localStorage.setItem("user", username);
    userDisplay.textContent = username;
    loginContainer.style.display = "none";
    gameContainer.style.display = "block";
    gameInterval = setInterval(update, 200); // Iniciar el juego con un intervalo de 200ms
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("user");
  loginContainer.style.display = "block";
  gameContainer.style.display = "none";
  location.reload(); // Recargar la página para reiniciar el juego
});

restartButton.addEventListener("click", () => {
  // Reiniciar el juego
  snake = [{ x: 5, y: 5 }];
  food = generateFood(); // Generar comida válida
  direction = { x: 1, y: 0 };
  isGameOver = false;
  gameOverMessage.style.display = "none";
  restartButton.style.display = "none";
  gameInterval = setInterval(update, 200); // Iniciar el juego con un intervalo de 200ms
});

checkSession();